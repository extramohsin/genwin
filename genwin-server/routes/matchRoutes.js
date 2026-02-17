const express = require("express");
const asyncHandler = require("express-async-handler");
const { protect } = require("../middleware/authMiddleware");
const Match = require("../models/Match");
const User = require("../models/User");
const { toZonedTime } = require("date-fns-tz");

const router = express.Router();

// --- HELPER: Get Reveal Dates ---
const getRevealDates = () => {
  const timeZone = process.env.TIMEZONE || "Asia/Kolkata";
  const targetDay = parseInt(process.env.REVEAL_DAY) || 0; // 0 = Sunday
  const targetHour = parseInt(process.env.REVEAL_HOUR) || 20;
  const targetMinute = parseInt(process.env.REVEAL_MINUTE) || 0;

  const now = new Date();
  const zonedNow = toZonedTime(now, timeZone);
  
  // Calculate NEXT Reveal
  let nextReveal = new Date(zonedNow);
  nextReveal.setHours(targetHour, targetMinute, 0, 0);

  if (zonedNow.getDay() === targetDay) {
    if (zonedNow > nextReveal) {
      nextReveal.setDate(nextReveal.getDate() + 7);
    }
  } else {
    const daysUntil = (targetDay + 7 - zonedNow.getDay()) % 7;
    nextReveal.setDate(nextReveal.getDate() + daysUntil);
  }

  // Calculate PREVIOUS Reveal
  let prevReveal = new Date(nextReveal);
  prevReveal.setDate(prevReveal.getDate() - 7);

  return { nextReveal, prevReveal, zonedNow };
};

// --- ROUTES ---

// @desc    Submit Match Choices
// @route   POST /api/match/submit
// @access  Private
router.post(
  "/submit",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // 0. Check if already submitted
    const existingMatch = await Match.findOne({ userId });
    if (existingMatch) {
      return res.status(409).json({ message: "You have already submitted your choices." });
    }
    const { crushId, likeId, adoreId } = req.body;

    if (!crushId || !likeId || !adoreId) {
      return res.status(400).json({ message: "All 3 choices are required." });
    }

    // 1. Check if ANY are the same (No duplicates allowed) - DISABLED PER PRODUCT OWNER
    // if (crushId === likeId || crushId === adoreId || likeId === adoreId) {
    //   return res.status(400).json({ message: "You cannot select the same person twice!" });
    // }

    // 2. Check if user selected themselves (Double check via IDs)
    const currentUserId = req.user._id.toString();
    if ([crushId, likeId, adoreId].includes(currentUserId)) {
        return res.status(400).json({ message: "You cannot choose yourself! 😆" });
    }

    // 3. Verify Users Exist (By ID)
    const [crushUser, likeUser, adoreUser] = await Promise.all([
      User.findById(crushId),
      User.findById(likeId),
      User.findById(adoreId)
    ]);

    if (!crushUser || !likeUser || !adoreUser) {
      return res.status(404).json({ message: "One or more users not found." });
    }

    // 4. Save Match
    const newMatch = new Match({
      userId: req.user._id,
      crushUserId: crushUser._id,
      likeUserId: likeUser._id,
      adoreUserId: adoreUser._id,
      crush: crushUser.email, // Store email for admin/backup reference
      like: likeUser.email,
      adore: adoreUser.email
    });

    await newMatch.save(); // Added this line to actually save the newMatch

    res.status(201).json({ message: "Choices locked in successfully!" });
  })
);

// @desc    Get Match Status
// @route   GET /api/match/status
// @access  Private
router.get(
  "/status",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const match = await Match.findOne({ userId });
    
    const { nextReveal, prevReveal, zonedNow } = getRevealDates();

    // Reveal Window Logic: 
    // We unlock results if we are within X hours of the Previous Reveal
    // e.g., 24 Hours Window from Sunday 8PM to Monday 8PM
    const revealWindowHours = 24; 
    const windowEnd = new Date(prevReveal);
    windowEnd.setHours(windowEnd.getHours() + revealWindowHours);

    const isRevealWindow = zonedNow >= prevReveal && zonedNow < windowEnd;
    
    // If we are in the window, status is UNLOCKED
    // If not, we are counting down to NEXT reveal
    const isLocked = !isRevealWindow;

    const remainingTime = isLocked 
        ? Math.max(0, nextReveal.getTime() - zonedNow.getTime())
        : 0;

    res.json({
      hasSubmitted: !!match,
      isLocked,
      remainingTime,
      nextRevealAt: nextReveal.toISOString(),
      isRevealWindow // Optional for frontend debug
    });
  })
);

// @desc    Get Match Results
// @route   GET /api/match/result
// @access  Private
router.get(
  "/result",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { nextReveal, prevReveal, zonedNow } = getRevealDates();
    
    // Uncomment to enforce lock
    // const revealWindowHours = 24; 
    // const windowEnd = new Date(prevReveal);
    // windowEnd.setHours(windowEnd.getHours() + revealWindowHours);
    // const isRevealWindow = zonedNow >= prevReveal && zonedNow < windowEnd;

    // if (!isRevealWindow) {
    //      // return res.status(403).json({ message: "Results are currently locked." });
    // }

    // 1. Get My Choices
    const myMatch = await Match.findOne({ userId });
    if (!myMatch) {
        return res.status(404).json({ message: "No submission found." });
    }

    // Map my choices: ID -> Category
    const myChoices = {};
    if (myMatch.crushUserId) myChoices[myMatch.crushUserId.toString()] = "Crush";
    if (myMatch.likeUserId) myChoices[myMatch.likeUserId.toString()] = "Like";
    if (myMatch.adoreUserId) myChoices[myMatch.adoreUserId.toString()] = "Adore";

    const mySelectedIds = Object.keys(myChoices);

    if (mySelectedIds.length === 0) {
        return res.json({ locked: false, matches: [], count: 0 });
    }

    // 2. Find Matches of people I selected
    // We look for any Match document where the userId is one of the people I selected
    const potentialMatches = await Match.find({ 
        userId: { $in: mySelectedIds } 
    }).populate('userId', 'fullName branch year email');

    const confirmedMatches = [];

    // 3. Check for MUTUALITY (Cross-Slot)
    // For each person I selected, did they select me back?
    potentialMatches.forEach(theirMatch => {
        const theirId = theirMatch.userId._id.toString();
        const myIdStr = userId.toString();

        let theirCategory = null;

        // Did they select me in ANY slot?
        if (theirMatch.crushUserId && theirMatch.crushUserId.toString() === myIdStr) theirCategory = "Crush";
        else if (theirMatch.likeUserId && theirMatch.likeUserId.toString() === myIdStr) theirCategory = "Like";
        else if (theirMatch.adoreUserId && theirMatch.adoreUserId.toString() === myIdStr) theirCategory = "Adore";

        if (theirCategory) {
            confirmedMatches.push({
                matchedUser: {
                    _id: theirMatch.userId._id, // Send ID for copying
                    fullName: theirMatch.userId.fullName,
                    branch: theirMatch.userId.branch,
                    year: theirMatch.userId.year
                    // Email hidden intentionally from results
                },
                myCategory: myChoices[theirId], // What I picked them as
                theirCategory: theirCategory      // What they picked me as
            });
        }
    });

    res.json({
        locked: false,
        matches: confirmedMatches,
        count: confirmedMatches.length
    });
  })
);

module.exports = router;

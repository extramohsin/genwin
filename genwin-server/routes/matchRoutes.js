const express = require("express");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Match = require("../models/Match");
const User = require("../models/User");

const router = express.Router();

// 🕒 GLOBAL REVEAL CONFIGURATION
// You can move this to .env later: process.env.REVEAL_DATE
const REVEAL_DATE = new Date("2026-02-15T20:00:00"); // Example: Sunday 8PM

// ✅ SUBMIT MATCH PREFERENCES (One-time only, strict validation)
router.post(
  "/submit",
  asyncHandler(async (req, res) => {
    const { userId, crush, like, adore } = req.body;

    // 1. Basic Validation
    if (!userId || !crush || !like || !adore) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // 2. Check strict one-time submission rule
    const existingMatch = await Match.findOne({ userId });
    if (existingMatch) {
      return res.status(409).json({ message: "You have already submitted your choices." });
    }

    // 3. Validate that selected users actually exist in DB
    // We expect basic User IDs (ObjectIds) to be sent from frontend
    const selectedIds = [crush, like, adore];
    
    // ALLOW DUPLICATES: removed the check for new Set(selectedIds).size !== 3

    const validUsers = await User.find({ _id: { $in: selectedIds } });
    // We just need to make sure the users exist. If duplicates are allowed, 
    // validUsers.length might be less than 3 if they selected the same person 3 times.
    // So we check if all selected IDs resolve to a valid user.
    
    const validUserIds = validUsers.map(u => u._id.toString());
    const allExist = selectedIds.every(id => validUserIds.includes(id));

    if (!allExist) {
      return res.status(400).json({ message: "One or more selected users do not exist." });
    }

    // 4. Save Submission
    const newMatch = new Match({
      userId,
      crush,
      like,
      adore,
    });

    await newMatch.save();

    res.status(201).json({ message: "Choices locked in successfully! 💘" });
  })
);

// ✅ GET MATCH STATUS (Locked/Unlocked & Countdown)
router.get(
  "/status/:userId",
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const match = await Match.findOne({ userId }).populate("crush like adore", "fullName");
    
    const now = new Date();
    const isLocked = now < REVEAL_DATE;
    const remainingTime = REVEAL_DATE - now;

    res.json({
      submitted: !!match,
      choices: match ? [match.crush?.fullName, match.like?.fullName, match.adore?.fullName].filter(Boolean) : [],
      isLocked,
      nextRevealAt: REVEAL_DATE,
      remainingTime: remainingTime > 0 ? remainingTime : 0,
    });
  })
);

// ✅ GET MATCH RESULTS (Mutual Matches Only)
router.get(
  "/results/:userId",
  asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // 1. Check Lock Status
    if (new Date() < REVEAL_DATE) {
      return res.status(403).json({ 
        message: "Results are still locked!",
        locked: true,
        nextRevealAt: REVEAL_DATE 
      });
    }

    // 2. Get User's Submission
    const myMatch = await Match.findOne({ userId });
    if (!myMatch) {
      return res.json({ matches: [] }); // User never submitted
    }

    // 3. Find Mutual Matches
    // We need to check if the people I selected (Crush/Like/Adore) also selected Me
    
    const mySelections = [
      { id: myMatch.crush, type: "Crush" },
      { id: myMatch.like, type: "Like" },
      { id: myMatch.adore, type: "Adore" }
    ];

    const mutualMatches = [];

    for (const selection of mySelections) {
      // Find the other person's match document
      const theirMatch = await Match.findOne({ userId: selection.id });

      if (theirMatch) {
        // Check if they selected me in any category
        let theyLikedMeAs = null;
        if (theirMatch.crush.toString() === userId) theyLikedMeAs = "Crush";
        else if (theirMatch.like.toString() === userId) theyLikedMeAs = "Like";
        else if (theirMatch.adore.toString() === userId) theyLikedMeAs = "Adore";

        if (theyLikedMeAs) {
          // It's a match! Fetch their details
          const matchedUser = await User.findById(selection.id).select("fullName username branch year email");
          
          mutualMatches.push({
            fullName: matchedUser.fullName,
            username: matchedUser.username,
            branch: matchedUser.branch,
            year: matchedUser.year,
            email: matchedUser.email,
            myType: selection.type,
            theirType: theyLikedMeAs,
            type: `${selection.type} ↔ ${theyLikedMeAs}`
          });
        }
      }
    }

    res.json({
      locked: false,
      matches: mutualMatches
    });
  })
);

// ✅ SEARCH USERS (For Autocomplete)
router.get(
  "/search",
  asyncHandler(async (req, res) => {
    const { query, excludedUserId } = req.query;
    console.log("API Search Query:", query, "Excluding:", excludedUserId); // DEBUG
    if (!query || query.length < 2) return res.json([]);

    const filter = {
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } }
      ]
    };

    if (excludedUserId) {
        filter._id = { $ne: excludedUserId };
    }

    const users = await User.find(filter).select("fullName username branch year _id").limit(10);
    
    console.log("API Search Results:", users.length); // DEBUG

    res.json(users);
  })
);

module.exports = router;

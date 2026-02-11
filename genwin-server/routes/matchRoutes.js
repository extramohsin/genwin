const express = require("express");
const asyncHandler = require("express-async-handler");
const Match = require("../models/Match");
const User = require("../models/User");
const mongoose = require("mongoose");

const router = express.Router();

// ✅ SUBMIT MATCH CHOICES
router.post(
  "/submit",
  asyncHandler(async (req, res) => {
    const { userId, crush, like, adore } = req.body;

    if (!userId || !crush || !like || !adore) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if usernames exist
    const crushUser = await User.findOne({ username: crush.toLowerCase() });
    const likeUser = await User.findOne({ username: like.toLowerCase() });
    const adoreUser = await User.findOne({ username: adore.toLowerCase() });

    if (!crushUser || !likeUser || !adoreUser) {
        let invalid = [];
        if(!crushUser) invalid.push(crush);
        if(!likeUser) invalid.push(like);
        if(!adoreUser) invalid.push(adore);
        return res.status(400).json({ error: `Users not found: ${invalid.join(", ")}` });
    }

    // Default delay: 3 days (can be overridden by env)
    const delayDays = parseInt(process.env.REVEAL_DELAY_DAYS) || 3;
    const revealDate = new Date();
    revealDate.setDate(revealDate.getDate() + delayDays);

    const matchEntry = await Match.findOneAndUpdate(
      { userId },
      {
        userId,
        crush: crush.toLowerCase(),
        like: like.toLowerCase(),
        adore: adore.toLowerCase(),
        revealDate,
      },
      { new: true, upsert: true } // Create if not exists, update if exists
    );

    res.status(201).json({ message: "Choices submitted successfully!", revealDate: matchEntry.revealDate });
  })
);

// ✅ GET MATCH STATUS (Check if submitted and if results ready)
router.get(
  "/status/:userId",
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    const matchEntry = await Match.findOne({ userId });

    if (!matchEntry) {
      return res.json({ submitted: false });
    }

    const now = new Date();
    const isReady = now >= matchEntry.revealDate;

    res.json({
      submitted: true,
      revealDate: matchEntry.revealDate,
      isReady,
    });
  })
);

// ✅ GET RESULTS (Only if reveal date passed)
router.get(
  "/result/:userId",
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const matchEntry = await Match.findOne({ userId });

    if (!matchEntry) {
      return res.status(404).json({ error: "No choices submitted yet." });
    }

    // Check Reveal Date
    if (new Date() < matchEntry.revealDate) {
       const remainingTime = matchEntry.revealDate.getTime() - Date.now();
       return res.status(200).json({ locked: true, remainingTime, revealDate: matchEntry.revealDate });
    }

    // Retrieve current user username to check against others
    const currentUser = await User.findById(userId);
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    const myUsername = currentUser.username;
    let matches = [];

    // Helper to check mutual
    const checkMutual = async (targetUsername) => {
       const targetUser = await User.findOne({ username: targetUsername });
       if (!targetUser) return null;

       const targetMatch = await Match.findOne({ userId: targetUser._id });
       if (!targetMatch) return null;

       const targetChoices = [targetMatch.crush, targetMatch.like, targetMatch.adore];
       if (targetChoices.includes(myUsername)) {
           return { username: targetUser.username, fullName: targetUser.fullName };
       }
       return null;
    };

    const crushMatch = await checkMutual(matchEntry.crush);
    if (crushMatch) matches.push({ ...crushMatch, type: "Crush" });

    const likeMatch = await checkMutual(matchEntry.like);
    if (likeMatch) matches.push({ ...likeMatch, type: "Like" });

    const adoreMatch = await checkMutual(matchEntry.adore);
    if (adoreMatch) matches.push({ ...adoreMatch, type: "Adore" });

    res.json({
        locked: false,
        matches,
        count: matches.length
    });
  })
);

module.exports = router;

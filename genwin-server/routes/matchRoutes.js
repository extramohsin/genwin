const express = require("express");
const asyncHandler = require("express-async-handler");
const Match = require("../models/Match");
const User = require("../models/User");
const mongoose = require("mongoose");

const router = express.Router();

// Submit match preferences
router.post("/submit", asyncHandler(async (req, res) => {
  try {
    const { userId, crush, like, adore } = req.body;

    // Validate inputs
    if (!userId || !crush || !like || !adore) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if names exist in the database
    const selectedNames = [crush, like, adore];
    const existingUsers = await User.find({ fullName: { $in: selectedNames } });
    
    if (existingUsers.length !== 3) {
      return res.status(400).json({ 
        error: "One or more selected names are not registered users" 
      });
    }

    // Prevent duplicate selections
    if (new Set(selectedNames).size !== 3) {
      return res.status(400).json({ 
        error: "Please select different names for each category" 
      });
    }

    // Create or update match with results visible after 7 days
    const match = await Match.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { 
        crush, 
        like, 
        adore,
        resultsVisibleDate: new Date(+new Date() + 7*24*60*60*1000)
      },
      { new: true, upsert: true }
    );

    res.status(201).json({
      message: "Match preferences submitted successfully! Results will be visible in 7 days.",
      resultsVisibleDate: match.resultsVisibleDate
    });
  } catch (err) {
    console.error("Error submitting match:", err);
    res.status(500).json({ error: "Server error, please try again later" });
  }
}));

// Get match results
router.get("/results/:userId", asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user's match
    const userMatch = await Match.findOne({ 
      userId: new mongoose.Types.ObjectId(userId) 
    }).populate('userId', 'fullName');

    if (!userMatch) {
      return res.status(404).json({ 
        error: "No match submission found" 
      });
    }

    // Check if results are ready to be shown
    if (new Date() < userMatch.resultsVisibleDate) {
      const timeRemaining = userMatch.resultsVisibleDate - new Date();
      const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
      
      return res.json({
        status: "pending",
        message: `Results will be visible in ${daysRemaining} days`,
        resultsVisibleDate: userMatch.resultsVisibleDate,
        userSelections: {
          crush: userMatch.crush,
          like: userMatch.like,
          adore: userMatch.adore
        }
      });
    }

    // Get current user's name
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find mutual matches
    const mutualMatches = await Match.aggregate([
      {
        $match: {
          userId: { $ne: new mongoose.Types.ObjectId(userId) },
          $or: [
            { crush: currentUser.fullName },
            { like: currentUser.fullName },
            { adore: currentUser.fullName }
          ]
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          matchedUser: "$user.fullName",
          branch: "$user.branch",
          year: "$user.year",
          theyLikedYouAs: {
            $cond: [
              { $eq: ["$crush", currentUser.fullName] },
              "crush",
              {
                $cond: [
                  { $eq: ["$like", currentUser.fullName] },
                  "like",
                  "adore"
                ]
              }
            ]
          },
          youLikedThemAs: {
            $cond: [
              { $eq: [userMatch.crush, "$user.fullName"] },
              "crush",
              {
                $cond: [
                  { $eq: [userMatch.like, "$user.fullName"] },
                  "like",
                  "adore"
                ]
              }
            ]
          }
        }
      }
    ]);

    res.json({
      status: "ready",
      userSelections: {
        crush: userMatch.crush,
        like: userMatch.like,
        adore: userMatch.adore
      },
      matches: mutualMatches.map(match => ({
        ...match,
        matchDescription: `You liked them as "${match.youLikedThemAs}", they liked you as "${match.theyLikedYouAs}"!`
      }))
    });
  } catch (err) {
    console.error("Error getting match results:", err);
    res.status(500).json({ error: "Server error, please try again later" });
  }
}));

// Get name suggestions
router.get("/suggestions", asyncHandler(async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.json([]);
    }

    const users = await User.find({
      fullName: { $regex: query, $options: 'i' },
    })
    .select('fullName branch year')
    .limit(10);

    res.json(users);
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    res.status(500).json({ error: "Server error" });
  }
}));

module.exports = router;

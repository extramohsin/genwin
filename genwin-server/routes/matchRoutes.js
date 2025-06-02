const express = require("express");
const asyncHandler = require("express-async-handler");
const Match = require("../models/Match");
const User = require("../models/User");
const mongoose = require("mongoose");

const router = express.Router();

// Get name suggestions based on input
router.get("/suggestions", asyncHandler(async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const users = await User.find({
      fullName: { $regex: new RegExp(query, 'i') }
    })
    .select('fullName branch year')
    .limit(10);

    res.json(users);
  } catch (err) {
    console.error("❌ Error getting suggestions:", err);
    res.status(500).json({ error: "Server error" });
  }
}));

// Submit a new match
router.post("/submit", asyncHandler(async (req, res) => {
  try {
    const { userId, crush, like, adore } = req.body;

    // Validate inputs
    if (!userId || !crush || !like || !adore) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Verify all names exist in the database
    const names = [crush, like, adore];
    const existingUsers = await User.find({ fullName: { $in: names } });
    if (existingUsers.length !== 3) {
      return res.status(400).json({ error: "One or more selected names do not exist" });
    }

    // Update or create match
    const match = await Match.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { crush, like, adore },
      { new: true, upsert: true }
    );

    // Check for mutual matches
    const mutualMatches = await Match.aggregate([
      {
        $match: {
          userId: { $ne: new mongoose.Types.ObjectId(userId) },
          $or: [
            { crush: { $in: [crush, like, adore] } },
            { like: { $in: [crush, like, adore] } },
            { adore: { $in: [crush, like, adore] } }
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
          _id: 1,
          matchedUser: "$user.fullName",
          matchType: {
            $cond: [
              { $eq: ["$crush", match.crush] }, "crush",
              { $cond: [{ $eq: ["$like", match.like] }, "like", "adore"] }
            ]
          }
        }
      }
    ]);

    res.json({
      message: "Match submitted successfully",
      match,
      mutualMatches
    });
  } catch (err) {
    console.error("❌ Error submitting match:", err);
    res.status(500).json({ error: "Server error" });
  }
}));

// Get matches for a user
router.get("/results/:userId", asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user's matches
    const userMatch = await Match.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!userMatch) {
      return res.json({ matches: [] });
    }

    // Find mutual matches
    const mutualMatches = await Match.aggregate([
      {
        $match: {
          userId: { $ne: new mongoose.Types.ObjectId(userId) },
          $or: [
            { crush: { $in: [userMatch.crush, userMatch.like, userMatch.adore] } },
            { like: { $in: [userMatch.crush, userMatch.like, userMatch.adore] } },
            { adore: { $in: [userMatch.crush, userMatch.like, userMatch.adore] } }
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
          matchType: {
            $cond: [
              { $eq: ["$crush", userMatch.crush] }, "crush",
              { $cond: [{ $eq: ["$like", userMatch.like] }, "like", "adore"] }
            ]
          }
        }
      }
    ]);

    res.json({
      matches: mutualMatches,
      userSelections: {
        crush: userMatch.crush,
        like: userMatch.like,
        adore: userMatch.adore
      }
    });
  } catch (err) {
    console.error("❌ Error getting matches:", err);
    res.status(500).json({ error: "Server error" });
  }
}));

module.exports = router;

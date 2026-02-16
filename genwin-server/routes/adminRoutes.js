const express = require("express");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Match = require("../models/Match");
const User = require("../models/User");

const { adminAuth } = require("../middleware/adminAuthMiddleware");

const router = express.Router();

// Admin credentials (in production, use environment variables)
const ADMIN_EMAIL = "mohsinmalik1511@gmail.com";
const ADMIN_PASSWORD = "admin123";

// Admin login
router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid admin credentials" });
  }
}));

// Get all matches with user details
router.get("/matches", adminAuth, asyncHandler(async (req, res) => {
  const matches = await Match.find()
    .populate("userId", "fullName email branch year")
    .populate("crushUserId", "fullName")
    .populate("likeUserId", "fullName")
    .populate("adoreUserId", "fullName");
  
  // Format for frontend
  const formattedMatches = matches.map(m => ({
    _id: m._id,
    user: m.userId ? {
        fullName: m.userId.fullName,
        email: m.userId.email,
        branch: m.userId.branch,
        year: m.userId.year
    } : { fullName: "Unknown", email: "-", branch: "-", year: "-" },
    crush: m.crushUserId ? m.crushUserId.fullName : (m.crush || "-"), // Fallback to old string if ID missing
    like: m.likeUserId ? m.likeUserId.fullName : (m.like || "-"),
    adore: m.adoreUserId ? m.adoreUserId.fullName : (m.adore || "-"),
    createdAt: m.createdAt
  }));

  res.json(formattedMatches);
}));

// Get Reported Messages
router.get("/reported-messages", adminAuth, asyncHandler(async (req, res) => {
    const messages = await require("../models/ChatMessage").find({ reportsCount: { $gt: 0 }, isDeleted: false })
        .sort({ reportsCount: -1 })
        .limit(50);
    res.json(messages);
}));

module.exports = router;

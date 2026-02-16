const express = require("express");
const asyncHandler = require("express-async-handler");
const Feedback = require("../models/Feedback");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const { adminAuth } = require("../middleware/adminAuthMiddleware");

const router = express.Router();

// Middleware: Verify Token (User)
const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Rate Limiting (Simple in-memory for MVP, ideal: Redis)
const feedbackTimestamps = new Map();

// ✅ Submit Feedback (User)
router.post(
  "/submit",
  protect,
  asyncHandler(async (req, res) => {
    const { category, message } = req.body;
    const userId = req.user._id.toString();

    // 1. Rate Limiting Check (60 seconds cooldown)
    const lastSubmission = feedbackTimestamps.get(userId);
    const now = Date.now();
    if (lastSubmission && now - lastSubmission < 60000) {
      res.status(429);
      throw new Error("Please wait 60 seconds before submitting another feedback.");
    }
    feedbackTimestamps.set(userId, now);

    // 2. Validate
    if (!message || message.trim().length === 0) {
      res.status(400);
      throw new Error("Message cannot be empty.");
    }

    // 3. Create Feedback
    const feedback = new Feedback({
      userId: req.user._id,
      username: req.user.username || "Anonymous", // Fallback
      fullName: req.user.fullName,
      category,
      message,
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully! 🚀" });
  })
);

// ✅ Get All Feedback (Admin Only)
router.get(
  "/all",
  adminAuth, 
  asyncHandler(async (req, res) => {
    const feedbackList = await Feedback.find({}).sort({ createdAt: -1 });
    res.json(feedbackList);
  })
);

// ✅ Update Feedback Status (Admin Only)
router.patch(
  "/:id/status",
  adminAuth,
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    const feedback = await Feedback.findById(req.params.id);

    if (feedback) {
      feedback.status = status;
      await feedback.save();
      res.json(feedback);
    } else {
      res.status(404);
      throw new Error("Feedback not found");
    }
  })
);

module.exports = router;

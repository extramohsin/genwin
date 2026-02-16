const express = require("express");
const asyncHandler = require("express-async-handler");
const { protect } = require("../middleware/authMiddleware");
const { adminAuth } = require("../middleware/adminAuthMiddleware");
const ChatMessage = require("../models/ChatMessage");

const router = express.Router();

// @desc    Get Chat History
// @route   GET /api/chat/history
// @access  Public (or Protected? User said Protected for socket, usually chat feed is visible to auth users)
router.get(
  "/history",
  protect,
  asyncHandler(async (req, res) => {
    // Return last 50 messages, newest first, exclude deleted
    const messages = await ChatMessage.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(50);
    
    // Reverse to show oldest -> newest on client (if needed) or client sorts
    // usually client wants oldest at top for scroll, so we reverse here
    res.json(messages.reverse());
  })
);

// @desc    Report a Message
// @route   POST /api/chat/report/:id
// @access  Private
router.post(
  "/report/:id",
  protect,
  asyncHandler(async (req, res) => {
    const msg = await ChatMessage.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    msg.reportsCount += 1;
    await msg.save();

    res.json({ message: "Report submitted." });
  })
);

// @desc    Hard Delete Message (Admin) or Soft Delete
// @route   DELETE /api/chat/:id
// @access  Admin
router.delete(
  "/:id",
  adminAuth,
  asyncHandler(async (req, res) => {
    const msg = await ChatMessage.findById(req.params.id);
    if (msg) {
        msg.isDeleted = true;
        await msg.save();
        res.json({ message: "Message deleted" });
    } else {
        res.status(404).json({ message: "Message not found" });
    }
  })
);

module.exports = router;

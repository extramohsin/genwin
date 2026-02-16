const express = require("express");
const asyncHandler = require("express-async-handler");
const { protect } = require("../middleware/authMiddleware");
const Poll = require("../models/Poll");

const router = express.Router();

// @desc    Get Active Poll
// @route   GET /api/poll/active
// @access  Private
router.get(
  "/active",
  protect,
  asyncHandler(async (req, res) => {
    // Get the most recent active poll
    let poll = await Poll.findOne({ isActive: true }).sort({ createdAt: -1 });
    
    // Check if we need to seed a default poll (if none exists)
    if (!poll) {
         poll = await Poll.create({
             question: "Who texts first usually? 📱",
             options: [
                 { text: "Me, always 🤡", votes: 5 },
                 { text: "Them 💅", votes: 3 },
                 { text: "It's mutual 🤝", votes: 2 }
             ]
         });
    }

    res.json(poll);
  })
);

// @desc    Vote on Poll
// @route   POST /api/poll/vote/:id
// @access  Private
router.post(
  "/vote/:id",
  protect,
  asyncHandler(async (req, res) => {
    const { optionIndex } = req.body; // 0, 1, 2...

    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    if (poll.options[optionIndex]) {
        poll.options[optionIndex].votes += 1;
        await poll.save();
        res.json(poll);
    } else {
        res.status(400).json({ message: "Invalid option" });
    }
  })
);

module.exports = router;

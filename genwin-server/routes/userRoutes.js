const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const User = require("../models/User"); // Import the User model

// Handle GET request with branch filter
router.get(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const { branch } = req.query;

      if (!branch) {
        return res.status(400).json({ error: "Branch is required" });
      }

      const users = await User.find({ branch }); // Fetch users by branch
      res.json(users);
    } catch (error) {
      console.error("Error fetching users by branch:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  })
);

const { protect } = require("../middleware/authMiddleware"); // Import protect middleware

// ✅ SEARCH USERS (For Autocomplete) - PROTECTED to exclude self
router.get(
  "/search",
  protect, 
  asyncHandler(async (req, res) => {
    const { q } = req.query;
    const currentUserId = req.user._id;

    if (!q) {
      return res.status(400).json({ users: [] });
    }

    // SANITIZE QUERY: Escape special regex characters to prevent ReDoS or logic errors
    const safeQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const users = await User.find({
      _id: { $ne: currentUserId }, // Exclude current user
      $or: [
        { fullName: { $regex: safeQuery, $options: "i" } },
        // We still allow searching by email if they know it, but we won't return it
        { email: { $regex: safeQuery, $options: "i" } }
      ]
    })
      .select("_id fullName branch year") // RETURN ONLY THESE FIELDS (NO EMAIL)
      .limit(10); // LIMIT TO 10 RESULTS

    res.json({ users });
  })
);

module.exports = router;

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

// ✅ SEARCH USERS (For Autocomplete)
router.get(
  "/search",
  asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ users: [] });
    }

    const users = await User.find({
      username: { $regex: q, $options: "i" }, // Case-insensitive partial match
    })
      .select("username branch year -_id")
      .limit(5); // Limit suggestions

    res.json({ users });
  })
);

module.exports = router;

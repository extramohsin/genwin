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

module.exports = router;

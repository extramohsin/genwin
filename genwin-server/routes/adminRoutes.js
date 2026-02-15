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
  const matches = await Match.aggregate([
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
      $lookup: {
        from: "users",
        localField: "crush",
        foreignField: "_id",
        as: "crushUrl"
      }
    },
    { $unwind: { path: "$crushUrl", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "like",
        foreignField: "_id",
        as: "likeUrl"
      }
    },
    { $unwind: { path: "$likeUrl", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "adore",
        foreignField: "_id",
        as: "adoreUrl"
      }
    },
    { $unwind: { path: "$adoreUrl", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        user: {
            fullName: "$user.fullName",
            email: "$user.email",
            branch: "$user.branch",
            year: "$user.year"
        },
        crush: "$crushUrl.fullName",
        like: "$likeUrl.fullName",
        adore: "$adoreUrl.fullName",
        createdAt: 1
      }
    }
  ]);

  res.json(matches);
}));

module.exports = router;
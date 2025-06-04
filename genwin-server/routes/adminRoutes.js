const express = require("express");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Match = require("../models/Match");
const User = require("../models/User");

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

// Admin middleware
const adminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: "Not authorized" });
    }

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

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
      $project: {
        "user.password": 0,
        "user.__v": 0,
        __v: 0
      }
    }
  ]);

  res.json(matches);
}));

module.exports = router;
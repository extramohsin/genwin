const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const router = express.Router();

// ✅ USER SIGNUP (With Unique Name & Email Check)
// ✅ USER SIGNUP (With Unique Username, Name & Email Check)
router.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const { fullName, username, email, password, branch, year } = req.body;

    if (!fullName || !username || !email || !password || !branch || !year) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedUsername = username.trim().toLowerCase();

    // 🔍 Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: trimmedEmail }, { username: trimmedUsername }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email or username already exists." });
    }

    // 🔐 Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 📌 Save new user
    const newUser = new User({
      fullName,
      username: trimmedUsername,
      email: trimmedEmail,
      password: hashedPassword,
      branch,
      year,
    });

    await newUser.save();
    res.status(201).json({ message: "Signup successful! Please log in." });
  })
);

// ✅ USER LOGIN
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // 🔑 Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful!",
      token,
      userId: user._id,
      username: user.username,
      fullName: user.fullName,
      branch: user.branch,
      year: user.year,
    });
  })
);

module.exports = router;

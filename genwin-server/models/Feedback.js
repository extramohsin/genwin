const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Suggestion", "Complaint", "Bug Report", "Abuse Report", "Other"],
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  status: {
    type: String,
    enum: ["pending", "reviewed", "resolved"],
    default: "pending",
  },
  adminReply: {
    type: String, // Optional reply from admin
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Feedback", feedbackSchema);

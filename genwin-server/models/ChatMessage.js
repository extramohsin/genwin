const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    anonName: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatMessage",
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    reportsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// TTL Index: Auto-delete after 24 hours (86400 seconds)
chatMessageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);

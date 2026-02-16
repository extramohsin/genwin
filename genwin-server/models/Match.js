const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Enforce one-time submission
    },
    // References for fast matching
    crushUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likeUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    adoreUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    // Stored usernames (lowercase) for display/backup
    crush: { type: String, required: true, lowercase: true, trim: true },
    like: { type: String, required: true, lowercase: true, trim: true },
    adore: { type: String, required: true, lowercase: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Match", matchSchema);

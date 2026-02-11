const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Ensures each user can submit only once
    },
    crush: { type: String, required: true, lowercase: true, trim: true },
    like: { type: String, required: true, lowercase: true, trim: true },
    adore: { type: String, required: true, lowercase: true, trim: true },
    revealDate: { type: Date, required: true },
    isRevealed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Match", matchSchema);

const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Ensures each user can submit only once
    },
    crush: { type: String, required: true },
    like: { type: String, required: true },
    adore: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Match", matchSchema);

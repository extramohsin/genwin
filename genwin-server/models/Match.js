const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    crush: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    like: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adore: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resultsVisibleDate: {
      type: Date,
      default: () => new Date(+new Date() + 7*24*60*60*1000) // 7 days from submission
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Match", matchSchema);

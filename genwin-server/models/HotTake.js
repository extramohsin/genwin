const mongoose = require("mongoose");

const hotTakeSchema = new mongoose.Schema({
  statement: { type: String, required: true },
  agreeVotes: { type: Number, default: 0 },
  disagreeVotes: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("HotTake", hotTakeSchema);

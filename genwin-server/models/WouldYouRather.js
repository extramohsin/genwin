const mongoose = require("mongoose");

const wyrSchema = new mongoose.Schema({
  optionA: { type: String, required: true },
  optionB: { type: String, required: true },
  votesA: { type: Number, default: 0 },
  votesB: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("WouldYouRather", wyrSchema);

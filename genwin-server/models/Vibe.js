const mongoose = require("mongoose");

const vibeSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // Format: YYYY-MM-DD
  Happy: { type: Number, default: 0 },
  Nervous: { type: Number, default: 0 },
  Excited: { type: Number, default: 0 },
  Bored: { type: Number, default: 0 },
  Crushing: { type: Number, default: 0 },
  Chaotic: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Vibe", vibeSchema);

const express = require("express");
const asyncHandler = require("express-async-handler");
const { protect } = require("../middleware/authMiddleware");
const HotTake = require("../models/HotTake");
const WouldYouRather = require("../models/WouldYouRather");
const Vibe = require("../models/Vibe");

const router = express.Router();

// Helper to get today's date string YYYY-MM-DD
const getTodayStr = () => new Date().toISOString().split('T')[0];

// --- HOT TAKES ---
router.get("/hottakes/active", protect, asyncHandler(async (req, res) => {
  let activeTake = await HotTake.findOne({ isActive: true });
  if (!activeTake) {
    activeTake = await HotTake.create({ statement: "Pineapple belongs on pizza.", isActive: true });
  }
  res.json(activeTake);
}));

router.post("/hottakes/:id/vote", protect, asyncHandler(async (req, res) => {
  const { vote } = req.body; // 'agree' or 'disagree'
  if (vote === 'agree') {
    await HotTake.findByIdAndUpdate(req.params.id, { $inc: { agreeVotes: 1 } });
  } else if (vote === 'disagree') {
    await HotTake.findByIdAndUpdate(req.params.id, { $inc: { disagreeVotes: 1 } });
  }
  const updated = await HotTake.findById(req.params.id);
  res.json(updated);
}));

// --- WOULD YOU RATHER ---
router.get("/wyr/active", protect, asyncHandler(async (req, res) => {
  let activeWyr = await WouldYouRather.findOne({ isActive: true });
  if (!activeWyr) {
    activeWyr = await WouldYouRather.create({ 
      optionA: "Have unlimited free food for life", 
      optionB: "Have unlimited free flights for life", 
      isActive: true 
    });
  }
  res.json(activeWyr);
}));

router.post("/wyr/:id/vote", protect, asyncHandler(async (req, res) => {
  const { vote } = req.body; // 'A' or 'B'
  if (vote === 'A') {
    await WouldYouRather.findByIdAndUpdate(req.params.id, { $inc: { votesA: 1 } });
  } else if (vote === 'B') {
    await WouldYouRather.findByIdAndUpdate(req.params.id, { $inc: { votesB: 1 } });
  }
  const updated = await WouldYouRather.findById(req.params.id);
  res.json(updated);
}));

// --- VIBE CHECK ---
router.get("/vibe/today", protect, asyncHandler(async (req, res) => {
  const today = getTodayStr();
  let vibe = await Vibe.findOne({ date: today });
  if (!vibe) {
    vibe = await Vibe.create({ date: today });
  }
  res.json(vibe);
}));

router.post("/vibe/vote", protect, asyncHandler(async (req, res) => {
  const { mood } = req.body; // 'Happy', 'Nervous', 'Excited', 'Bored', 'Crushing', 'Chaotic'
  const today = getTodayStr();
  
  const validMoods = ['Happy', 'Nervous', 'Excited', 'Bored', 'Crushing', 'Chaotic'];
  if (!validMoods.includes(mood)) {
    return res.status(400).json({ message: "Invalid mood" });
  }

  const update = { $inc: {} };
  update.$inc[mood] = 1;

  await Vibe.findOneAndUpdate({ date: today }, update, { new: true, upsert: true });
  const updated = await Vibe.findOne({ date: today });
  res.json(updated);
}));

// --- PRESENCE ---
router.get("/presence/count", protect, (req, res) => {
  // Return the count of sockets connected to waiting-room.
  // We'll inject `io` or just rely on the socket broadcast mostly.
  res.json({ count: global.onlineCount || 1 });
});

module.exports = router;

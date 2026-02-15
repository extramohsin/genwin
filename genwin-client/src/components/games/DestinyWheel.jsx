import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Dices, RefreshCw } from "lucide-react";
import Button from "../ui/Button";
import GlassCard from "../ui/GlassCard";
import confetti from "canvas-confetti";

const OUTCOMES = [
  { text: "Text them tonight 🌙", color: "#FFFFFF", bg: "#EC4899" }, // Pink
  { text: "They are thinking about you 💭", color: "#FFFFFF", bg: "#8B5CF6" }, // Purple
  { text: "Stop dreaming bro 💀", color: "#FFFFFF", bg: "#EF4444" }, // Red
  { text: "They will confess soon 💌", color: "#FFFFFF", bg: "#10B981" }, // Green
  { text: "You are cooked 😭", color: "#FFFFFF", bg: "#F59E0B" }, // Orange
  { text: "Love is near 🔥", color: "#FFFFFF", bg: "#EC4899" }, // Pink
  { text: "Focus entirely on yourself 🧘", color: "#FFFFFF", bg: "#3B82F6" }, // Blue
  { text: "Ask them out! 🚀", color: "#FFFFFF", bg: "#8B5CF6" }, // Purple
];

const DestinyWheel = () => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [cooldown, setCooldown] = useState(0);

  const handleSpin = () => {
    if (spinning || cooldown > 0) return;

    setSpinning(true);
    setResult(null);

    // Random rotation between 5 to 10 full spins + random segment
    const randomSpin = 1800 + Math.random() * 360; 
    const newRotation = rotation + randomSpin;
    
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      
      // Calculate result based on angle
      // Normalize angle to 0-360
      const normalizedAngle = newRotation % 360;
      // Each segment is 360 / 8 = 45 degrees
      // Pointer is at 90deg (top), so we need to offset
      const segmentIndex = Math.floor(((360 - normalizedAngle + 90) % 360) / 45);
      
      const outcome = OUTCOMES[segmentIndex % OUTCOMES.length];
      setResult(outcome);
      
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.7 },
        colors: [outcome.color]
      });

      // Start Cooldown (30 seconds)
      setCooldown(30);
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    }, 3000); // 3s spin duration
  };

  return (
    <GlassCard className="w-full max-w-sm mx-auto flex flex-col items-center border-purple-500/30">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white font-fredoka flex items-center justify-center gap-2">
          <Dices className="text-purple-400" />
          Destiny Wheel
        </h2>
        <p className="text-gray-400 text-sm mt-1">Spin to reveal your fate</p>
      </div>

      <div className="relative w-64 h-64 mb-8">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 text-white drop-shadow-lg">
          ▼
        </div>

        {/* Wheel */}
        <motion.div
           className="w-full h-full rounded-full border-4 border-white/10 relative overflow-hidden shadow-2xl shadow-purple-500/20"
           animate={{ rotate: rotation }}
           transition={{ duration: 3, ease: "circOut" }}
           style={{ background: "conic-gradient(#EC4899 0deg 45deg, #8B5CF6 45deg 90deg, #EF4444 90deg 135deg, #10B981 135deg 180deg, #F59E0B 180deg 225deg, #EC4899 225deg 270deg, #3B82F6 270deg 315deg, #8B5CF6 315deg 360deg)" }}
        >
           {/* Inner Circle for Aesthetics */}
           <div className="absolute inset-0 m-auto w-4 h-4 bg-white rounded-full z-10" />
        </motion.div>
      </div>

      <div className="h-20 flex items-center justify-center w-full mb-4 px-4">
        {result ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-slate-900/80 p-4 rounded-xl border border-white/10 backdrop-blur-sm"
          >
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Destiny Says</p>
            <p className="text-xl font-bold" style={{ color: result.bg, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                {result.text}
            </p>
          </motion.div>
        ) : (
           spinning && <p className="text-purple-400 animate-pulse font-medium">Reading the stars...</p>
        )}
      </div>

      <Button 
        onClick={handleSpin} 
        disabled={spinning || cooldown > 0} 
        className="w-full"
        variant="outline"
      >
        {cooldown > 0 ? `Wait ${cooldown}s` : spinning ? "Spinning..." : "Spin the Wheel"}
      </Button>
    </GlassCard>
  );
};

export default DestinyWheel;

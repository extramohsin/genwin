import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import Button from "../ui/Button";
import GlassCard from "../ui/GlassCard";
import confetti from "canvas-confetti";

// Max 8 segments for readability
const OUTCOMES = [
  { label: "TEXT THEM", text: "Text them tonight 🌙", color: "#FFFFFF", bg: "#EC4899" }, // Pink
  { label: "THEY LIKE U", text: "They are thinking about you 💭", color: "#FFFFFF", bg: "#8B5CF6" }, // Purple
  { label: "MOVE ON", text: "Stop dreaming bro 💀", color: "#FFFFFF", bg: "#EF4444" }, // Red
  { label: "CONFESSION", text: "They will confess soon 💌", color: "#FFFFFF", bg: "#10B981" }, // Green
  { label: "COOKED", text: "You are cooked 😭", color: "#FFFFFF", bg: "#F59E0B" }, // Orange
  { label: "RELAX", text: "Focus entirely on yourself 🧘", color: "#FFFFFF", bg: "#3B82F6" }, // Blue
  { label: "ASK OUT", text: "Ask them out! 🚀", color: "#FFFFFF", bg: "#6366F1" }, // Indigo
  { label: "SOULMATE", text: "Love is near 🔥", color: "#FFFFFF", bg: "#D946EF" }, // Fuchsia
];

const DestinyWheel = () => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const wheelRef = useRef(null);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSpin = () => {
    if (spinning || cooldown > 0) return;

    setSpinning(true);
    setResult(null);

    // Random spin: Minimum 5 full rotations (1800 deg) + random segment
    // Each segment is 360 / 8 = 45 degrees.
    // To land on a specific segment, we need to calculate the final angle.
    // But random is fine for this game.
    const randomExtra = Math.floor(Math.random() * 360);
    const newRotation = rotation + 1800 + randomExtra;
    
    setRotation(newRotation);
  };

  const onSpinComplete = () => {
    setSpinning(false);
    
    // Calculate result based on final rotation
    // The pointer is at the TOP (0 degrees visually, but let's say 270 in CSS terms often)
    // We need to normalize the rotation to 0-360
    const normalizedRotation = rotation % 360;
    
    // The wheel rotates CLOCKWISE. 
    // If pointer is at top, and wheel rotates X degrees, the segment at top is:
    // (360 - normalizedRotation) % 360.
    // Correcting for any offset if needed.
    // In our conical gradient, 0deg starts at top (12 o'clock) if we style it right.
    
    // Let's assume 0deg is top-center.
    // Segment 0 is 0-45deg (Right-Top). 
    // Wait, CSS conic-gradient starts at 12 o'clock usually or 3 o'clock depending on browser? 
    // Usually 12 o'clock is 0deg in Tailwind `conic-gradient` utilities? No, standard CSS is 12 o'clock.
    
    // Actually, visual alignment is key.
    // Angle at pointer = (360 - normalizedRotation) % 360.
    // Segment Index = floor(Angle / 45).
    
    const angleAtPointer = (360 - (normalizedRotation % 360)) % 360;
    const segmentIndex = Math.floor(angleAtPointer / 45);
    const safeIndex = segmentIndex % OUTCOMES.length;

    const outcome = OUTCOMES[safeIndex];
    setResult(outcome);

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: [outcome.bg]
    });

    setCooldown(10); // 10s cooldown
  };

  return (
    <GlassCard className="w-full flex flex-col items-center border-purple-500/30 overflow-hidden relative">
        {/* Header */}
        <div className="text-center mb-6 z-10 relative">
            <h2 className="text-xl font-bold text-white font-fredoka flex items-center justify-center gap-2">
            <Sparkles className="text-purple-400" size={18} />
            Destiny Wheel
            </h2>
            <p className="text-gray-400 text-xs mt-1">Spin to reveal your fate</p>
        </div>

        {/* Wheel Container */}
        <div className="relative w-64 h-64 mb-8">
            {/* Pointer (Triangle at Top) */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 
                border-l-[10px] border-l-transparent
                border-r-[10px] border-r-transparent
                border-t-[14px] border-t-white
                drop-shadow-lg" 
            />

            {/* The Wheel */}
            <motion.div
                ref={wheelRef}
                className="w-full h-full rounded-full border-4 border-white/10 relative shadow-[0_0_30px_rgba(139,92,246,0.3)] overflow-hidden"
                animate={{ rotate: rotation }}
                transition={{ duration: 4, ease: [0.15, 0, 0.2, 1] }} // Bezier for realistic spin
                onAnimationComplete={onSpinComplete}
                style={{
                    background: `conic-gradient(
                        ${OUTCOMES.map((o, i) => `${o.bg} ${i * 45}deg ${(i + 1) * 45}deg`).join(', ')}
                    )`
                }}
            >
                {/* Text Labels on Segments */}
                {OUTCOMES.map((outcome, i) => (
                    <div
                        key={i}
                        className="absolute w-full h-full top-0 left-0 flex justify-center pt-4"
                        style={{
                            transform: `rotate(${i * 45 + 22.5}deg)`, // Center text in segment
                        }}
                    >
                        <span className="text-white font-bold text-[10px] uppercase tracking-wider drop-shadow-md select-none"
                              style={{ transform: "translateY(10px)" }}>
                            {outcome.label}
                        </span>
                    </div>
                ))}

                {/* Center Hub */}
                <div className="absolute inset-0 m-auto w-12 h-12 bg-white rounded-full z-10 shadow-lg flex items-center justify-center border-4 border-purple-100">
                    <span className="text-purple-600 font-bold text-xs">SPIN</span>
                </div>
            </motion.div>
        </div>

        {/* Result Area */}
        <div className="h-16 w-full flex items-center justify-center px-4 mb-2 z-10 relative">
            <AnimatePresence mode="wait">
                {result ? (
                <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center bg-black/40 backdrop-blur-md p-3 px-6 rounded-xl border border-white/10"
                >
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Destiny Says</p>
                    <p className="text-sm font-bold text-white">
                        {result.text}
                    </p>
                </motion.div>
                ) : spinning ? (
                    <motion.p 
                        key="spinning"
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-purple-300 text-sm font-medium animate-pulse"
                    >
                        Reading the stars...
                    </motion.p>
                ) : (
                    <p className="text-gray-500 text-xs">Ready to spin?</p>
                )}
            </AnimatePresence>
        </div>

        {/* Spin Button */}
        <Button 
            onClick={handleSpin} 
            disabled={spinning || cooldown > 0} 
            className="w-full relative z-10"
            variant={cooldown > 0 ? "outline" : "primary"}
        >
            {cooldown > 0 ? `Wait ${cooldown}s` : spinning ? "Spinning..." : "Spin the Wheel"}
        </Button>

    </GlassCard>
  );
};

export default DestinyWheel;

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { X, Check, Flag } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import Button from "../ui/Button";

const RED_FLAGS = [
    { text: "Claps when the plane lands 👏", severity: 3 },
    { text: "Referring to themselves as an 'Alpha' 🐺", severity: 10 },
    { text: "Texting back 'k' after you poured your heart out 🥶", severity: 8 },
    { text: "Still friends with all 5 exes 🚩", severity: 7 },
    { text: "Doesn't like music (like, at all) 🎵", severity: 9 },
    { text: "Rude to waiters 🍽️", severity: 10 },
    { text: "Wears socks with sandals 🧦", severity: 2 },
    { text: "Thinks the earth is flat 🌍", severity: 10 },
    { text: "Pineapple on pizza hater 🍕", severity: 1 },
    { text: "Uses 😂 unironically in 2026", severity: 4 },
];

const Card = ({ flag, onSwipe }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-150, 150], [-10, 10]);
    const bg = useTransform(x, [-150, 0, 150], ["rgba(239, 68, 68, 0.2)", "rgba(255,255,255,0.05)", "rgba(16, 185, 129, 0.2)"]);
    const borderColor = useTransform(x, [-150, 0, 150], ["rgba(239, 68, 68, 0.5)", "rgba(255,255,255,0.1)", "rgba(16, 185, 129, 0.5)"]);

    const handleDragEnd = (_, info) => {
        if (info.offset.x > 100) {
            onSwipe("accept"); // Green flag (Acceptable)
        } else if (info.offset.x < -100) {
            onSwipe("reject"); // Red flag (Dealbreaker)
        }
    };

    return (
        <motion.div
            style={{ x, rotate, backgroundColor: bg, borderColor: borderColor }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="absolute inset-0 w-full h-full rounded-2xl border flex flex-col items-center justify-center p-6 text-center shadow-xl backdrop-blur-md cursor-grab active:cursor-grabbing"
        >
            <Flag size={40} className="text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-white leading-snug">{flag.text}</h3>
            <p className="text-xs text-gray-500 mt-4 uppercase tracking-widest">Swipe Left (Red) / Right (Green)</p>
        </motion.div>
    );
};

const RedFlagSwiper = () => {
    const [index, setIndex] = useState(0);
    const [standards, setStandards] = useState(0); // Score tracking
    const [gameOver, setGameOver] = useState(false);

    const handleSwipe = (direction) => {
        // Logic: if you Accept a high severity flag, you have "Low Standards".
        // If you Reject everything, you have "High Standards".
        
        const currentFlag = RED_FLAGS[index];
        if (direction === "accept") {
            setStandards(prev => prev - currentFlag.severity);
        } else {
            setStandards(prev => prev + 2); // Bonus for having standards
        }

        if (index >= RED_FLAGS.length - 1) {
            setGameOver(true);
        } else {
            setIndex(prev => prev + 1);
        }
    };

    const reset = () => {
        setIndex(0);
        setStandards(0);
        setGameOver(false);
    };

    const getVerdict = () => {
        if (standards < -10) return { title: "DOWN BAD 📉", desc: "You accept anything. Have some self-respect bestie." };
        if (standards < 10) return { title: "CHILL VIBES 🤙", desc: "You are balanced. Not too picky, not too desperate." };
        return { title: "HIGH STANDARDS 👑", desc: "You know your worth. Maybe a bit too picky?" };
    };

    return (
        <GlassCard className="p-0 border-white/10 h-[400px] flex flex-col relative overflow-hidden bg-slate-900/50">
           
            <div className="p-4 border-b border-white/5 flex justify-between items-center z-10 bg-inherit">
                <h3 className="text-white font-bold flex items-center gap-2">
                    <Flag className="text-red-500" size={18} /> Red Flag Check
                </h3>
                <span className="text-xs text-gray-400">{index + 1}/{RED_FLAGS.length}</span>
            </div>

            <div className="flex-1 relative w-full max-w-[300px] mx-auto my-6">
                <AnimatePresence>
                    {!gameOver && (
                        <Card key={index} flag={RED_FLAGS[index]} onSwipe={handleSwipe} />
                    )}
                </AnimatePresence>

                {gameOver && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
                    >
                        <p className="text-gray-400 text-xs uppercase mb-2">Your Standards Rating</p>
                        <h2 className="text-3xl font-black text-white mb-2">{getVerdict().title}</h2>
                        <p className="text-gray-300 text-sm mb-6">{getVerdict().desc}</p>
                        <Button onClick={reset} size="sm">Play Again</Button>
                    </motion.div>
                )}
            </div>

            {/* Controls */}
            {!gameOver && (
                <div className="p-4 flex justify-center gap-4 z-10">
                    <button onClick={() => handleSwipe("reject")} className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 border border-red-500/50 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                        <X />
                    </button>
                    <button onClick={() => handleSwipe("accept")} className="w-12 h-12 rounded-full bg-green-500/20 text-green-500 border border-green-500/50 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all">
                        <Check />
                    </button>
                </div>
            )}
        </GlassCard>
    );
};

export default RedFlagSwiper;

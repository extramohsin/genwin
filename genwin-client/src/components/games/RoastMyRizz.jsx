import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Zap } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import Button from "../ui/Button";

const ROASTS = [
    "You have the romantic aura of a wet slice of bread. 🍞",
    "Your love life is like a 404 error: Not found. 🔍",
    "If 'left on read' was a person, it would be you. 📱",
    "You’re the reason they invented the 'block' button. 🚫",
    "You attract red flags like a bull in a matador convention. 🚩",
    "Your rizz is in debt. You owe the universe charm. 📉",
    "Even your imaginary situationships are breaking up with you. 💔",
    "You fumble more bags than a nervous cashier. 💼",
    "Bro, your DMs are drier than the Sahara. 🏜️",
    "You’re playing hard to get, but nobody’s trying to get you. 😐",
    "Your dating history is just a series of unfortunate events. 📚",
    "You have 'best friend' energy written all over your forehead. 🫂"
];

const RoastMyRizz = () => {
    const [roast, setRoast] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRoast = () => {
        setLoading(true);
        setRoast(null);
        
        // Fake "AI scanning" delay
        setTimeout(() => {
            const randomRoast = ROASTS[Math.floor(Math.random() * ROASTS.length)];
            setRoast(randomRoast);
            setLoading(false);
        }, 1500);
    };

    return (
        <GlassCard className="p-6 border-red-500/30 bg-gradient-to-br from-red-900/10 to-transparent">
            <div className="flex items-center gap-2 mb-4">
                <Flame className="text-red-500" />
                <h3 className="text-lg font-bold text-white font-fredoka">Roast My Rizz</h3>
            </div>
            
            <div className="min-h-[100px] flex items-center justify-center mb-4">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <span className="text-red-400 font-mono text-sm animate-pulse">
                                [SCANNING AURA...]
                            </span>
                        </motion.div>
                    ) : roast ? (
                        <motion.p
                            key="roast"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center text-white font-medium text-lg leading-relaxed relative"
                        >
                            <span className="text-3xl absolute -top-4 -left-2 opacity-20">❝</span>
                            {roast}
                            <span className="text-3xl absolute -bottom-4 -right-2 opacity-20">❞</span>
                        </motion.p>
                    ) : (
                        <p className="text-gray-400 text-sm text-center italic">
                            Dare to check your dating level?
                        </p>
                    )}
                </AnimatePresence>
            </div>

            <Button 
                onClick={handleRoast} 
                disabled={loading} 
                className="w-full bg-red-500 hover:bg-red-600 text-white border-none"
                icon={Zap}
            >
                {loading ? "Calculating..." : "Destroy Me 💀"}
            </Button>
        </GlassCard>
    );
};

export default RoastMyRizz;

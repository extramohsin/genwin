import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Calculator } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import Button from "../ui/Button";
import Input from "../ui/Input";

const NeonLoveTester = () => {
    const [name1, setName1] = useState("");
    const [name2, setName2] = useState("");
    const [score, setScore] = useState(null);
    const [isEasterEgg, setIsEasterEgg] = useState(false);
    const [isLoveEgg, setIsLoveEgg] = useState(false);
    const [scanning, setScanning] = useState(false);

    const calculateLove = () => {
        if (!name1 || !name2) return;
        setScanning(true);
        setScore(null);
        setIsEasterEgg(false);
        setIsLoveEgg(false);

        // 🥚 Easter egg: mohsin + tamanna (any order) = always 0%
        const n1 = name1.trim().toLowerCase();
        const n2 = name2.trim().toLowerCase();
        const easterEggPair =
            (n1 === "mohsin" && n2 === "tamanna") ||
            (n1 === "tamanna" && n2 === "mohsin");

        // 💛 Easter egg: furqan + sana (any order) = always 100%
        const loveEggPair =
            (n1 === "furqan" && n2 === "sana") ||
            (n1 === "sana" && n2 === "furqan");

        if (easterEggPair) {
            setTimeout(() => {
                setScanning(false);
                setScore(0);
                setIsEasterEgg(true);
            }, 2000);
            return;
        }

        if (loveEggPair) {
            setTimeout(() => {
                setScanning(false);
                setScore(100);
                setIsLoveEgg(true);
            }, 2000);
            return;
        }

        // Deterministic but random-feeling score based on string codes
        const combined = n1 + n2;
        let hash = 0;
        for (let i = 0; i < combined.length; i++) {
            hash = combined.charCodeAt(i) + ((hash << 5) - hash);
        }
        const finalScore = Math.abs(hash % 101); // 0-100

        setTimeout(() => {
            setScanning(false);
            setScore(finalScore);
        }, 2000);
    };

    return (
        <GlassCard className="p-6 border-pink-500/30 relative overflow-hidden">
            {/* Retro Grid Background Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

            <div className="relative z-10 text-center">
                <div className="flex items-center justify-center gap-2 mb-6">
                    <Heart className="text-neon-pink animate-pulse" fill="currentColor" />
                    <h3 className="text-lg font-bold text-white font-press-start tracking-wider">LOVE TESTER 3000</h3>
                </div>

                <div className="space-y-4 mb-6">
                    <Input 
                        placeholder="Your Name" 
                        value={name1} 
                        onChange={(e) => setName1(e.target.value)} 
                        className="text-center font-bold tracking-widest text-pink-300"
                    />
                    <div className="text-white font-bold opacity-50">+</div>
                    <Input 
                        placeholder="Crush's Name" 
                        value={name2} 
                        onChange={(e) => setName2(e.target.value)} 
                        className="text-center font-bold tracking-widest text-purple-300"
                    />
                </div>

                <div className="h-24 flex items-center justify-center">
                    {scanning ? (
                        <div className="flex flex-col items-center gap-2">
                             <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden w-48">
                                <motion.div 
                                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 2 }}
                                />
                             </div>
                             <span className="text-xs text-pink-400 font-mono animate-pulse">ANALYZING PHEROMONES...</span>
                        </div>
                    ) : score !== null ? (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center"
                        >
                            <span className={`text-5xl font-black text-transparent bg-clip-text ${
                                isEasterEgg
                                    ? "bg-gradient-to-t from-red-600 to-orange-400 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]"
                                    : isLoveEgg
                                    ? "bg-gradient-to-t from-yellow-400 to-white drop-shadow-[0_0_15px_rgba(250,204,21,0.9)]"
                                    : "bg-gradient-to-t from-pink-500 to-white drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]"
                            }`}>
                                {score}%
                            </span>
                            <p className={`text-xs mt-2 font-mono uppercase ${
                                isEasterEgg ? "text-red-400 animate-pulse" : isLoveEgg ? "text-yellow-400 animate-pulse" : "text-gray-300"
                            }`}>
                                {isEasterEgg ? "🚫 EWW, GO AWAY GUYS" : isLoveEgg ? "💛 ABSOLUTELY MADE FOR EACH OTHER" : score > 80 ? "MATCH MADE IN HEAVEN" : score > 50 ? "FRIENDZONE RISK" : "RUN AWAY"}
                            </p>
                        </motion.div>
                    ) : (
                        <div className="text-gray-500 text-xs font-mono">
                            ENTER NAMES TO BEGIN
                        </div>
                    )}
                </div>

                <Button 
                    onClick={calculateLove} 
                    disabled={scanning || !name1 || !name2}
                    className="w-full mt-4 bg-pink-600 hover:bg-pink-700 border-none shadow-[0_0_15px_rgba(236,72,153,0.4)]"
                    icon={Calculator}
                >
                    CALCULATE LOVE
                </Button>
            </div>
        </GlassCard>
    );
};

export default NeonLoveTester;

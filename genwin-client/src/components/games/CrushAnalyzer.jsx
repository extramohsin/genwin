import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowRight, RefreshCw, Trophy, Sparkles } from "lucide-react";
import Button from "../ui/Button";
import GlassCard from "../ui/GlassCard";
import confetti from "canvas-confetti";

const QUESTIONS = [
  { q: "Who will fall in love first?", options: ["Me 🙋‍♂️", "Them 🙋‍♀️", "Both same time ⚡"] },
  { q: "Who sends the first morning text?", options: ["Me (Always) 📱", "Them (Rarely) 😴", "Whoever wakes up first 🌅"] },
  { q: "Who is more jealous?", options: ["Me 😠", "Them 😒", "We trust 100% 🛡️"] },
  { q: "Who is the better cook?", options: ["Me 🍳", "Them 🥗", "We order pizza 🍕"] },
  { q: "Who apologizes first after a fight?", options: ["Me (Simp?) 🥺", "Them (Ego?) 😤", "We laugh it off 😂"] },
  { q: "Who is more dramatic?", options: ["Me 🎭", "Them 🎬", "Oscar worthy duo 🏆"] },
  { q: "Who remembers anniversaries?", options: ["Me 📅", "Them 🎁", "Google Calendar 🤖"] },
  { q: "Who is more likely to ghost?", options: ["Me 👻", "Them 🌫️", "Never! ❌"] },
  { q: "Who spends more money?", options: ["Me 💸", "Them 🛍️", "We broke 📉"] },
  { q: "Who is the big spoon?", options: ["Me 🥄", "Them 🥄", "We cuddle puddle 🧸"] },
];

const RESULTS = [
  { min: 0, title: "Toxic Warning 💀", desc: "Run. Just run. This is a canon event waiting to happen.", color: "text-red-500" },
  { min: 30, title: "Friendzone Potential 🤡", desc: "It's giving 'bestie' vibes. Good luck out there.", color: "text-yellow-500" },
  { min: 50, title: "Situationship 😵‍💫", desc: "Confusing but exciting. Might end in marriage or therapy.", color: "text-orange-500" },
  { min: 70, title: "Spicy Chemistry 🌶️", desc: "Hot hot hot! Just don't burn the house down.", color: "text-pink-500" },
  { min: 90, title: "Soulmates 💍", desc: "Pack your bags, you're getting married. Invite me!", color: "text-purple-500" },
];

const CrushAnalyzer = ({ user, matches }) => {
  const [step, setStep] = useState("intro"); // intro, select, quiz, result
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);

  const handleStart = () => setStep("select");

  const handleSelectMatch = (matchName) => {
    setSelectedMatch(matchName);
    setStep("quiz");
    setScore(0);
    setCurrentQ(0);
  };

  const handleAnswer = (index) => {
    // Randomish score logic for fun
    const points = [10, 5, 8]; 
    setScore((prev) => prev + points[index]);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setStep("result");
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const getResult = () => {
    return RESULTS.slice().reverse().find(r => score >= r.min) || RESULTS[0];
  };

  const reset = () => {
    setStep("intro");
    setScore(0);
    setCurrentQ(0);
    setSelectedMatch(null);
  };

  return (
    <GlassCard className="w-full max-w-lg mx-auto min-h-[400px] flex flex-col justify-center border-pink-500/30">
      <AnimatePresence mode="wait">
        
        {/* INTRO SCREEN */}
        {step === "intro" && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center space-y-6"
          >
            <div className="mx-auto w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center text-pink-500">
              <Heart size={40} fill="currentColor" className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-fredoka">Crush Compatibility</h2>
              <p className="text-gray-400 mt-2">Are you destined to be together or doomed to fail? Let's find out!</p>
            </div>
            <Button onClick={handleStart} className="w-full" icon={ArrowRight}>
              Analyze Vibes
            </Button>
          </motion.div>
        )}

        {/* SELECT MATCH SCREEN */}
        {step === "select" && (
          <motion.div 
            key="select"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center space-y-6"
          >
             <h3 className="text-xl font-bold text-white">Who are we analyzing?</h3>
             <div className="space-y-3">
               {matches.map((name, i) => (
                 <button
                    key={i}
                    onClick={() => handleSelectMatch(name)}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-pink-500/20 hover:border-pink-500/50 transition-all flex items-center justify-between group"
                 >
                    <span className="text-white font-medium">{name}</span>
                    <ArrowRight className="text-gray-500 group-hover:text-pink-400" size={18} />
                 </button>
               ))}
             </div>
          </motion.div>
        )}

        {/* QUIZ SCREEN */}
        {step === "quiz" && (
          <motion.div 
            key="quiz"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
             <div className="flex justify-between items-center text-xs text-gray-400 uppercase tracking-widest">
                <span>Question {currentQ + 1}/{QUESTIONS.length}</span>
                <span>{user?.fullName} + {selectedMatch}</span>
             </div>
             
             {/* Progress Bar */}
             <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
                />
             </div>

             <h3 className="text-xl font-bold text-white min-h-[60px]">{QUESTIONS[currentQ].q}</h3>

             <div className="space-y-3">
               {QUESTIONS[currentQ].options.map((opt, i) => (
                 <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-purple-500/20 hover:border-purple-500/50 text-left text-gray-200 hover:text-white transition-all transform hover:scale-[1.02]"
                 >
                    {opt}
                 </button>
               ))}
             </div>
          </motion.div>
        )}

        {/* RESULTS SCREEN */}
        {step === "result" && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
             <div className="mx-auto w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-pink-500/50">
               <Trophy size={48} />
             </div>
             
             <div>
                <p className="text-gray-400 uppercase tracking-widest text-xs mb-2">Compatibility Score</p>
                <div className="text-6xl font-bold text-white mb-4 counter-reset">
                   {Math.min(score, 100)}%
                </div>
                <h3 className={`text-2xl font-bold ${getResult().color} font-fredoka`}>
                   {getResult().title}
                </h3>
                <p className="text-gray-300 mt-2 max-w-xs mx-auto">
                   {getResult().desc}
                </p>
             </div>

             <Button onClick={reset} variant="outline" icon={RefreshCw} className="w-full">
               Analyze Another Crush
             </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
};

export default CrushAnalyzer;

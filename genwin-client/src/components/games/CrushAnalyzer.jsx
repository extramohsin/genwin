import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowRight, RefreshCw, Trophy, User, Sparkles } from "lucide-react";
import Button from "../ui/Button";
import GlassCard from "../ui/GlassCard";
import confetti from "canvas-confetti";

const QUESTIONS = [
  { q: "Who will fall in love first?", options: ["Me 🙋‍♂️", "Them 🙋‍♀️", "Instant Click ⚡"] },
  { q: "Who sends the first morning text?", options: ["Me (Always) 📱", "Them (Rarely) 😴", "Simultaneous 🌅"] },
  { q: "Who is more jealous?", options: ["Me 😠", "Them 😒", "We trust 100% 🛡️"] },
  { q: "Who stalks more?", options: ["Me (FBI level) 🕵️", "Them (Secretly) 🌚", "Mutual Stalking 🔭"] },
  { q: "Who will confess first?", options: ["Me (Can't wait) 🗣️", "Them (Shy) 🤐", "Drunken Confession 🍻"] },
  { q: "Who is more likely to ghost?", options: ["Me 👻", "Them 🌫️", "Till Death do us part 💀"] },
  { q: "Who gets possessive?", options: ["Me 🔒", "Them 🔐", "We share everything 🤝"] },
  { q: "Who pays on the first date?", options: ["Me 💳", "Them 💵", "Dutch (50/50) ⚖️"] },
  { q: "Who remembers anniversaries?", options: ["Me 📅", "Them 🎁", "Google Calendar 🤖"] },
  { q: "Who is the drama queen/king?", options: ["Me 🎭", "Them 🎬", "We are a Sitcom 📺"] },
];

const RESULTS = [
  { min: 0, title: "Toxic Warning 💀", desc: "Run. Just run. This is a canon event waiting to happen.", color: "text-red-500" },
  { min: 30, title: "One-Sided Hope 🤡", desc: "It's giving 'bestie' vibes. Good luck out there.", color: "text-yellow-500" },
  { min: 50, title: "Dangerous Chemistry 😈", desc: "Spicy but risky. Might end in marriage or therapy.", color: "text-orange-500" },
  { min: 70, title: "Destiny Couple 🔥", desc: "Hot hot hot! Just don't burn the house down.", color: "text-pink-500" },
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
    const points = [5, 10, 15]; 
    setScore((prev) => prev + points[index % 3]);

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
    // Normalize score to 0-100 roughly
    const maxScore = QUESTIONS.length * 15;
    const distinctScore = Math.floor((score / maxScore) * 100);
    return RESULTS.slice().reverse().find(r => distinctScore >= r.min) || RESULTS[0];
  };

  const reset = () => {
    setStep("intro");
    setScore(0);
    setCurrentQ(0);
    setSelectedMatch(null);
  };

  return (
    <GlassCard className="w-full max-w-lg mx-auto min-h-[500px] flex flex-col justify-center border-pink-500/30 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -z-10" />

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
            <div className="mx-auto w-24 h-24 bg-pink-500/20 rounded-full flex items-center justify-center text-pink-500 shadow-lg shadow-pink-500/20">
              <Sparkles size={48} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white font-fredoka">Crush Compatibility</h2>
              <p className="text-gray-400 mt-2 text-lg">Analyze your vibes. Are you soulmates or just delusional? 🧐</p>
            </div>
            <Button onClick={handleStart} className="w-full text-lg py-4" icon={ArrowRight}>
              Start Analysis
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
             <div className="flex items-center justify-center gap-3 text-pink-400 mb-2">
                <User /> <span className="text-gray-500">+</span> <Heart fill="currentColor" />
             </div>
             <h3 className="text-2xl font-bold text-white">Who are we analyzing?</h3>
             <p className="text-gray-400 text-sm">Select one of your submitted crushes/likes</p>
             
             <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
               {matches.map((name, i) => (
                 <button
                    key={i}
                    onClick={() => handleSelectMatch(name)}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-pink-500/20 hover:border-pink-500/50 transition-all flex items-center justify-between group"
                 >
                    <span className="text-white font-medium text-lg">{name}</span>
                    <ArrowRight className="text-gray-500 group-hover:text-pink-400" size={20} />
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
                <span>Question {currentQ + 1} / {QUESTIONS.length}</span>
                <span className="text-pink-400 font-bold">{user?.fullName?.split(" ")[0]} + {selectedMatch?.split(" ")[0]}</span>
             </div>
             
             {/* Progress Bar */}
             <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
                />
             </div>

             <h3 className="text-2xl font-bold text-white min-h-[80px] flex items-center">{QUESTIONS[currentQ].q}</h3>

             <div className="space-y-3">
               {QUESTIONS[currentQ].options.map((opt, i) => (
                 <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-purple-500/20 hover:border-purple-500/50 text-left text-gray-200 hover:text-white transition-all transform hover:scale-[1.02] flex items-center gap-3"
                 >
                    <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-xs group-hover:bg-purple-500 group-hover:border-purple-500">
                      {["A", "B", "C"][i]}
                    </div>
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
             <div className="mx-auto w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-pink-500/50 animate-bounce-slow">
               <Trophy size={48} />
             </div>
             
             <div>
                <p className="text-gray-400 uppercase tracking-widest text-xs mb-2">Compatibility Score</p>
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-4">
                   {Math.min(Math.floor((score / (QUESTIONS.length * 15)) * 100), 100)}%
                </div>
                <div className={`text-2xl font-bold ${getResult().color} font-fredoka border-2 border-white/10 rounded-xl py-2 px-4 inline-block bg-white/5`}>
                   {getResult().title}
                </div>
                <p className="text-gray-300 mt-4 max-w-xs mx-auto text-lg leading-relaxed">
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

import { useState, useEffect } from "react";
import { Quote } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const QUOTES = [
    "Love is like the wind, you can't see it but you can feel it.",
    "Do they like you back? The universe says YES.",
    "If it's meant to be, it will be.",
    "Manifesting your match... Please wait...",
    "Only true legends get 3/3 matches.",
    "Patience is bitter, but its fruit is sweet.",
    "Your soulmate is probably eating pizza right now."
];

const DailyQuote = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setIndex(prev => (prev + 1) % QUOTES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 p-6 rounded-2xl border border-white/10 text-center relative overflow-hidden min-h-[80px] flex items-center justify-center">
        <Quote className="absolute top-2 left-2 text-white/5" size={40} />
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="text-gray-300 italic font-medium relative z-10"
          >
            &ldquo;{QUOTES[index]}&rdquo;
          </motion.p>
        </AnimatePresence>
    </div>
  );
};

export default DailyQuote;

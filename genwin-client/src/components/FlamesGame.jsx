import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";
import Button from "./ui/Button";
import Input from "./ui/Input";

const FlamesGame = () => {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateFlames = () => {
    if (!name1 || !name2) return;
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const flames = ["Friend", "Love", "Affection", "Marriage", "Enemy", "Sister"];
      const n1 = name1.toLowerCase().replace(/\s/g, "").split("");
      const n2 = name2.toLowerCase().replace(/\s/g, "").split("");

      n1.forEach((char) => {
        const index = n2.indexOf(char);
        if (index !== -1) {
          n2.splice(index, 1);
          n1.splice(n1.indexOf(char), 1);
        }
      });

      const count = n1.length + n2.length;
      let resultIndex = 0;
      // Simple FLAMES logic (can be made more accurate to standard game)
       if (count > 0) {
         resultIndex = (count % 6) - 1;
         if (resultIndex === -1) resultIndex = 5;
       }

      setResult(flames[resultIndex]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
      <div className="flex items-center justify-center gap-2 mb-6 text-orange-400">
        <Flame size={24} fill="currentColor" />
        <h3 className="text-xl font-bold">FLAMES Calculator</h3>
      </div>

      <div className="space-y-4 mb-6">
        <Input 
          placeholder="Your Name" 
          value={name1} 
          onChange={(e) => setName1(e.target.value)} 
          className="text-center"
        />
        <div className="text-2xl font-bold text-pink-500">+</div>
        <Input 
          placeholder="Crush's Name" 
          value={name2} 
          onChange={(e) => setName2(e.target.value)} 
          className="text-center"
        />
      </div>

      <Button 
        onClick={calculateFlames} 
        disabled={loading || !name1 || !name2}
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
      >
        {loading ? "Calculating..." : "Calculate 🔥"}
      </Button>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="mt-6 p-4 bg-white/10 rounded-xl"
          >
            <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">Result</div>
            <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              {result}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlamesGame;

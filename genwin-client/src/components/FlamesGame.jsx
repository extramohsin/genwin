import React, { useState } from "react";

const FlamesGame = () => {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [result, setResult] = useState(null);

  const calculateFLAMES = () => {
    if (!name1 || !name2) return;

    const n1 = name1.toLowerCase().replace(/\s/g, "").split("");
    const n2 = name2.toLowerCase().replace(/\s/g, "").split("");

    n1.forEach((char) => {
      const index = n2.indexOf(char);
      if (index !== -1) {
        n2.splice(index, 1);
        n1[n1.indexOf(char)] = ""; // Mark as removed
      }
    });

    const count = n1.filter((c) => c !== "").length + n2.length;
    const flames = ["Friends", "Lovers", "Affection", "Marriage", "Enemy", "Siblings"];
    
    let index = 0;
    while (flames.length > 1) {
      index = (index + count - 1) % flames.length;
      flames.splice(index, 1);
    }

    setResult(flames[0]);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl max-w-md w-full mx-auto mt-8">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">🔥 FLAMES Generator</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={name1}
          onChange={(e) => setName1(e.target.value)}
          className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
        />
        <input
          type="text"
          placeholder="Crush's Name"
          value={name2}
          onChange={(e) => setName2(e.target.value)}
          className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
        />
        <button
          onClick={calculateFLAMES}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-white font-bold hover:opacity-90 transition-opacity"
        >
          Calculate
        </button>
      </div>

      {result && (
        <div className="mt-6 text-center animate-bounce">
          <p className="text-gray-300 text-sm uppercase tracking-wider">Relationship Status</p>
          <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
            {result}
          </h3>
        </div>
      )}
    </div>
  );
};

export default FlamesGame;

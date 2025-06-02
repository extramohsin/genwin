import { useState, useEffect, useCallback, useMemo } from "react";

const LoveLab = () => {
  const [step, setStep] = useState(1);
  const [partner1, setPartner1] = useState({
    name: "",
    traits: {
      adventurous: 0,
      communication: 0,
      empathy: 0,
      humor: 0,
      ambition: 0,
    },
    loveLanguage: "",
  });

  const [partner2, setPartner2] = useState({
    name: "",
    traits: {
      adventurous: 0,
      communication: 0,
      empathy: 0,
      humor: 0,
      ambition: 0,
    },
    loveLanguage: "",
  });

  const [compatibility, setCompatibility] = useState({
    score: 0,
    strengths: [],
    challenges: [],
    futureProjection: "",
  });

  const loveLanguages = useMemo(
    () => [
      "Words of Affirmation",
      "Quality Time",
      "Receiving Gifts",
      "Acts of Service",
      "Physical Touch",
    ],
    []
  );

  const traitDescriptions = useMemo(
    () => ({
      adventurous: "Openness to new experiences",
      communication: "Conflict resolution skills",
      empathy: "Emotional understanding",
      humor: "Shared laughter frequency",
      ambition: "Life goal alignment",
    }),
    []
  );

  const calculateCompatibility = useCallback(() => {
    let totalScore = 0;
    let strengthList = [];
    let challengeList = [];

    // Calculate trait compatibility
    Object.keys(partner1.traits).forEach((trait) => {
      const diff = Math.abs(partner1.traits[trait] - partner2.traits[trait]);
      const matchScore = 100 - diff * 20;
      totalScore += matchScore;

      if (diff <= 1) {
        strengthList.push(traitDescriptions[trait]);
      } else {
        challengeList.push(traitDescriptions[trait]);
      }
    });

    // Love language bonus
    const loveLangBonus =
      partner1.loveLanguage === partner2.loveLanguage ? 15 : -10;
    totalScore = totalScore / 5 + loveLangBonus;

    // Future projection
    const projections = [
      "Coffee date buddies ☕",
      "Summer fling 🌴",
      "Power couple in training 💼",
      "Long-term potential 💍",
      "Cosmic soulmates 🌌",
    ];

    setCompatibility({
      score: Math.min(Math.max(totalScore, 0), 100),
      strengths: strengthList,
      challenges: challengeList,
      futureProjection: projections[Math.floor(totalScore / 20)],
    });
  }, [partner1, partner2, traitDescriptions]);

  useEffect(() => {
    if (step === 3) {
      calculateCompatibility();
    }
  }, [step, calculateCompatibility]);

  const TraitSlider = ({ trait, value, onChange }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{traitDescriptions[trait]}</span>
        <span>{value}/5</span>
      </div>
      <input
        type="range"
        min="0"
        max="5"
        value={value}
        onChange={onChange}
        className="w-full accent-pink-500"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full transform transition-all hover:scale-[1.005]">
        {/* Progress Header */}
        <div className="flex items-center mb-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex-1">
              <div
                className={`h-2 ${num <= step ? "bg-pink-500" : "bg-gray-200"} 
                ${num === 1 ? "rounded-l" : ""} 
                ${num === 3 ? "rounded-r" : ""}`}
              />
            </div>
          ))}
          <div className="absolute text-center w-full mt-8 font-bold text-pink-600">
            {["Profile Setup", "Deep Analysis", "Results"][step - 1]}
          </div>
        </div>

        {step === 1 && (
          <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-pink-600">Your Profile</h2>
              <input
                type="text"
                placeholder="Your name"
                value={partner1.name}
                onChange={(e) =>
                  setPartner1({ ...partner1, name: e.target.value })
                }
                className="w-full p-3 rounded-lg border-2 border-pink-200 focus:border-pink-500 outline-none"
              />
              <div className="space-y-4">
                {Object.keys(partner1.traits).map((trait) => (
                  <TraitSlider
                    key={trait}
                    trait={trait}
                    value={partner1.traits[trait]}
                    onChange={(e) =>
                      setPartner1({
                        ...partner1,
                        traits: {
                          ...partner1.traits,
                          [trait]: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-red-600">Their Profile</h2>
              <input
                type="text"
                placeholder="Crush's name"
                value={partner2.name}
                onChange={(e) =>
                  setPartner2({ ...partner2, name: e.target.value })
                }
                className="w-full p-3 rounded-lg border-2 border-red-200 focus:border-red-500 outline-none"
              />
              <div className="space-y-4">
                {Object.keys(partner2.traits).map((trait) => (
                  <TraitSlider
                    key={trait}
                    trait={trait}
                    value={partner2.traits[trait]}
                    onChange={(e) =>
                      setPartner2({
                        ...partner2,
                        traits: {
                          ...partner2.traits,
                          [trait]: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-pink-600">
                Your Love Language
              </h3>
              <div className="grid gap-3">
                {loveLanguages.map((lang) => (
                  <label
                    key={lang}
                    className="flex items-center p-3 rounded-lg border-2 border-pink-100 hover:border-pink-300 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="loveLang1"
                      checked={partner1.loveLanguage === lang}
                      onChange={() =>
                        setPartner1({ ...partner1, loveLanguage: lang })
                      }
                      className="accent-pink-500 mr-3"
                    />
                    {lang}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-red-600">
                Their Love Language
              </h3>
              <div className="grid gap-3">
                {loveLanguages.map((lang) => (
                  <label
                    key={lang}
                    className="flex items-center p-3 rounded-lg border-2 border-red-100 hover:border-red-300 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="loveLang2"
                      checked={partner2.loveLanguage === lang}
                      onChange={() =>
                        setPartner2({ ...partner2, loveLanguage: lang })
                      }
                      className="accent-red-500 mr-3"
                    />
                    {lang}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="text-4xl font-bold text-pink-600 mb-2">
                {compatibility.score}% Match
              </div>
              <div className="text-xl text-red-500 font-semibold">
                {compatibility.futureProjection}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-green-600 mb-3">
                  ✨ Strengths
                </h3>
                <ul className="space-y-2">
                  {compatibility.strengths.map((str, i) => (
                    <li key={i} className="flex items-center">
                      <span className="mr-2">✅</span>
                      {str}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-yellow-600 mb-3">
                  ⚠️ Challenges
                </h3>
                <ul className="space-y-2">
                  {compatibility.challenges.map((ch, i) => (
                    <li key={i} className="flex items-center">
                      <span className="mr-2">⛔</span>
                      {ch}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-600 mb-3">
                💡 Expert Advice
              </h3>
              <p className="text-gray-700">
                {compatibility.score >= 80
                  ? "Nurture your strong foundation with regular check-ins and shared adventures!"
                  : compatibility.score >= 60
                  ? "Focus on open communication and finding common interests to deepen your connection!"
                  : "Work on building trust through small, consistent acts of care and understanding."}
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
            >
              ← Back
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!partner1.name || !partner2.name}
              className="ml-auto px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={() => {
                setStep(1);
                setPartner1({
                  ...partner1,
                  traits: {
                    adventurous: 0,
                    communication: 0,
                    empathy: 0,
                    humor: 0,
                    ambition: 0,
                  },
                  loveLanguage: "",
                });
                setPartner2({
                  ...partner2,
                  traits: {
                    adventurous: 0,
                    communication: 0,
                    empathy: 0,
                    humor: 0,
                    ambition: 0,
                  },
                  loveLanguage: "",
                });
              }}
              className="ml-auto px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
              Start Over 🔄
            </button>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          🧪 Based on Gottman Institute research and Five Love Languages theory
        </div>
      </div>
    </div>
  );
};

export default LoveLab;

import { useState, useEffect } from "react";
import { Clock, Lock, Sparkles, MessageSquare } from "lucide-react";
import PageWrapper from "../components/ui/PageWrapper";
import GlassCard from "../components/ui/GlassCard";
import CrushAnalyzer from "../components/games/CrushAnalyzer";
import DestinyWheel from "../components/games/DestinyWheel";
import FeedbackForm from "../components/FeedbackForm";
import API_URL from "../config";

const WaitingRoom = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [user, setUser] = useState(null);
  const [submittedMatches, setSubmittedMatches] = useState([]);
  const [nextReveal, setNextReveal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);

    const fetchStatus = async () => {
      try {
        if (!storedUser?.userId) return;
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/match/status/${storedUser.userId}`, {
           headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            setSubmittedMatches(data.choices);
        }
        if (data.nextRevealAt) {
            setNextReveal(new Date(data.nextRevealAt));
        }
      } catch (error) {
        console.error("Error fetching status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  useEffect(() => {
    if (!nextReveal) return;

    const timer = setInterval(() => {
      const now = new Date();
      const difference = nextReveal - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextReveal]);

  const TimerBox = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-800 rounded-xl flex items-center justify-center border border-white/10 shadow-lg mb-2">
        <span className="text-2xl sm:text-3xl font-bold font-fredoka text-white">{String(value).padStart(2, '0')}</span>
      </div>
      <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <PageWrapper className="flex flex-col items-center">
      <div className="text-center mb-10 max-w-2xl">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-4 border border-purple-500/20">
          <Sparkles size={14} /> Destiny is Loading...
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-fredoka">
          Waiting Room
        </h1>
        <p className="text-gray-400 text-lg">
          Your choices are locked in. Now play some games while you wait! 🎮
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-6xl mb-12">
        {/* Left Column: Timer & Quotes */}
        <div className="space-y-8 h-full">
            <GlassCard className="flex flex-col items-center justify-center text-center !py-10 h-full justify-between">
              <div>
                  <div className="mb-6 p-4 rounded-full bg-slate-900/50 border border-white/5 inline-block">
                    <Lock size={32} className="text-gray-500" />
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-8">Reveal Countdown</h2>
                  
                  <div className="flex gap-4 sm:gap-6 justify-center">
                    <TimerBox value={timeLeft.days} label="Days" />
                    <TimerBox value={timeLeft.hours} label="Hours" />
                    <TimerBox value={timeLeft.minutes} label="Mins" />
                    <TimerBox value={timeLeft.seconds} label="Secs" />
                  </div>

                  <div className="mt-8 text-sm text-gray-500">
                    Results will separate mutual matches from one-sided crushes.
                  </div>
              </div>

               <div className="mt-8 pt-8 border-t border-white/5 w-full">
                   <h3 className="font-bold text-lg mb-2 text-white">Daily Wisdom</h3>
                   <p className="text-gray-400 italic text-sm">
                     "Love is composed of a single soul inhabiting two bodies." – Aristotle
                   </p>
               </div>
            </GlassCard>
        </div>

        {/* Right Column: Games */}
        <div className="space-y-8 flex flex-col">
           {/* GAME 1: Crush Analyzer */}
           {loading ? (
               <GlassCard className="text-center p-8 flex flex-col items-center justify-center min-h-[400px]">
                   <div className="animate-spin text-pink-500 mb-4">
                        <Sparkles size={32} />
                   </div>
                   <p className="text-gray-400">Loading your matches...</p>
               </GlassCard>
           ) : submittedMatches.length > 0 ? (
               <CrushAnalyzer user={user} matches={submittedMatches} />
           ) : (
               <GlassCard className="text-center p-8 flex flex-col items-center justify-center min-h-[400px]">
                   <p className="text-red-400 font-bold mb-2">No Matches Found</p>
                   <p className="text-gray-400 text-sm">Seems like we couldn't load your choices. Please try refreshing.</p>
               </GlassCard>
           )}

           {/* GAME 2: Destiny Wheel */}
           <DestinyWheel />
        </div>
      </div>

      {/* FOOTER: Feedback Form - Full Width at Bottom */}
      <div className="w-full max-w-3xl mt-12 mb-20">
          <FeedbackForm />
      </div>
    </PageWrapper>
  );
};

export default WaitingRoom;

import { useState, useEffect } from "react";
import { Clock, Lock, Sparkles, Unlock, Gamepad2, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";
import PageWrapper from "../components/ui/PageWrapper";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import FeedbackForm from "../components/FeedbackForm";
import ChatRoom from "../components/chat/ChatRoom";
import DestinyWheel from "../components/games/DestinyWheel";
import VibePoll from "../components/games/VibePoll";
import DailyQuote from "../components/games/DailyQuote";
import RoastMyRizz from "../components/games/RoastMyRizz";
import NeonLoveTester from "../components/games/NeonLoveTester";
import RedFlagSwiper from "../components/games/RedFlagSwiper";
import API_URL from "../config";

const WaitingRoom = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [status, setStatus] = useState({ isLocked: true, remainingTime: 0, nextRevealAt: null });
  const [activeTab, setActiveTab] = useState("games"); // games | polls

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${API_URL}/api/match/status`, {
           headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            setStatus(data);
        }
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    fetchStatus();
  }, []);

  useEffect(() => {
    if (!status.nextRevealAt) return;
    
    const targetDate = new Date(status.nextRevealAt);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setStatus(prev => ({ ...prev, isLocked: false }));
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [status.nextRevealAt]);

  const TimerBox = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 md:w-16 md:h-16 bg-dark-800 rounded-xl flex items-center justify-center border border-white/10 shadow-lg mb-1">
        <span className="text-xl md:text-2xl font-bold font-fredoka text-white">{String(value).padStart(2, '0')}</span>
      </div>
      <span className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <PageWrapper className="">
      <div className="max-w-7xl mx-auto px-4">
          
          {/* 1. Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
              <div className="text-center md:text-left">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/10 text-neon-purple text-xs font-bold mb-2 border border-neon-purple/20">
                    <Sparkles size={12} /> WAITING LOBBY
                </span>
                <h1 className="text-3xl md:text-4xl font-bold font-fredoka text-white">Match Day Countdown</h1>
              </div>

              {/* Compact Timer or Unlock Button */}
              {status.isLocked ? (
                  <div className="flex gap-3">
                      <TimerBox value={timeLeft.days} label="Days" />
                      <TimerBox value={timeLeft.hours} label="Hrs" />
                      <TimerBox value={timeLeft.minutes} label="Mins" />
                      <TimerBox value={timeLeft.seconds} label="Secs" />
                  </div>
              ) : (
                  <Link to="/results">
                      <Button variant="primary" size="lg" className="animate-pulse shadow-lg shadow-neon-pink/40" icon={Unlock}>
                          View Results Now
                      </Button>
                  </Link>
              )}
          </div>

          {/* 2. Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              
              {/* Left Column: Chat (Takes 2 cols on large screen) */}
              <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                       <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                       <h2 className="text-xl font-bold text-white">Anonymous Live Chat</h2>
                  </div>
                  <ChatRoom />
              </div>

              {/* Right Column: Game Center */}
              <div className="space-y-6 flex flex-col">
                  
                  {/* Hero Game: Destiny Wheel (Always Visible) */}
                  <DestinyWheel />

                  <DailyQuote />

                  {/* Games Tab System */}
                  <div className="bg-dark-900/40 border border-white/10 rounded-2xl overflow-hidden p-1">
                       <div className="flex gap-1 mb-2 bg-black/20 p-1 rounded-xl">
                            <button 
                                onClick={() => setActiveTab("games")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "games" ? "bg-white/10 text-white shadow-lg" : "text-gray-500 hover:text-gray-300"}`}
                            >
                                <Gamepad2 size={16} /> Mini Games
                            </button>
                            <button 
                                onClick={() => setActiveTab("polls")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "polls" ? "bg-white/10 text-white shadow-lg" : "text-gray-500 hover:text-white"}`}
                            >
                                <BarChart2 size={16} /> Polls
                            </button>
                       </div>

                       <div className="p-2 min-h-[400px]">
                            {activeTab === "games" && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <RedFlagSwiper />
                                    <RoastMyRizz />
                                    <NeonLoveTester />
                                </div>
                            )}

                            {activeTab === "polls" && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <VibePoll />
                                    <p className="text-center text-gray-500 text-xs mt-4">More polls coming soon...</p>
                                </div>
                            )}
                       </div>
                  </div>
                  
              </div>
          </div>

          {/* 3. Feedback Form */}
          <div className="max-w-xl mx-auto mb-20 text-center">
              <h3 className="text-gray-400 mb-4 text-sm uppercase tracking-widest">Found a bug?</h3>
              <FeedbackForm />
          </div>

      </div>
    </PageWrapper>
  );
};

export default WaitingRoom;

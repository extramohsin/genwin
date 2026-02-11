import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FlamesGame from "../components/FlamesGame";

const WaitingRoom = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return navigate("/login");
        
        const user = JSON.parse(storedUser);
        try {
            const res = await fetch(`http://localhost:5000/api/match/status/${user.userId}`);
            const data = await res.json();
            
            if (!data.submitted) {
                navigate("/home");
                return;
            }
            
            setStatus(data);

            if (!data.isReady) {
                const targetDate = new Date(data.revealDate).getTime();
                
                const updateTimer = () => {
                    const now = new Date().getTime();
                    const distance = targetDate - now;
                    
                    if (distance < 0) {
                        setStatus(prev => ({ ...prev, isReady: true }));
                    } else {
                        setTimeLeft(distance);
                    }
                };
                
                updateTimer();
                const interval = setInterval(updateTimer, 1000);
                return () => clearInterval(interval);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    fetchStatus();
  }, [navigate]);

  const formatTime = (ms) => {
    if (ms < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading destiny...</div>;

  const timeComponents = timeLeft ? formatTime(timeLeft) : null;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center p-4">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-purple-900/20 to-transparent"></div>
          {/* Stars */}
          <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 bg-pink-500 rounded-full animate-pulse delay-75"></div>
          <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-150"></div>
      </div>

      <div className="z-10 w-full max-w-4xl flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex justify-between items-center py-6 mb-8">
            <h1 className="text-2xl font-bold tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                Genwin <span className="text-white text-xs bg-white/20 px-2 py-1 rounded ml-2">BETA</span>
            </h1>
            <button 
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-white transition-colors"
            >
                LOGOUT
            </button>
        </div>

        {status && status.isReady ? (
          <div className="text-center animate-fade-in-up mt-20">
            <h2 className="text-5xl font-extrabold mb-6 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              Results Are In! 🚀
            </h2>
            <p className="text-xl text-gray-300 mb-10">The universe has calculated your matches.</p>
            <button
              onClick={() => navigate("/match-results")}
              className="px-10 py-5 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl text-black font-black text-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(34,197,94,0.4)]"
            >
              REVEAL MATCHES
            </button>
          </div>
        ) : (
          <div className="w-full grid md:grid-cols-2 gap-12 items-start">
            {/* Left Column: Countdown */}
            <div className="space-y-8 animate-fade-in-up">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl text-center">
                    <h3 className="text-gray-400 uppercase tracking-widest text-sm mb-6">Time Until Reveal</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {timeComponents && Object.entries(timeComponents).map(([label, value]) => (
                            <div key={label} className="flex flex-col items-center">
                                <div className="text-4xl md:text-5xl font-black text-white mb-2 font-mono">
                                    {String(value).padStart(2, '0')}
                                </div>
                                <div className="text-xs text-gray-500 uppercase">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-pink-500/10 border border-pink-500/20 p-6 rounded-2xl">
                    <h4 className="flex items-center gap-2 text-pink-400 font-bold mb-2">
                        <span>🔒</span> Choices Locked
                    </h4>
                    <p className="text-pink-200/60 text-sm">
                        You have successfully cast your votes. Sit back, relax, and play some FLAMES while you wait!
                    </p>
                </div>
            </div>

            {/* Right Column: FLAMES Game */}
            <div className="animate-fade-in-up delay-100">
                <FlamesGame />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitingRoom;

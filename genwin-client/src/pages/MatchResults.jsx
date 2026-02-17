import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, HeartCrack, Heart, Search } from "lucide-react";
import PageWrapper from "../components/ui/PageWrapper";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import FeedbackForm from "../components/FeedbackForm";
import API_URL from "../config";
import confetti from "canvas-confetti";

const MatchResults = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
          setLoading(false);
          return;
      }
      
      try {
        const statusResponse = await fetch(`${API_URL}/api/match/status`, {
           headers: { Authorization: `Bearer ${token}` }
        });
        const statusData = await statusResponse.json();

        // Always fetch result if submitted, or if we want to check lock status
        const response = await fetch(`${API_URL}/api/match/result`, { 
           headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (!data.locked) {
            setIsLocked(false);
            setMatches(data.matches || []);
        } else {
            setIsLocked(true);
        }
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const handleReveal = () => {
    setRevealed(true);
    if (matches.length > 0) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#8b5cf6', '#f59e0b']
      });
    }
  };

  return (
    <PageWrapper className="flex flex-col items-center justify-center min-h-[80vh]">
      {/* If Still Locked (Should be caught by waiting room, but backup) */}
      {isLocked && !loading && (
          <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Results are Locked! 🔒</h1>
              <p className="text-gray-400 mb-6">You are a bit too early. Please wait for the reveal time.</p>
              <Link to="/waiting-room"><Button variant="secondary">Back to Waiting Room</Button></Link>
          </div>
      )}

      {/* Unlocked but not revealed user interaction */}
      {!isLocked && !revealed ? (
         <div className="text-center space-y-6 max-w-lg">
            <h1 className="text-4xl md:text-6xl font-black font-fredoka bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-gradient">
              The Moment of Truth
            </h1>
            <p className="text-xl text-gray-300">
              Are your feelings mutual? Or is it time to move on? 
            </p>
            
            <GlassCard className="p-10 mt-8 border-pink-500/50 shadow-pink-500/20 hover:scale-105 transition-transform duration-500">
               <div className="flex justify-center mb-6">
                 <div className="relative">
                    <Heart size={80} className="text-pink-600 animate-pulse" fill="currentColor" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Sparkles size={40} className="text-white animate-spin-slow" />
                    </div>
                 </div>
               </div>
               
               <Button onClick={handleReveal} className="w-full text-xl py-4" variant="primary">
                 Reveal My Matches
               </Button>
            </GlassCard>
         </div>
      ) : null}

      {/* Revealed Results */}
      {!isLocked && revealed ? (
        <div className="w-full max-w-3xl space-y-8 animate-fade-in text-center">
            {matches.length > 0 ? (
                <>
                   <h2 className="text-4xl font-bold font-fredoka text-white mb-6">
                      🎉 It's a Match!
                   </h2>
                   <div className="grid gap-6">
                     {matches.map((match, index) => (
                       <GlassCard key={index} className="flex items-center justify-between p-6 border-green-500/30 bg-green-900/10">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl uppercase">
                                {match.matchedUser.fullName[0]}
                             </div>
                             <div className="text-left">
                                <h3 className="text-xl font-bold text-white">{match.matchedUser.fullName}</h3>
                                <p className="text-green-400 text-sm">
                                    You selected: <span className="font-bold">{match.myCategory}</span> • 
                                    They selected: <span className="font-bold">{match.theirCategory}</span>
                                </p>
                             </div>
                          </div>
                          
                          <Button size="sm" variant="secondary" onClick={() => {/* Chat Logic */}}>
                            Copy ID
                          </Button>
                       </GlassCard>
                     ))}
                   </div>
                </>
            ) : (
                <div className="space-y-6">
                    <GlassCard className="p-8 border-gray-700 bg-gray-900/30">
                       <HeartCrack size={64} className="mx-auto text-gray-600 mb-4" />
                       <h2 className="text-2xl font-bold text-gray-300 mb-2">No Matches Yet</h2>
                       <p className="text-gray-400">
                         Don't lose hope! Keep putting yourself out there.
                       </p>
                    </GlassCard>
                    
                    <Link to="/home">
                      <Button variant="outline" icon={Search}>
                        Wait For Next Round
                      </Button>
                    </Link>
                </div>
            )}

            <div className="mt-12 text-left">
               <FeedbackForm />
            </div>
        </div>
      ) : null}
    </PageWrapper>
  );
};

export default MatchResults;

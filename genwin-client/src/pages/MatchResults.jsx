import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Search, Lock, PartyPopper, Frown } from "lucide-react";
import API_URL from "../config";
import Button from "../components/ui/Button";
import PageWrapper from "../components/ui/PageWrapper";
import GlassCard from "../components/ui/GlassCard";
import FeedbackForm from "../components/FeedbackForm";

const MatchResults = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/match/results/${user.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setResults(data);
        } else {
            // Handle locked or error state
            if (data.locked) {
                setResults({ locked: true, nextRevealAt: data.nextRevealAt });
            } else {
                setResults({ matches: [] }); 
            }
        }
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) fetchResults();
  }, [user?.userId]);

  const handleReveal = () => {
    setRevealed(true);
    if (results?.matches?.length > 0) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF3CAC', '#784BA0', '#2B86C5']
      });
    }
  };

  if (loading) {
    return (
      <PageWrapper className="flex items-center justify-center">
         <div className="animate-pulse text-pink-500 font-bold text-xl flex items-center gap-2">
            <Search className="animate-spin" /> Check your destiny...
         </div>
      </PageWrapper>
    );
  }

  // Handle Locked State
  if (results?.locked) {
      return (
        <PageWrapper className="flex flex-col items-center justify-center">
             <GlassCard className="text-center p-10 max-w-md">
                <Lock size={48} className="mx-auto text-pink-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Results are Locked!</h2>
                <p className="text-gray-400">
                    The global reveal will happen on <br/>
                    <span className="text-white font-bold">
                        {new Date(results.nextRevealAt).toLocaleString()}
                    </span>
                </p>
             </GlassCard>
        </PageWrapper>
      );
  }

  const hasMatches = results?.matches?.length > 0;

  return (
    <PageWrapper className="flex flex-col items-center">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 font-fredoka">
          The Moment of Truth
        </h1>
      </div>

      {!revealed ? (
         <GlassCard className="max-w-md w-full text-center py-16">
            <div className="mb-8 flex justify-center">
               <div className="p-6 bg-slate-800 rounded-full border border-white/10 shadow-lg shadow-pink-500/20">
                  <Lock size={48} className="text-pink-500" />
               </div>
            </div>
            <h2 className="text-2xl font-bold mb-4">Results are Ready</h2>
            <p className="text-gray-400 mb-8">
               Are you ready to see who chose you back?
            </p>
            <Button size="lg" onClick={handleReveal} className="w-full text-xl py-4 shadow-xl shadow-pink-500/20">
               Reveal My Destiny 🔓
            </Button>
         </GlassCard>
      ) : (
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl"
          >
             {hasMatches ? (
                <div className="space-y-6">
                   <div className="text-center mb-8">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block p-4 rounded-full bg-green-500/20 text-green-400 mb-4"
                      >
                         <PartyPopper size={32} />
                      </motion.div>
                      <h2 className="text-3xl font-bold text-white">It's a Match! 🎉</h2>
                      <p className="text-gray-300">Destiny has brought you together.</p>
                   </div>

                   {results.matches.map((match, index) => (
                      <GlassCard key={index} className="!p-6 border-pink-500/50 shadow-pink-500/20">
                         <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="p-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 shrink-0">
                               <Heart size={32} className="text-white" fill="white" />
                            </div>
                            <div className="text-center md:text-left">
                               <h3 className="text-2xl font-bold text-white">{match.fullName}</h3>
                               <p className="text-sm text-gray-400">@{match.username} • {match.branch}</p>
                               <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10">
                                    <span className="text-pink-400 font-bold">{match.myType}</span>
                                    <span className="text-gray-500">↔</span>
                                    <span className="text-purple-400 font-bold">{match.theirType}</span>
                               </div>
                            </div>
                         </div>
                      </GlassCard>
                   ))}
                </div>
             ) : (
                <div className="text-center">
                   <motion.div 
                     initial={{ rotate: 0 }}
                     animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                     transition={{ duration: 0.5, delay: 0.2 }}
                     className="inline-block p-6 rounded-full bg-slate-800 border border-white/10 mb-6"
                   >
                      <Frown size={48} className="text-gray-400" />
                   </motion.div>
                   <h2 className="text-3xl font-bold text-white mb-4">No Mutual Matches Yet 💔</h2>
                   <p className="text-gray-400 max-w-md mx-auto mb-8">
                      You selected 3 people, but unfortunately, none of them selected you back. 
                      Keep your head up!
                   </p>
                   <Button variant="secondary" onClick={() => window.location.href='/home'}>
                      Back to Home
                   </Button>
                </div>
             )}
          </motion.div>
        </AnimatePresence>
      )}
    </PageWrapper>
  );
};

export default MatchResults;

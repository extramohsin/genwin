import { useState, useEffect } from "react";
import GlassCard from "../ui/GlassCard";
import { BarChart2 } from "lucide-react";
import API_URL from "../../config";

const VibePoll = () => {
  const [poll, setPoll] = useState(null);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoll = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/poll/active`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setPoll(data);
            
            // simple local storage check needed so they don't vote endlessly on refresh?
            // backend doesn't restrict yet, but let's just use state for session
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    fetchPoll();
  }, []);

  const handleVote = async (index) => {
    if (voted) return;
    setVoted(true); // Optimistic UI

    // Update Local State Optimistically
    const newOptions = [...poll.options];
    newOptions[index].votes++;
    setPoll({ ...poll, options: newOptions });

    try {
        const token = localStorage.getItem("token");
        await fetch(`${API_URL}/api/poll/vote/${poll._id}`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ optionIndex: index })
        });
    } catch (e) {
        console.error("Vote failed", e);
    }
  };

  if (loading || !poll) return <div className="animate-pulse bg-white/5 h-40 rounded-xl" />;

  const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0);

  return (
    <GlassCard className="p-6 border-cyan-500/30">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 font-fredoka">
            <BarChart2 className="text-cyan-400" /> Vibe Check
        </h3>
        <p className="text-gray-300 mb-4">{poll.question}</p>
        
        <div className="space-y-3">
            {poll.options.map((opt, idx) => {
                const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                
                return (
                    <div key={idx} onClick={() => handleVote(idx)} className={`relative overflow-hidden rounded-lg cursor-pointer transition-all ${voted ? 'opacity-80' : 'hover:bg-white/5'}`}>
                        {/* Background Bar */}
                        <div 
                            className="absolute top-0 left-0 h-full bg-cyan-500/20 transition-all duration-1000" 
                            style={{ width: `${percentage}%` }}
                        />
                        
                        <div className="relative p-3 flex justify-between items-center z-10 border border-white/10 rounded-lg">
                            <span className="text-sm font-medium text-white">{opt.text}</span>
                            {voted && <span className="text-xs font-bold text-cyan-400">{percentage}%</span>}
                        </div>
                    </div>
                );
            })}
        </div>
        <div className="text-right mt-2 text-xs text-gray-500">
            {totalVotes} votes
        </div>
    </GlassCard>
  );
};

export default VibePoll;

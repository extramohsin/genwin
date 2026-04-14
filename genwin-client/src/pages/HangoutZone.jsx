import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Send, AlertTriangle, User, CornerDownLeft, MessageSquare, ChevronRight, Zap, Flame, SplitSquareHorizontal, Activity, PartyPopper, Check, Smile, UserCircle, Timer, Users, Hash, Clock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import PageWrapper from "../components/ui/PageWrapper";
import GlassCard from "../components/ui/GlassCard";
import FeedbackForm from "../components/FeedbackForm";
import API_URL from "../config";

const ANIMALS = ["Fox", "Panda", "Owl", "Tiger", "Koala", "Penguin", "Lion", "Wolf", "Bear", "Cat"];
const ADJECTIVES = ["Neon", "Cyber", "Mystic", "Cosmic", "Happy", "Lucky", "Wild", "Chill"];

// --- TAB COMPONENTS (REDESIGNED) ---

const HotTakesTab = () => {
    const [take, setTake] = useState(null);
    const [voted, setVoted] = useState(false);

    const fetchTake = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/hottakes/active`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setTake(data);
            setVoted(false);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => { fetchTake(); }, []);

    const handleVote = async (vote) => {
        if (voted || !take) return;
        setVoted(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/hottakes/${take._id}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ vote })
            });
            const data = await res.json();
            setTake(data);
        } catch (e) {
            console.error(e);
        }
    };

    if (!take) return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                <Flame size={40} className="text-neon-pink opacity-50" />
            </motion.div>
            <p className="font-fredoka tracking-widest text-xs uppercase opacity-60">Igniting Takes...</p>
        </div>
    );

    const totalVotes = take.agreeVotes + take.disagreeVotes;
    const agreePercent = totalVotes === 0 ? 50 : Math.round((take.agreeVotes / totalVotes) * 100);
    const disagreePercent = 100 - agreePercent;

    const diff = Math.abs(agreePercent - disagreePercent);
    let spiceCount = 5;
    if (diff > 80) spiceCount = 1;
    else if (diff > 60) spiceCount = 2;
    else if (diff > 40) spiceCount = 3;
    else if (diff > 20) spiceCount = 4;

    return (
        <div className="flex flex-col h-full bg-transparent">
            <div className="flex-1 flex flex-col justify-center items-center px-4 relative">
                {/* Visual Flair */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-pink/5 blur-[100px] pointer-events-none rounded-full" />
                
                <h3 className="text-[10px] font-black text-neon-pink uppercase tracking-[0.3em] mb-8 bg-neon-pink/10 px-4 py-1.5 rounded-full border border-neon-pink/20">
                    Spice Level: {'🌶️'.repeat(spiceCount)}
                </h3>
                
                <motion.h2 
                    key={take.statement}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-2xl md:text-3xl font-black text-white text-center mb-12 font-fredoka leading-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                >
                    "{take.statement}"
                </motion.h2>

                <div className="w-full max-w-md space-y-4">
                    {!voted ? (
                        <div className="flex flex-col gap-3">
                            <motion.button 
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(236, 72, 153, 0.2)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleVote('agree')} 
                                className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:border-neon-pink shadow-lg transition-all flex items-center justify-center gap-3 group"
                            >
                                <Flame size={20} className="text-neon-pink group-hover:scale-125 transition-transform" />
                                Pure Fire
                            </motion.button>
                            <motion.button 
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(34, 211, 238, 0.2)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleVote('disagree')} 
                                className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:border-neon-cyan shadow-lg transition-all flex items-center justify-center gap-3 group"
                            >
                                <span className="group-hover:rotate-12 transition-transform">💀</span>
                                Nah Fam
                            </motion.button>
                        </div>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-400">
                                    <span>Fire {agreePercent}%</span>
                                    <span>Cold {disagreePercent}%</span>
                                </div>
                                <div className="h-4 w-full bg-white/5 rounded-full p-1 overflow-hidden border border-white/10 shadow-inner">
                                    <div className="h-full flex rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${agreePercent}%` }}
                                            className="h-full bg-gradient-to-r from-neon-pink to-orange-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                                        />
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${disagreePercent}%` }}
                                            className="h-full bg-gradient-to-r from-neon-cyan to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <Button onClick={fetchTake} className="rounded-full px-12 py-3 bg-white text-black font-black uppercase tracking-widest hover:scale-105 transition-transform">
                                    Next Take
                                </Button>
                                <p className="text-[10px] text-gray-500 mt-4 font-bold uppercase tracking-widest">{totalVotes} lurkers weighed in</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

const WouldYouRatherTab = () => {
    const [wyr, setWyr] = useState(null);
    const [voted, setVoted] = useState(false);

    const fetchWyr = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/wyr/active`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setWyr(data);
            setVoted(false);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => { fetchWyr(); }, []);

    const handleVote = async (vote) => {
        if (voted || !wyr) return;
        setVoted(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/wyr/${wyr._id}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ vote })
            });
            const data = await res.json();
            setWyr(data);
        } catch (e) {
            console.error(e);
        }
    };

    if (!wyr) return <div className="flex h-full items-center justify-center animate-pulse text-gray-500 font-fredoka uppercase tracking-widest text-xs">Pondering...</div>;

    const totalVotes = wyr.votesA + wyr.votesB;
    const pctA = totalVotes === 0 ? 50 : Math.round((wyr.votesA / totalVotes) * 100);
    const pctB = 100 - pctA;

    return (
        <div className="flex flex-col h-full bg-transparent p-4 md:p-8">
            <h2 className="text-xl md:text-2xl font-black text-center mb-8 font-fredoka lowercase text-neon-purple tracking-wider">
                would you <span className="text-white italic">rather...</span>
            </h2>

            <div className="flex-1 flex flex-col md:flex-row gap-4 relative">
                {voted && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                        <div className="bg-dark-950 border border-white/20 w-12 h-12 rounded-full flex items-center justify-center font-black italic text-gray-500 shadow-2xl backdrop-blur-xl">VS</div>
                    </div>
                )}
                
                <motion.button 
                    disabled={voted}
                    onClick={() => handleVote('A')}
                    className={`flex-1 p-8 rounded-[2rem] border-2 transition-all relative overflow-hidden flex flex-col justify-center items-center gap-4 ${voted ? (pctA >= pctB ? 'border-neon-purple bg-neon-purple/5' : 'border-white/5 bg-transparent opacity-40') : 'border-white/10 bg-white/5 hover:border-neon-purple/50'}`}
                >
                    <p className="text-lg md:text-xl font-bold text-white text-center leading-tight">"{wyr.optionA}"</p>
                    {voted && (
                        <div className="w-full mt-4">
                            <span className="text-3xl font-black text-neon-purple">{pctA}%</span>
                            <div className="w-full h-1.5 bg-white/5 rounded-full mt-2">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${pctA}%` }} className="h-full bg-neon-purple shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                            </div>
                        </div>
                    )}
                </motion.button>

                <motion.button 
                    disabled={voted}
                    onClick={() => handleVote('B')}
                    className={`flex-1 p-8 rounded-[2rem] border-2 transition-all relative overflow-hidden flex flex-col justify-center items-center gap-4 ${voted ? (pctB > pctA ? 'border-neon-cyan bg-neon-cyan/5' : 'border-white/5 bg-transparent opacity-40') : 'border-white/10 bg-white/5 hover:border-neon-cyan/50'}`}
                >
                    <p className="text-lg md:text-xl font-bold text-white text-center leading-tight">"{wyr.optionB}"</p>
                    {voted && (
                        <div className="w-full mt-4">
                            <span className="text-3xl font-black text-neon-cyan">{pctB}%</span>
                            <div className="w-full h-1.5 bg-white/5 rounded-full mt-2">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${pctB}%` }} className="h-full bg-neon-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                            </div>
                        </div>
                    )}
                </motion.button>
            </div>

            {voted && (
                <div className="flex justify-center mt-6">
                    <Button onClick={fetchWyr} className="bg-white text-black rounded-full px-8 py-2 font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform">
                        Next Dilemma
                    </Button>
                </div>
            )}
        </div>
    );
};

const DonutChart = ({ data }) => {
    const size = 260;
    const strokeWidth = 24;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
    let currentOffset = 0;

    return (
        <div className="relative group" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                {data.map((d, i) => {
                    const strokeLength = (d.value / total) * circumference;
                    const strokeDasharray = `${strokeLength} ${circumference - strokeLength}`;
                    const strokeDashoffset = -currentOffset;
                    currentOffset += strokeLength;
                    return (
                        <circle
                            key={d.label}
                            cx={size/2}
                            cy={size/2}
                            r={radius}
                            fill="transparent"
                            stroke={d.color}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                            style={{
                                strokeDasharray: `${circumference} ${circumference}`,
                                strokeDashoffset: circumference,
                                animation: `fillDonut${i} 1.5s ease-out forwards`,
                                filter: `drop-shadow(0 0 8px ${d.color})`
                            }}
                        />
                    );
                })}
            </svg>
            <style>{`
                ${data.map((d, i) => {
                    const strokeLength = (d.value / total) * circumference;
                    let calculatedOffset = 0;
                    for (let j=0; j<i; j++) {
                        calculatedOffset += (data[j].value / total) * circumference;
                    }
                    return `
                        @keyframes fillDonut${i} {
                            from { stroke-dasharray: 0 ${circumference}; stroke-dashoffset: 0; }
                            to { stroke-dasharray: ${strokeLength} ${circumference}; stroke-dashoffset: -${calculatedOffset}; }
                        }
                    `;
                }).join('\n')}
            `}</style>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-4xl font-black text-white group-hover:scale-110 transition-transform">{total === 1 && data.every(d=>d.value===0) ? 0 : total}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black mt-1">Total Vibes</span>
            </div>
        </div>
    );
};

const VibeCheckTab = () => {
    const [vibe, setVibe] = useState(null);
    const [voted, setVoted] = useState(false);
    const [selectedMood, setSelectedMood] = useState(null);

    const fetchVibe = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/vibe/today`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setVibe(data);
        } catch(e) { console.error(e); }
    };

    useEffect(() => { fetchVibe(); }, []);

    const handleVote = async (mood) => {
        if (voted) return;
        setVoted(true);
        setSelectedMood(mood);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/vibe/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ mood })
            });
            const data = await res.json();
            setVibe(data);
        } catch(e) { console.error(e); }
    };

    if (!vibe) return <div className="text-center p-4 animate-pulse">Loading Vibes...</div>;

    const moods = [
        { label: "Happy", emoji: "😊", color: "#4ade80" },
        { label: "Nervous", emoji: "😰", color: "#facc15" },
        { label: "Excited", emoji: "🤩", color: "#60a5fa" },
        { label: "Bored", emoji: "😴", color: "#94a3b8" },
        { label: "Crushing", emoji: "💘", color: "#f472b6" },
        { label: "Chaotic", emoji: "🌀", color: "#c084fc" }
    ];

    const chartData = moods.map(m => ({
        label: m.label,
        value: vibe[m.label] || 0,
        color: m.color
    }));

    return (
        <div className="flex flex-col h-full bg-transparent p-4 md:p-6 overflow-y-auto custom-scrollbar">
            <h3 className="text-lg md:text-xl font-black text-white text-center mb-8 font-fredoka lowercase tracking-wide">
                how are you <span className="text-neon-cyan italic">actually</span> feeling?
            </h3>

            <div className="grid grid-cols-3 gap-3 mb-10">
                {moods.map(m => {
                    const isSelected = selectedMood === m.label;
                    return (
                        <motion.button 
                            key={m.label}
                            whileHover={!voted ? { scale: 1.05, y: -2 } : {}}
                            whileTap={!voted ? { scale: 0.95 } : {}}
                            onClick={() => handleVote(m.label)}
                            className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 relative ${voted ? (isSelected ? 'border-white bg-white/10' : 'border-white/5 bg-transparent opacity-40 grayscale') : 'border-white/10 bg-white/5 hover:border-white/30'}`}
                        >
                            <span className="text-3xl mb-1">{m.emoji}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{m.label}</span>
                        </motion.button>
                    );
                })}
            </div>

            <div className="flex-1 flex flex-col items-center gap-8 bg-black/40 rounded-[2.5rem] p-10 shadow-inner border border-white/5">
                <DonutChart data={chartData} />
                <div className="grid grid-cols-2 gap-x-12 gap-y-4 w-full max-w-sm">
                    {chartData.map(d => (
                        <div key={d.label} className="flex items-center justify-between group">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color, boxShadow: `0 0 10px ${d.color}` }} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">{d.label}</span>
                            </div>
                            <span className="text-sm font-black text-white bg-white/5 px-3 py-0.5 rounded-full border border-white/5">{d.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---

const TimerBox = ({ value, label }) => (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center"
    >
        <div className="w-16 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.05)] relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-3xl font-black font-fredoka text-white relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{String(value).padStart(2, '0')}</span>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-neon-pink/20" />
        </div>
        <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mt-3">{label}</span>
    </motion.div>
);

const HangoutZone = () => {
    // Sockets & State
    const [onlineCount, setOnlineCount] = useState(1);
    const [whoIsHere, setWhoIsHere] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const [anonName, setAnonName] = useState("");
    const [connected, setConnected] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [replyTo, setReplyTo] = useState(null);
    const [joinedToasts, setJoinedToasts] = useState([]);
    const [reactionsMap, setReactionsMap] = useState({});
    const [activeTab, setActiveTab] = useState("hottakes");
    const [activeDropdown, setActiveDropdown] = useState(false);
    const [mentionSearch, setMentionSearch] = useState(null);
    const messagesEndRef = useRef(null);

    // Timer State
    const [status, setStatus] = useState({ isLocked: true, remainingTime: 0, nextRevealAt: null });
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        let storedName = sessionStorage.getItem("anonName");
        if (!storedName) {
            const randomAdj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
            const randomAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
            const randomNum = Math.floor(Math.random() * 1000);
            storedName = `${randomAdj} ${randomAnimal} #${randomNum}`;
            sessionStorage.setItem("anonName", storedName);
        }
        setAnonName(storedName);

        // Fetch Reveal Status
        const fetchStatus = async () => {
          try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const res = await fetch(`${API_URL}/api/match/status`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) setStatus(await res.json());
          } catch (e) { console.error(e); }
        };
        fetchStatus();
    }, []);

    useEffect(() => {
        if (!status.nextRevealAt) return;
        const targetDate = new Date(status.nextRevealAt);
        const timer = setInterval(() => {
          const now = new Date();
          const diff = targetDate - now;
          if (diff > 0) {
            setTimeLeft({
              days: Math.floor(diff / (1000 * 60 * 60 * 24)),
              hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
              minutes: Math.floor((diff / 1000 / 60) % 60),
              seconds: Math.floor((diff / 1000) % 60),
            });
          } else {
            setStatus(prev => ({ ...prev, isLocked: false }));
            clearInterval(timer);
          }
        }, 1000);
        return () => clearInterval(timer);
    }, [status.nextRevealAt]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`${API_URL}/api/presence/count`, { headers: { "Authorization": `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => setOnlineCount(data.count))
            .catch(e => console.error(e));

        const baseUrl = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;
        const newSocket = io(baseUrl, {
            auth: { token },
            transports: ["websocket", "polling"],
        });

        newSocket.on("connect", () => {
            setConnected(true);
            newSocket.emit("join_room", sessionStorage.getItem("anonName"));
        });

        newSocket.on("disconnect", () => setConnected(false));
        newSocket.on("online_count", (count) => setOnlineCount(count));
        newSocket.on("sync_active_users", (activeNames) => setWhoIsHere(activeNames));
        
        newSocket.on("user_joined", ({ anonName: joinedName }) => {
            const id = Date.now().toString();
            setJoinedToasts(prev => [...prev, { id, name: joinedName }]);
            setTimeout(() => setJoinedToasts(prev => prev.filter(t => t.id !== id)), 3000);
        });

        newSocket.on("receive_message", (msg) => setMessages((prev) => [...prev, msg]));

        setSocket(newSocket);

        fetch(`${API_URL}/api/chat/history`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(err => console.error("History Error", err));

        return () => { if (newSocket) newSocket.disconnect(); };
    }, []);

    useEffect(() => { 
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, joinedToasts]);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setInterval(() => setCooldown(c => c - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [cooldown]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || cooldown > 0) return;
        if (newMessage.length > 200) return toast.error("Too long!");

        let isWhisper = false;
        let mentionedName = null;
        whoIsHere.forEach(name => {
            if (newMessage.includes(`@${name}`)) {
                isWhisper = true;
                mentionedName = name;
            }
        });

        socket.emit("send_message", {
            message: newMessage,
            anonName: anonName,
            replyTo: replyTo ? replyTo._id : null,
            quoteAnonName: replyTo ? replyTo.anonName : null,
            quoteText: replyTo ? replyTo.message : null,
            isWhisper,
            mentionedName
        });

        setNewMessage("");
        setReplyTo(null);
        setActiveDropdown(false);
        setMentionSearch(null);
        setCooldown(5);
    };

    const handleReact = (msgId, emoji) => {
        setReactionsMap(prev => {
            const next = {...prev};
            if (!next[msgId]) next[msgId] = { '❤️': 0, '😂': 0, '👀': 0 };
            next[msgId][emoji] += 1;
            return next;
        });
    };

    return (
        <PageWrapper className="flex flex-col pt-16 relative bg-[#04060f]">
            {/* Atmospheric Background Blobs */}
            <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] bg-neon-pink/10 rounded-full blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-[10%] right-[5%] w-[35vw] h-[35vw] bg-neon-purple/10 rounded-full blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: '12s' }} />
            <div className="absolute top-[40%] left-[40%] w-[30vw] h-[30vw] bg-neon-cyan/5 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />

            <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col p-4 md:p-6 lg:p-8 relative z-10 transition-all duration-500">
                
                {/* 1. TOP HUD (REFINED) */}
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="px-5 py-2.5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-3 shadow-2xl">
                            <Timer size={18} className="text-neon-pink" />
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Next Match Day</span>
                                <span className="text-xs font-bold text-white tracking-widest">TBD</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="px-6 py-2.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-3xl flex items-center gap-4 shadow-inner group transition-all hover:border-white/20">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 shadow-[0_0_10px_#4ade80]"></span>
                                </span>
                                <span className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-green-400 transition-colors">
                                    {onlineCount} lurkers lurking
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <div className="px-5 py-2 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-xl flex items-center gap-3 shadow-2xl overflow-hidden group">
                           <div className="absolute inset-0 bg-gradient-to-r from-neon-pink/0 via-white/5 to-neon-pink/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                           <UserCircle size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                           <div className="flex flex-col">
                               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neon-pink">You are literally</span>
                               <span className="text-sm font-bold text-white tracking-wide">{anonName}</span>
                           </div>
                        </div>
                    </div>
                </div>

                {/* 2. PRESENCE MARQUEE */}
                <div className="mb-8 overflow-hidden relative group">
                    <div className="flex items-center gap-4 animate-marquee whitespace-nowrap py-2">
                        {Array(3).fill(whoIsHere).flat().map((name, i) => (
                            <div key={`${name}-${i}`} className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-gray-400 hover:border-white/20 hover:text-white transition-all cursor-default">
                                <Hash size={10} className="text-neon-purple opacity-50" />
                                {name}
                            </div>
                        ))}
                    </div>
                    {/* Fades for marquee */}
                    <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#04060f] to-transparent pointer-events-none z-10" />
                    <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#04060f] to-transparent pointer-events-none z-10" />
                </div>

                {/* 3. MAIN DASHBOARD AREA */}
                <div className="h-[calc(100vh-320px)] min-h-[600px] flex flex-col md:flex-row gap-6 md:gap-8 overflow-hidden mb-20">
                    
                    {/* LEFT: INTERACTION HUB */}
                    <div className="md:w-[45%] flex flex-col relative">
                        <div className="flex items-center gap-2 p-1.5 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/5 mb-6 self-start shadow-inner">
                            {["hottakes", "wyr", "vibe"].map(tab => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${activeTab === tab ? "bg-white text-black shadow-lg" : "text-gray-500 hover:text-white hover:bg-white/5"}`}
                                >
                                    {tab === "hottakes" && "Hot Take"}
                                    {tab === "wyr" && "The Choice"}
                                    {tab === "vibe" && "The Vibe"}
                                </button>
                            ))}
                        </div>
                        
                        <div className="flex-1 bg-white/5 backdrop-blur-[40px] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative">
                            {/* Inner Rim Light */}
                            <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            
                            <AnimatePresence mode="wait">
                                <motion.div 
                                    key={activeTab}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.02 }}
                                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                    className="h-full"
                                >
                                    {activeTab === "hottakes" && <HotTakesTab />}
                                    {activeTab === "wyr" && <WouldYouRatherTab />}
                                    {activeTab === "vibe" && <VibeCheckTab />}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* RIGHT: COMMAND CENTER CHAT */}
                    <div className="md:w-[55%] flex flex-col relative bg-white/5 backdrop-blur-[50px] border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden group/chat">
                        {/* Sublime geometric accent line */}
                        <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent" />
                        
                        {/* Premium Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-neon-cyan/10 rounded-xl">
                                    <MessageSquare size={20} className="text-neon-cyan" />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-black text-white lowercase tracking-widest font-fredoka">vibe room</h3>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">encrypted / anonymous</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative bg-black/10">
                            {messages.length === 0 && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center opacity-30">
                                    <Smile size={60} className="text-neon-purple mb-4 animate-bounce" />
                                    <p className="font-fredoka text-lg text-white">Silence is violence.<br/>Say something weird.</p>
                                </div>
                            )}

                            {messages.map((msg, idx) => {
                                const isMe = msg.anonName === anonName;
                                const showName = idx === 0 || messages[idx-1].anonName !== msg.anonName;
                                const isWhisper = msg.isWhisper;
                                const isReceiver = msg.mentionedName === anonName;
                                const canSeeWhisper = isMe || isReceiver || !isWhisper;

                                if (!canSeeWhisper) return (
                                    <div key={msg._id} className="flex flex-col items-center opacity-40">
                                        <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] italic text-gray-400">
                                            🤫 Whisper to <span className="text-neon-pink font-bold">@{msg.mentionedName}</span> is hidden...
                                        </div>
                                    </div>
                                );

                                return (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        key={msg._id} 
                                        className={`flex flex-col relative group ${isMe ? "items-end" : "items-start"}`}
                                    >
                                        {showName && !isMe && (
                                            <div className="flex items-center gap-2 mb-2 ml-4">
                                                <div className="w-4 h-4 rounded-full bg-neon-purple/20 border border-neon-purple/30" />
                                                <span className="text-[10px] font-black text-neon-purple uppercase tracking-[0.2em]">{msg.anonName}</span>
                                            </div>
                                        )}
                                        
                                        <div 
                                            onContextMenu={(e) => { e.preventDefault(); setReplyTo(msg); }}
                                            className={`relative max-w-[85%] rounded-[1.8rem] p-4 px-6 shadow-2xl transition-all duration-300 hover:scale-[1.02] ${
                                            isWhisper ? "bg-gradient-to-br from-neon-pink/40 to-neon-purple/40 border border-white/20 text-white shadow-[0_0_30px_rgba(236,72,153,0.2)]" : 
                                            (isMe ? "bg-white/10 border border-white/15 text-white" : "bg-black/40 border border-white/5 text-gray-200 shadow-inner")
                                        } ${isMe ? "rounded-tr-none" : "rounded-tl-none"}`}
                                        >
                                            {isWhisper && (
                                                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                                                    <Smile size={12} className="text-neon-pink" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-pink-300">whisper sequence</span>
                                                </div>
                                            )}

                                            {(msg.quoteAnonName || msg.replyTo) && (
                                                <div className="mb-3 p-3 bg-black/40 rounded-2xl border-l-[3px] border-neon-pink text-xs text-gray-400 opacity-80 backdrop-blur-sm">
                                                    <span className="text-[9px] font-black text-neon-pink block mb-1 uppercase tracking-widest">{msg.quoteAnonName}</span>
                                                    <p className="line-clamp-2 italic">"{msg.quoteText}"</p>
                                                </div>
                                            )}
                                            
                                            <p className="text-[15px] leading-relaxed font-medium">
                                                {msg.message.split(' ').map((word, i) => (
                                                    word.startsWith('@') ? <span key={i} className="text-neon-cyan font-black drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">{word} </span> : word + ' '
                                                ))}
                                            </p>

                                            <div className={`absolute bottom-0 ${isMe ? "right-full mr-4" : "left-full ml-4"} flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100`}>
                                                <span className="text-[9px] font-black text-gray-500 bg-black/60 px-2 py-1 rounded-full border border-white/5 backdrop-blur-3xl">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                                                </span>
                                                <button onClick={() => setReplyTo(msg)} className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all shadow-xl">
                                                    <CornerDownLeft size={12} />
                                                </button>
                                            </div>

                                            {/* Local Reactions Display */}
                                            {reactionsMap[msg._id] && (
                                                <div className={`flex gap-1.5 mt-3 ${isMe ? "justify-end" : "justify-start"}`}>
                                                    {Object.entries(reactionsMap[msg._id]).map(([emoji, count]) => (
                                                        count > 0 && (
                                                            <div key={emoji} className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-full border border-white/10 backdrop-blur-md shadow-xl animate-in pop-in">
                                                                <span className="text-[10px]">{emoji}</span>
                                                                <span className="text-[10px] font-black text-white/80">{count}</span>
                                                            </div>
                                                        )
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input Area */}
                        <div className="p-6 md:p-8 bg-black/40 backdrop-blur-[60px] border-t border-white/10 relative z-10 group-focus-within/chat:bg-black/60 transition-all duration-500">
                            {replyTo && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center bg-white/5 border border-white/10 p-3 rounded-2xl mb-4 text-xs">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-8 bg-neon-cyan rounded-full" />
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Replying to</span>
                                            <span className="font-bold text-white tracking-wide">{replyTo.anonName}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setReplyTo(null)} className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-all">✕</button>
                                </motion.div>
                            )}

                            <form onSubmit={handleSend} className="relative flex items-center gap-4">
                                <div className="relative flex-1 group/input">
                                    {activeDropdown && (
                                        <div className="absolute bottom-full left-0 mb-4 w-72 bg-dark-950/90 backdrop-blur-[60px] border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden z-50 animate-in slide-in-from-bottom-2">
                                            <div className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 bg-white/5 border-b border-white/5">mention lurker</div>
                                            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                                {whoIsHere.filter(n => n.toLowerCase().includes((mentionSearch||"").toLowerCase())).length === 0 ? (
                                                    <div className="p-8 text-center text-xs text-gray-600 font-bold uppercase italic tracking-widest">Ghost town...</div>
                                                ) : (
                                                    whoIsHere.filter(n => n.toLowerCase().includes((mentionSearch||"").toLowerCase())).map(name => (
                                                        <button
                                                            key={name}
                                                            type="button"
                                                            onClick={() => {
                                                                const newVal = newMessage.replace(/@[a-zA-Z0-9#\s]*$/, `@${name} `);
                                                                setNewMessage(newVal);
                                                                setActiveDropdown(false);
                                                                setMentionSearch(null);
                                                                document.getElementById("chat-input").focus();
                                                            }}
                                                            className="w-full text-left px-5 py-4 text-xs font-bold text-gray-400 hover:bg-white/10 hover:text-white transition-all flex items-center gap-3"
                                                        >
                                                            <div className="w-2 h-2 rounded-full bg-neon-purple opacity-40 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                                            {name}
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <input 
                                        id="chat-input"
                                        autoComplete="off"
                                        value={newMessage}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setNewMessage(val);
                                            const match = val.match(/@([a-zA-Z0-9#\s]*)$/);
                                            if (match) {
                                                setMentionSearch(match[1]);
                                                setActiveDropdown(true);
                                            } else {
                                                setActiveDropdown(false);
                                                setMentionSearch(null);
                                            }
                                        }}
                                        placeholder={cooldown > 0 ? `Rate limited for ${cooldown}s...` : "Transmit a vibe... (type @ for mentions)"}
                                        disabled={cooldown > 0 || !connected}
                                        className="w-full py-5 px-8 rounded-full bg-white/5 border border-white/10 focus:border-neon-cyan/50 focus:bg-white/10 transition-all outline-none text-white text-[15px] font-medium placeholder:text-gray-600 group-hover/input:border-white/20 shadow-inner"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                         <Button 
                                            type="submit" 
                                            disabled={cooldown > 0 || !connected || !newMessage.trim()} 
                                            className="w-12 h-12 !rounded-full !p-0 bg-white text-black hover:scale-105 transition-all shadow-2xl disabled:opacity-30 disabled:grayscale disabled:scale-100 flex items-center justify-center"
                                        >
                                            <Send size={18} className="translate-x-[1px]" />
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* 4. SUSPENSEFUL TIMER SECTION */}
                <div className="max-w-4xl mx-auto w-full mb-32 relative">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center gap-12"
                    >
                        <div className="text-center space-y-4">
                            <motion.div 
                                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-neon-pink/10 border border-neon-pink/20 text-neon-pink text-[10px] font-black uppercase tracking-[0.4em]"
                            >
                                <Sparkles size={14} className="animate-spin-slow" />
                                Something big is coming
                            </motion.div>
                            <h2 className="text-4xl md:text-6xl font-black font-fredoka text-white text-shadow-glow leading-tight">Something huge will <br/>reveal <span className="text-neon-cyan italic">soon...</span></h2>
                        </div>

                        <div className="flex gap-4 md:gap-8 bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-3xl shadow-2xl relative">
                            <TimerBox value={timeLeft.days} label="Days" />
                            <TimerBox value={timeLeft.hours} label="Hours" />
                            <TimerBox value={timeLeft.minutes} label="Mins" />
                            <TimerBox value={timeLeft.seconds} label="Secs" />
                            
                            {/* Decorative Glow */}
                            <div className="absolute inset-0 bg-neon-pink/5 blur-[50px] rounded-[3rem] -z-10" />
                        </div>
                        
                        <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse">The reveal sequence has initiated</p>
                    </motion.div>
                </div>

                {/* 5. FEEDBACK & REVIEW SECTION */}
                <div className="max-w-3xl mx-auto w-full mb-20 text-center space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h3 className="text-2xl md:text-3xl font-black font-fredoka text-white">We vibe with your <span className="text-neon-purple italic">feedback</span></h3>
                        <p className="text-gray-400 text-sm max-w-lg mx-auto font-medium leading-relaxed">
                            GenWin is built for you. If you've found a bug, have a wild suggestion, or just want to tell us how much you're loving the hangout—drop it below!
                        </p>
                    </motion.div>

                    <FeedbackForm />
                </div>

            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
                .animate-spin-slow {
                    animation: spin 8s linear infinite;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </PageWrapper>
    );
};

export default HangoutZone;

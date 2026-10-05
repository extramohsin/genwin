import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import PageWrapper from "../components/ui/PageWrapper";
import FeedbackForm from "../components/FeedbackForm";
import API_URL from "../config";

const ANIMALS = ["Fox", "Panda", "Owl", "Tiger", "Koala", "Penguin", "Lion", "Wolf", "Bear", "Cat"];
const ADJECTIVES = ["Neon", "Cyber", "Mystic", "Cosmic", "Happy", "Lucky", "Wild", "Chill"];

const RED_FLAGS = [
    { text: "Claps when the plane lands 👏", severity: 3 },
    { text: "Referring to themselves as an 'Alpha' 🐺", severity: 10 },
    { text: "Texting back 'k' after your heart out 🥶", severity: 8 },
    { text: "Still friends with all 5 exes 🚩", severity: 7 },
    { text: "Doesn't like music (like, at all) 🎵", severity: 9 },
    { text: "Rude to waiters 🍽️", severity: 10 },
    { text: "Thinks the earth is flat 🌍", severity: 10 },
    { text: "Pineapple on pizza hater 🍕", severity: 1 }
];

const ROASTS = [
    "You have the romantic aura of a wet slice of bread. 🍞",
    "Your love life is like a 404 error: Not found. 🔍",
    "If 'left on read' was a person, it would be you. 📱",
    "You attract red flags like a bull in a matador convention. 🚩",
    "Your rizz is in debt. You owe the universe charm. 📉",
    "Even your imaginary situationships are breaking up with you. 💔",
    "Bro, your DMs are drier than the Sahara. 🏜️",
    "You’re playing hard to get, but nobody’s trying to get you. 😐"
];

// --- UTILS ---
const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) setMatches(media.matches);
        const listener = () => setMatches(media.matches);
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, [matches, query]);
    return matches;
};

// --- SUB-COMPONENTS ---

const MaterialIcon = ({ icon, className = "", style = {} }) => (
    <span className={`material-symbols-outlined ${className}`} style={style}>{icon}</span>
);

const DonutChart = ({ data }) => {
    const size = 200;
    const radius = 80;
    const circumference = radius * 2 * Math.PI;
    const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
    let currentOffset = 0;

    return (
        <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
                <circle className="text-black/20" cx="96" cy="96" fill="transparent" r={radius} stroke="currentColor" strokeWidth="12" />
                {data.map((d, i) => {
                    const strokeLength = (d.value / total) * circumference;
                    const strokeDashoffset = -currentOffset;
                    currentOffset += strokeLength;
                    return (
                        <circle
                            key={d.label}
                            cx="96"
                            cy="96"
                            r={radius}
                            fill="transparent"
                            stroke={d.color}
                            strokeWidth="12"
                            style={{
                                strokeDasharray: `${strokeLength} ${circumference - strokeLength}`,
                                strokeDashoffset: strokeDashoffset,
                                transition: 'stroke-dasharray 1s ease-out, stroke-dashoffset 1s ease-out',
                                filter: i === 0 ? `drop-shadow(0 0 10px ${d.color}66)` : 'none'
                            }}
                        />
                    );
                })}
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-3xl">🔥</span>
                <span className="text-sm font-bold text-white uppercase tracking-tighter">Radiant</span>
            </div>
        </div>
    );
};

// --- RED FLAG SWIPER COMPONENT ---

const RedFlagCard = ({ flag, onSwipe }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-150, 150], [-10, 10]);
    const bg = useTransform(x, [-150, 0, 150], ["rgba(239, 68, 68, 0.2)", "rgba(255,255,255,0.05)", "rgba(34, 211, 238, 0.2)"]);

    const handleDragEnd = (_, info) => {
        if (info.offset.x > 100) onSwipe("accept");
        else if (info.offset.x < -100) onSwipe("reject");
    };

    return (
        <motion.div
            style={{ x, rotate, backgroundColor: bg }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="absolute inset-0 w-full h-full rounded-[2rem] border border-white/10 flex flex-col items-center justify-center p-8 text-center backdrop-blur-3xl cursor-grab active:cursor-grabbing shadow-2xl"
        >
            <MaterialIcon icon="flag" className="text-4xl text-primary mb-6" />
            <h3 className="text-2xl font-black text-white leading-tight font-headline">{flag.text}</h3>
            <div className="mt-8 flex gap-8">
                 <div className="flex flex-col items-center text-[8px] uppercase font-black text-slate-500 tracking-widest"><MaterialIcon icon="chevron_left" className="text-error" /> Reject</div>
                 <div className="flex flex-col items-center text-[8px] uppercase font-black text-slate-500 tracking-widest"><MaterialIcon icon="chevron_right" className="text-tertiary" /> Accept</div>
            </div>
        </motion.div>
    );
};

const RedFlagSwiper = () => {
    const [index, setIndex] = useState(0);
    const [standards, setStandards] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const handleSwipe = (direction) => {
        const currentFlag = RED_FLAGS[index];
        if (direction === "accept") setStandards(prev => prev - currentFlag.severity);
        else setStandards(prev => prev + 2);

        if (index >= RED_FLAGS.length - 1) setGameOver(true);
        else setIndex(prev => prev + 1);
    };

    const getVerdict = () => {
        if (standards < -10) return { title: "DOWN BAD 📉", desc: "You accept anything. Have some self-respect bestie." };
        if (standards < 10) return { title: "CHILL VIBES 🤙", desc: "You are balanced. Not too picky, not too desperate." };
        return { title: "HIGH STANDARDS 👑", desc: "You know your worth. Maybe a bit too picky?" };
    };

    return (
        <div className="w-full h-[450px] bg-surface-container-high rounded-[2.5rem] p-8 border border-white/5 flex flex-col relative overflow-hidden group shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline text-lg text-white">red flag check</h3>
                <span className="text-[10px] font-black text-slate-500">{index + 1}/{RED_FLAGS.length}</span>
            </div>
            <div className="flex-1 relative">
                <AnimatePresence>
                    {!gameOver && <RedFlagCard key={index} flag={RED_FLAGS[index]} onSwipe={handleSwipe} />}
                </AnimatePresence>
                {gameOver && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-black uppercase text-primary tracking-widest mb-2">Verdict</span>
                        <h2 className="text-3xl font-black text-white mb-2">{getVerdict().title}</h2>
                        <p className="text-xs text-slate-400 max-w-[200px] mb-8">{getVerdict().desc}</p>
                        <Button onClick={() => {setIndex(0); setGameOver(false); setStandards(0)}} size="sm" className="rounded-full">Try Again</Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};


// --- MAIN PAGE ---

const HangoutZone = () => {
    const isMobile = useMediaQuery("(max-width: 1024px)");
    const [activeZone, setActiveZone] = useState("hangout"); 
    
    // Sockets & Chat State
    const [onlineCount, setOnlineCount] = useState(0);
    const [whoIsHere, setWhoIsHere] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const [anonName, setAnonName] = useState("");
    const [connected, setConnected] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [replyTo, setReplyTo] = useState(null);
    
    // Roast State
    const [roast, setRoast] = useState(null);
    const [roastLoading, setRoastLoading] = useState(false);

    const messagesEndRef = useRef(null);

    // Initial Setup
    useEffect(() => {
        let stored = sessionStorage.getItem("anonName");
        if (!stored) {
            stored = `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} ${ANIMALS[Math.floor(Math.random() * ANIMALS.length)]} #${Math.floor(Math.random()*1000)}`;
            sessionStorage.setItem("anonName", stored);
        }
        setAnonName(stored);

        const token = localStorage.getItem("token");
        if (!token) return;

        const baseUrl = API_URL.replace(/\/api$/, '');
        const s = io(baseUrl, { auth: { token }, transports: ["websocket"] });

        s.on("connect", () => {
            setConnected(true);
            s.emit("join_room", stored);
        });
        s.on("online_count", (c) => setOnlineCount(c));
        s.on("sync_active_users", (users) => setWhoIsHere(users));
        s.on("receive_message", (m) => setMessages(prev => [...prev, m]));

        setSocket(s);

        fetch(`${API_URL}/api/chat/history`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => setMessages(data))
            .catch(e => console.error(e));

        return () => s.disconnect();
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (cooldown > 0) {
            const t = setInterval(() => setCooldown(c => c - 1), 1000);
            return () => clearInterval(t);
        }
    }, [cooldown]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || cooldown > 0) return;
        
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
            anonName,
            replyTo: replyTo?._id,
            quoteAnonName: replyTo?.anonName,
            quoteText: replyTo?.message,
            isWhisper,
            mentionedName
        });

        setNewMessage("");
        setReplyTo(null);
        setCooldown(5);
    };

    const handleRoast = () => {
        setRoastLoading(true);
        setRoast(null);
        setTimeout(() => {
            setRoast(ROASTS[Math.floor(Math.random() * ROASTS.length)]);
            setRoastLoading(false);
        }, 1500);
    };

    // --- SHARED FOOTER ---
    const SharedFooter = () => (
        <div className="w-full space-y-32 py-20">
             <div className="text-center space-y-12">
                 <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.4em]">
                     <MaterialIcon icon="auto_awesome" className="text-[14px]" /> Something big is coming
                 </div>
                 <h2 className="font-headline text-4xl md:text-6xl text-white">The Big Reveal.<br/><span className="text-tertiary italic underline decoration-tertiary/30">3 Days Remaining.</span></h2>
                 <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
                     {[{v: "03", l: "Days"}, {v: "21", l: "Hours"}, {v: "45", l: "Mins"}, {v: "12", l: "Secs"}].map(t => (
                         <div key={t.l} className="p-6 bg-surface-container rounded-3xl border border-white/10 backdrop-blur-xl flex flex-col items-center">
                             <span className="text-3xl font-black text-white">{t.v}</span>
                             <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{t.l}</span>
                         </div>
                     ))}
                 </div>
             </div>
             <div className="max-w-2xl mx-auto text-center space-y-8">
                 <h3 className="font-headline text-2xl text-white">Report a bug or <span className="text-secondary">vibe share</span></h3>
                 <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-1 rounded-[2.5rem] shadow-2xl">
                     <FeedbackForm />
                 </div>
             </div>
        </div>
    );

    return (
        <PageWrapper className="relative bg-surface selection:bg-primary/30 min-h-screen text-on-surface font-body overflow-x-hidden">
            {/* Ambient Blobs */}
            <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary-container/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-primary-container/10 rounded-full blur-[100px]"></div>
                <div className="absolute top-[20%] right-[15%] w-[25%] h-[25%] bg-tertiary-container/10 rounded-full blur-[80px]"></div>
            </div>

            {/* TOP HUD */}
            <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-surface-container/70 backdrop-blur-xl rounded-b-3xl border-t-[1px] border-white/10 shadow-[0_40px_40px_-15px_rgba(156,72,234,0.1)]">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-highest border border-white/10">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6Yr6BZinFWgAplqhGNGegvGWbAw91UALUhoKYzDdBl72hTsOiQUAdx4YDxfVaCcqg60WjDtKuarbmo_ShP5Uqw12EyNSII6GN1BnIZa9WB-ASr_XKCSJjzjxF-q5Jc7olKnfjwfuMaLqrX_ocdn-BHIiB6E-fXqv2QvD5-Kr9ZCCYB56foc2RSmT4eyGSzbuQbJhjpLI-ezgUJTEHDoTYkbvIXk6Os27VwE-yFyyUJLu1k1V5dx_LA9CIuEHD4-tq-Bkte5dnFj0" className="w-full h-full object-cover" alt="avatar" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-fredoka lowercase tracking-tight text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">genwin.zone</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-tertiary">@{anonName.split(' ')[0].toLowerCase()}</span>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-8 bg-black/20 px-6 py-2 rounded-full backdrop-blur-md border border-white/5">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest">Match Day</span>
                        <span className="text-sm font-mono font-bold text-primary">02:14:55</span>
                    </div>
                    <div className="h-6 w-[1px] bg-white/10"></div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_#7de9ff] animate-pulse"></div>
                        <span className="text-xs font-medium text-slate-300 tracking-wide">{onlineCount} Lurkers</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all"><MaterialIcon icon="search" className="text-slate-400" /></button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all"><MaterialIcon icon="settings" className="text-primary" /></button>
                </div>
            </header>

            {/* SIDEBAR NAVIGATION (DESKTOP) */}
            {!isMobile && (
                <aside className="fixed left-0 top-1/2 -translate-y-1/2 h-auto flex flex-col gap-6 p-4 z-40 bg-surface/40 backdrop-blur-xl rounded-r-3xl border border-white/5">
                    {[
                        { id: 'hangout', icon: 'grid_view', label: 'Dashboard' },
                        { id: 'takes', icon: 'bolt', label: 'Takes' },
                        { id: 'vibes', icon: 'waves', label: 'Vibes' },
                        { id: 'chat', icon: 'forum', label: 'Chat' }
                    ].map(item => (
                        <button 
                            key={item.id}
                            onClick={() => setActiveZone(item.id)}
                            className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all relative group ${activeZone === item.id ? 'bg-primary/20 text-primary border border-primary/20 shadow-[0_0_15px_rgba(255,135,186,0.3)]' : 'text-slate-500 hover:bg-white/5'}`}
                        >
                            <MaterialIcon icon={item.icon} />
                            <div className="absolute left-full ml-4 px-3 py-1 bg-surface-container rounded-lg text-[10px] uppercase font-bold text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-all border border-white/10">{item.label}</div>
                        </button>
                    ))}
                </aside>
            )}

            {/* MAIN CONTENT AREA */}
            <main className="pt-28 pb-32 px-4 md:px-8 max-w-7xl mx-auto overflow-y-auto no-scrollbar">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeZone}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        className="space-y-12"
                    >
                        {/* HANGOUT / DASHBOARD VIEW */}
                        {activeZone === 'hangout' && (
                            <div className="space-y-12">
                                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                    <div className="lg:col-span-12 bg-surface-container rounded-[2.5rem] p-12 text-center relative overflow-hidden border border-white/5 shadow-2xl">
                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary to-secondary opacity-30"></div>
                                        <h2 className="font-fredoka text-5xl font-black text-white mb-6 lowercase">welcome to the <span className="text-secondary">booth</span></h2>
                                        <p className="max-w-xl mx-auto text-slate-400 leading-relaxed font-body mb-12">Connect with millions of lurkers, drop your hottest takes, and vibes in real-time. This is the heart of the GenWin multiverse.</p>
                                        
                                        {/* Discovery Portals */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                                            <button onClick={() => setActiveZone('takes')} className="group p-8 rounded-[2rem] bg-surface-container-high border border-white/5 hover:border-primary/50 transition-all text-left flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-primary font-black uppercase text-[10px] tracking-widest mb-1">Ignite</span>
                                                    <span className="text-xl font-bold text-white font-headline">The Takes</span>
                                                </div>
                                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><MaterialIcon icon="bolt" /></div>
                                            </button>
                                            <button onClick={() => setActiveZone('vibes')} className="group p-8 rounded-[2rem] bg-surface-container-high border border-white/5 hover:border-tertiary/50 transition-all text-left flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-tertiary font-black uppercase text-[10px] tracking-widest mb-1">Discover</span>
                                                    <span className="text-xl font-bold text-white font-headline">The Vibes</span>
                                                </div>
                                                <div className="w-12 h-12 bg-tertiary/10 rounded-full flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform"><MaterialIcon icon="waves" /></div>
                                            </button>
                                        </div>
                                    </div>
                                </section>
                                <SharedFooter />
                            </div>
                        )}

                        {/* TAKES VIEW */}
                        {activeZone === 'takes' && (
                             <div className="space-y-12">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Hot Take */}
                                    <div className="bg-surface-container rounded-[2.5rem] p-12 relative overflow-hidden group border border-white/5">
                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary to-secondary opacity-30"></div>
                                        <div className="flex items-center gap-2 mb-8"><MaterialIcon icon="local_fire_department" className="text-primary" /><span className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em]">Hottest Debate</span></div>
                                        <h3 className="font-headline text-3xl font-semibold mb-12 lowercase text-left leading-tight">is 'pineapple on pizza' still a crime?</h3>
                                        <div className="space-y-12">
                                            <div className="space-y-4">
                                                <div className="flex justify-between text-[10px] uppercase tracking-widest text-slate-400"><span>Absolute Prison</span><span className="text-primary">68%</span></div>
                                                <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                                                    <div className="h-full bg-gradient-to-r from-primary to-[#ff67ad] w-[68%] rounded-full shadow-[0_0_20px_rgba(255,135,186,0.2)]"></div>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex justify-between text-[10px] uppercase tracking-widest text-slate-400"><span>It's a Vibe</span><span className="text-tertiary">32%</span></div>
                                                <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                                                    <div className="h-full bg-gradient-to-r from-tertiary to-[#1ad0eb] w-[32%] rounded-full shadow-[0_0_20px_rgba(125,233,255,0.2)]"></div>
                                                </div>
                                            </div>
                                            <div className="mt-12 flex gap-4">
                                                <button className="flex-1 py-4 bg-primary text-black font-black uppercase tracking-widest rounded-3xl hover:translate-y-[-2px] transition-all active:translate-y-[0]">Pure Fire</button>
                                                <button className="flex-1 py-4 bg-surface-container-highest text-white font-black uppercase tracking-widest rounded-3xl border border-white/10 hover:bg-white/10 transition-all">Nah Fam</button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Red Flag Swiper */}
                                    <RedFlagSwiper />
                                </div>
                                <SharedFooter />
                             </div>
                        )}

                        {/* VIBES VIEW */}
                        {activeZone === 'vibes' && (
                            <div className="space-y-12">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                    {/* WYR Cards (Bento Large) */}
                                    <div className="lg:col-span-8 bg-surface-container rounded-[2.5rem] p-12 border border-white/5 flex flex-col items-center shadow-2xl overflow-hidden relative">
                                         <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-tertiary to-secondary opacity-30"></div>
                                         <h3 className="font-headline text-lg uppercase tracking-widest text-slate-500 mb-12">Universal Dilemma</h3>
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full h-full">
                                            <button className="p-8 rounded-[2rem] bg-surface-container-high border-t-2 border-primary/20 flex flex-col items-center text-center gap-6 hover:translate-y-[-4px] transition-all shadow-xl group">
                                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><MaterialIcon icon="rocket_launch" className="text-3xl" /></div>
                                                <p className="text-white font-medium text-lg leading-relaxed">unlimited travel but you can never stay anywhere for more than 48 hours</p>
                                            </button>
                                            <button className="p-8 rounded-[2rem] bg-surface-container-high border-t-2 border-tertiary/20 flex flex-col items-center text-center gap-6 hover:translate-y-[-4px] transition-all shadow-xl group">
                                                <div className="w-16 h-16 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform"><MaterialIcon icon="cottage" className="text-3xl" /></div>
                                                <p className="text-white font-medium text-lg leading-relaxed">live in your dream home forever but you can never leave your city</p>
                                            </button>
                                         </div>
                                    </div>
                                    
                                    {/* Vibe Check Sidebar */}
                                    <div className="lg:col-span-4 bg-surface-container rounded-xl p-8 flex flex-col items-center gap-8 relative overflow-hidden border border-white/5 shadow-2xl">
                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-tertiary to-secondary opacity-30"></div>
                                        <h4 className="font-headline text-lg lowercase text-slate-300 w-full text-center tracking-tight">community vibe check</h4>
                                        <DonutChart data={[{label: 'Radiant', value: 75, color: '#c180ff'}, {label: 'Chill', value: 25, color: '#7de9ff'}]} />
                                        <div className="grid grid-cols-4 gap-3 w-full">
                                            {['😎', '🫠', '💀', '✨'].map(e => (
                                                <button key={e} className="aspect-square bg-white/5 rounded-xl flex items-center justify-center text-2xl hover:bg-white/10 transition-colors border border-white/5">{e}</button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Rizz Roaster (Full Width) */}
                                    <div className="lg:col-span-12 bg-gradient-to-br from-error/10 to-transparent border border-error/20 rounded-[2.5rem] p-12 text-center group relative overflow-hidden">
                                        <div className="absolute top-4 left-4"><MaterialIcon icon="local_fire_department" className="text-error animate-pulse" /></div>
                                        <h2 className="text-3xl font-black text-white font-headline mb-8">Rizz <span className="text-error">Roaster</span></h2>
                                        <div className="min-h-[120px] mb-8 flex items-center justify-center">
                                            <AnimatePresence mode="wait">
                                                {roastLoading ? (
                                                    <motion.span key="L" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-error font-mono text-sm tracking-[0.5em]">[SCANNING AURA...]</motion.span>
                                                ) : roast ? (
                                                    <motion.p key="R" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-2xl font-bold text-white italic">"{roast}"</motion.p>
                                                ) : (
                                                    <p className="text-slate-500 font-medium">Think you have game? Let the AI judge your rizz.</p>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <button onClick={handleRoast} disabled={roastLoading} className="px-12 py-4 bg-error text-black font-black uppercase tracking-[0.2em] rounded-full hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,110,132,0.3)] disabled:opacity-50">
                                            {roastLoading ? "Calculating..." : "Destroy Me 💀"}
                                        </button>
                                    </div>
                                </div>
                                <SharedFooter />
                            </div>
                        )}

                        {/* CHAT VIEW */}
                        {activeZone === 'chat' && (
                            <div className="space-y-12">
                                <section className="max-w-4xl mx-auto w-full h-[700px] bg-surface-container/80 backdrop-blur-3xl rounded-[2.5rem] flex flex-col border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden">
                                     {/* Mac Header Style */}
                                    <div className="px-8 py-6 flex justify-between items-center bg-white/[0.03] border-b border-white/5">
                                        <div className="flex gap-2">
                                            <div className="w-3.5 h-3.5 rounded-full bg-error/40 shadow-inner"></div>
                                            <div className="w-3.5 h-3.5 rounded-full bg-primary/40 shadow-inner"></div>
                                            <div className="w-3.5 h-3.5 rounded-full bg-tertiary/40 shadow-inner"></div>
                                        </div>
                                        <div className="text-[10px] uppercase font-headline tracking-[0.3em] text-slate-500 font-black">Whisper-Protocol Active</div>
                                        <div className="w-12"></div>
                                    </div>

                                    {/* Chat Content */}
                                    <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-black/5">
                                        {messages.map((m, i) => {
                                            const isMe = m.anonName === anonName;
                                            const isWhisper = m.isWhisper;
                                            if (isWhisper && !isMe && m.mentionedName !== anonName) return null;

                                            return (
                                                <div key={m._id || i} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                                    <div className="w-10 h-10 rounded-full bg-surface-container-highest flex-shrink-0 border border-white/10 overflow-hidden">
                                                        <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-[10px] text-slate-500 font-black uppercase">{m.anonName[0]}</div>
                                                    </div>
                                                    <div className={`space-y-1.5 max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                                                        <div className={`${isWhisper ? 'bg-gradient-to-br from-primary to-secondary p-[1px] rounded-2xl shadow-lg' : (isMe ? 'bg-primary/20 border border-primary/30 rounded-2xl rounded-tr-none' : 'bg-surface-container-high border border-white/5 rounded-2xl rounded-tl-none')} px-5 py-3 text-sm`}>
                                                            {isWhisper && (
                                                                <div className="bg-surface/90 backdrop-blur-md rounded-[inherit] px-4 py-2 flex items-center gap-3">
                                                                    <span className="text-white">{m.message}</span>
                                                                    <MaterialIcon icon="lock" className="text-primary text-lg" />
                                                                </div>
                                                            )}
                                                            {!isWhisper && <span className="text-slate-200">{m.message}</span>}
                                                        </div>
                                                        <span className={`text-[9px] text-slate-500 uppercase tracking-widest ${isMe ? 'mr-2' : 'ml-2'}`}>{m.anonName} • 14:22</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input Area */}
                                    <div className="p-8 bg-surface-container-low border-t border-white/5">
                                        <form onSubmit={handleSend} className="relative bg-surface-container-lowest/50 rounded-full border border-white/10 focus-within:border-tertiary/40 transition-all flex items-center px-6 py-2 shadow-inner">
                                            <button type="button" className="p-2 text-slate-500 hover:text-tertiary transition-colors"><MaterialIcon icon="add_circle" /></button>
                                            <input 
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-300 placeholder:text-slate-600 px-4" 
                                                placeholder="Send a message or whisper @user..." 
                                                type="text"
                                            />
                                            <div className="flex items-center gap-2">
                                                <button type="button" className="p-2 text-slate-500 hover:text-primary transition-colors"><MaterialIcon icon="alternate_email" /></button>
                                                <button type="button" className="p-2 text-slate-500 hover:text-secondary transition-colors"><MaterialIcon icon="mood" /></button>
                                                <button type="submit" className="ml-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black active:scale-95 transition-all shadow-lg hover:shadow-primary/20">
                                                    <MaterialIcon icon="send" className="text-sm font-bold" />
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </section>
                                <SharedFooter />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* MOBILE NAVIGATION BAR */}
            {isMobile && (
                <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center pb-8 pt-4 px-4 bg-surface/80 backdrop-blur-2xl z-50 rounded-t-[3rem] shadow-[0_-10px_30px_rgba(0,0,0,0.5)] border-t border-white/5">
                    {[
                        { id: 'hangout', icon: 'grid_view', label: 'hangout' },
                        { id: 'takes', icon: 'bolt', label: 'takes' },
                        { id: 'vibes', icon: 'waves', label: 'vibes' },
                        { id: 'chat', icon: 'forum', label: 'chat' }
                    ].map(item => (
                        <button 
                            key={item.id}
                            onClick={() => setActiveZone(item.id)}
                            className={`flex flex-col items-center justify-center transition-all px-4 py-2 rounded-full ${activeZone === item.id ? 'bg-primary/20 text-primary shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'text-slate-500 opacity-60'}`}
                        >
                            <MaterialIcon icon={item.icon} />
                            <span className="font-body text-[10px] uppercase tracking-widest mt-1">{item.label}</span>
                        </button>
                    ))}
                </nav>
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
                
                .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(115, 117, 130, 0.2); border-radius: 10px; }
            `}</style>
        </PageWrapper>
    );
};

export default HangoutZone;

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Sparkles, Send, MessageSquare, Gamepad2, Waves, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";
import PageWrapper from "../components/ui/PageWrapper";
import FeedbackForm from "../components/FeedbackForm";
import NeonLoveTester from "../components/games/NeonLoveTester";
import RedFlagSwiper from "../components/games/RedFlagSwiper";
import DestinyWheel from "../components/games/DestinyWheel";
import VibePoll from "../components/games/VibePoll";
import DailyQuote from "../components/games/DailyQuote";
import RoastMyRizz from "../components/games/RoastMyRizz";
import API_URL from "../config";

const ANIMALS = ["Fox", "Panda", "Owl", "Tiger", "Koala", "Penguin", "Lion", "Wolf", "Bear", "Cat"];
const ADJECTIVES = ["Neon", "Cyber", "Mystic", "Cosmic", "Happy", "Lucky", "Wild", "Chill"];

const WYR_QUESTIONS = [
  {
    a: { icon: "🚀", label: "Unlimited travel", desc: "but never stay anywhere more than 48 hrs" },
    b: { icon: "🏠", label: "Dream home forever", desc: "but never leave your city" },
  },
  {
    a: { icon: "💌", label: "Know who has a crush on you", desc: "but can never act on it" },
    b: { icon: "🎯", label: "Confess freely", desc: "but never know if they felt the same" },
  },
  {
    a: { icon: "📵", label: "No phone for a week", desc: "but win ₹1 lakh" },
    b: { icon: "📱", label: "Keep your phone", desc: "but lose ₹1000 from your account" },
  },
];

const VIBE_EMOJIS = [
  { emoji: "✨", label: "Radiant" },
  { emoji: "😎", label: "Chill" },
  { emoji: "🫠", label: "Melting" },
  { emoji: "💀", label: "Dead" },
  { emoji: "🔥", label: "Fire" },
  { emoji: "🥺", label: "Soft" },
];

// ─── Animated Members Ticker ───────────────────────────────────────────────
const MembersTicker = ({ count, members }) => {
  const items = members.length > 0 ? members : ["Waiting for lurkers..."];
  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="w-full overflow-hidden bg-black/30 border-b border-white/5 py-2 px-4 flex items-center gap-4">
      <span className="flex-shrink-0 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neon-pink">
        <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80] animate-pulse" />
        {count} live
      </span>
      <div className="flex-1 overflow-hidden relative">
        <div className="flex gap-6 animate-marquee whitespace-nowrap">
          {doubled.map((name, i) => (
            <span key={i} className="text-[11px] text-slate-400 font-mono flex-shrink-0">
              <span className="text-neon-purple mr-1">@</span>{name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Timer Box ─────────────────────────────────────────────────────────────
const TimerBox = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-black/40 rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/10 shadow-lg mb-1 backdrop-blur-md">
      <span className="text-xl sm:text-2xl md:text-3xl font-black font-mono text-white">
        {String(value).padStart(2, "0")}
      </span>
    </div>
    <span className="text-[8px] sm:text-[9px] text-gray-500 uppercase tracking-widest">{label}</span>
  </div>
);

// ─── Shared Footer ──────────────────────────────────────────────────────────
const SharedFooter = () => (
  <div className="max-w-2xl mx-auto text-center space-y-6 py-12">
    <h3 className="text-gray-500 text-sm uppercase tracking-widest">Found a bug or have a vibe to share?</h3>
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-1 rounded-3xl shadow-2xl">
      <FeedbackForm />
    </div>
  </div>
);

// ─── Main Component ─────────────────────────────────────────────────────────
const WaitingRoom = () => {
  const [activeZone, setActiveZone] = useState("lobby");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [status, setStatus] = useState({ isLocked: true, remainingTime: 0, nextRevealAt: null });

  // Socket / Chat state
  const [onlineCount, setOnlineCount] = useState(0);
  const [whoIsHere, setWhoIsHere] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [anonName, setAnonName] = useState("");
  const [connected, setConnected] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [replyTo, setReplyTo] = useState(null);

  // Vibe state
  const [wyrIndex, setWyrIndex] = useState(0);
  const [wyrVotes, setWyrVotes] = useState({ a: 0, b: 0 });
  const [wyrVoted, setWyrVoted] = useState(false);
  const [vibeEmoji, setVibeEmoji] = useState(null);
  const [vibeCounts, setVibeCounts] = useState({ "✨": 42, "😎": 31, "🫠": 18, "💀": 27, "🔥": 55, "🥺": 14 });

  const messagesEndRef = useRef(null);
  const chatScrollRef = useRef(null); // ref to the scrollable messages container

  // ── Fetch match status ──
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`${API_URL}/api/match/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setStatus(await res.json());
      } catch (e) {
        console.error("Error fetching status:", e);
      }
    };
    fetchStatus();
  }, []);

  // ── Countdown timer ──
  useEffect(() => {
    if (!status.nextRevealAt) return;
    const target = new Date(status.nextRevealAt);
    const timer = setInterval(() => {
      const diff = target - new Date();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setStatus((prev) => ({ ...prev, isLocked: false }));
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [status.nextRevealAt]);

  // ── Socket setup ──
  useEffect(() => {
    let stored = sessionStorage.getItem("anonName");
    if (!stored) {
      stored = `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} ${ANIMALS[Math.floor(Math.random() * ANIMALS.length)]} #${Math.floor(Math.random() * 1000)}`;
      sessionStorage.setItem("anonName", stored);
    }
    setAnonName(stored);

    const token = localStorage.getItem("token");
    if (!token) return;

    const baseUrl = API_URL.replace(/\/api$/, "");
    const s = io(baseUrl, { auth: { token }, transports: ["websocket"] });

    s.on("connect", () => {
      setConnected(true);
      s.emit("join_room", stored);
    });
    s.on("online_count", (c) => setOnlineCount(c));
    s.on("sync_active_users", (users) => setWhoIsHere(users));
    s.on("receive_message", (m) => setMessages((prev) => [...prev, m]));

    setSocket(s);

    fetch(`${API_URL}/api/chat/history`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setMessages(data))
      .catch(console.error);

    return () => s.disconnect();
  }, []);

  // ── Scroll chat to bottom (scoped to chat container, NOT page) ──
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (cooldown > 0) {
      const t = setInterval(() => setCooldown((c) => c - 1), 1000);
      return () => clearInterval(t);
    }
  }, [cooldown]);

  // ── Send message ──
  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || cooldown > 0) return;

    let isWhisper = false;
    let mentionedName = null;
    whoIsHere.forEach((name) => {
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
      mentionedName,
    });

    setNewMessage("");
    setReplyTo(null);
    setCooldown(5);
  };

  // ── WYR vote ──
  const handleWyrVote = (side) => {
    if (wyrVoted) return;
    setWyrVoted(true);
    setWyrVotes((prev) => ({ ...prev, [side]: prev[side] + 1 }));
  };

  const handleVibeVote = (emoji) => {
    setVibeEmoji(emoji);
    setVibeCounts((prev) => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }));
  };

  const nextWyr = () => {
    setWyrIndex((i) => (i + 1) % WYR_QUESTIONS.length);
    setWyrVotes({ a: 0, b: 0 });
    setWyrVoted(false);
  };

  // ── Zone nav items ──
  const zones = [
    { id: "lobby", icon: <LayoutGrid size={20} />, label: "Lobby" },
    { id: "games", icon: <Gamepad2 size={20} />, label: "Games" },
    { id: "chat",  icon: <MessageSquare size={20} />, label: "Chat" },
    { id: "vibe",  icon: <Waves size={20} />, label: "Vibe" },
  ];

  const totalWyr = wyrVotes.a + wyrVotes.b || 1;

  return (
    <PageWrapper className="relative bg-dark-950 min-h-screen overflow-x-hidden selection:bg-neon-pink/20">
      {/* ── Ambient blobs ── */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-neon-purple/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-[5%] right-[-5%] w-[40%] h-[40%] bg-neon-pink/8 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] right-[20%] w-[25%] h-[25%] bg-blue-500/5 rounded-full blur-[80px]" />
      </div>

      {/* ── Fixed HUD Header ── */}
      <header className="fixed top-0 w-full z-50 bg-dark-950/90 backdrop-blur-xl border-b border-white/5 shadow-[0_10px_40px_-10px_rgba(139,92,246,0.15)]">
        <div className="flex justify-between items-center px-3 sm:px-4 md:px-6 py-2.5 sm:py-3">
          {/* Logo + anon name */}
          <div className="flex flex-col">
            <span className="font-fredoka text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-purple leading-none">
              genwin.zone
            </span>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em] text-gray-500">
              @{anonName.split(" ")[0]?.toLowerCase() || "..."}
            </span>
          </div>

          {/* Mobile: compact timer + online count */}
          <div className="flex md:hidden items-center gap-2">
            {status.isLocked ? (
              <span className="text-[11px] font-mono font-bold text-neon-pink bg-black/30 px-2.5 py-1 rounded-full border border-white/5">
                {String(timeLeft.days).padStart(2, "0")}d{" "}
                {String(timeLeft.hours).padStart(2, "0")}h{" "}
                {String(timeLeft.minutes).padStart(2, "0")}m
              </span>
            ) : (
              <Link to="/results">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-neon-pink/20 border border-neon-pink/40 text-[10px] text-neon-pink animate-pulse font-bold">
                  <Unlock size={10} /> Results
                </span>
              </Link>
            )}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-gray-400 font-bold">{onlineCount}</span>
            </div>
          </div>

          {/* Desktop: full countdown pill */}
          <div className="hidden md:flex items-center gap-6 bg-black/30 px-5 py-2 rounded-full border border-white/5">
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-gray-500 uppercase tracking-widest">Match Day</span>
              {status.isLocked ? (
                <span className="text-sm font-mono font-bold text-neon-pink">
                  {String(timeLeft.days).padStart(2, "0")}d{" "}
                  {String(timeLeft.hours).padStart(2, "0")}h{" "}
                  {String(timeLeft.minutes).padStart(2, "0")}m
                </span>
              ) : (
                <span className="text-sm font-mono font-bold text-green-400 animate-pulse">LIVE 🎉</span>
              )}
            </div>
            <div className="h-5 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80] animate-pulse" />
              <span className="text-xs text-gray-400">{onlineCount} online</span>
            </div>
          </div>

          {/* Desktop right: lock status */}
          <div className="hidden md:flex items-center gap-2">
            {status.isLocked ? (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                <Lock size={12} /> Locked
              </span>
            ) : (
              <Link to="/results">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neon-pink/20 border border-neon-pink/40 text-xs text-neon-pink animate-pulse">
                  <Unlock size={12} /> View Results
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* ── Live Members Ticker ── */}
        <MembersTicker count={onlineCount} members={whoIsHere} />
      </header>

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 h-auto flex-col gap-4 p-3 z-40 bg-dark-950/60 backdrop-blur-xl rounded-r-3xl border border-white/5 border-l-0">
        {zones.map((z) => (
          <button
            key={z.id}
            onClick={() => setActiveZone(z.id)}
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all relative group ${
              activeZone === z.id
                ? "bg-neon-pink/20 text-neon-pink border border-neon-pink/30 shadow-[0_0_12px_rgba(236,72,153,0.3)]"
                : "text-gray-500 hover:bg-white/5 hover:text-gray-300"
            }`}
          >
            {z.icon}
            <span className="absolute left-full ml-3 px-2.5 py-1 bg-dark-800 rounded-lg text-[10px] uppercase font-bold text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-all border border-white/10 whitespace-nowrap">
              {z.label}
            </span>
          </button>
        ))}
      </aside>

      {/* ── Main Content ── */}
      {/* pt: accounts for fixed header (~88px mobile, ~96px desktop) + ticker + safe gap */}
      <main className="pt-[100px] sm:pt-[108px] md:pt-28 pb-32 md:pb-20 px-3 sm:px-4 md:px-8 md:pl-20 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeZone}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >

            {/* ══════════════ LOBBY ZONE ══════════════ */}
            {activeZone === "lobby" && (
              <div className="space-y-5 sm:space-y-8">
                {/* Hero countdown card */}
                <div className="relative overflow-hidden bg-white/[0.03] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 text-center shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 via-transparent to-neon-pink/10 pointer-events-none" />
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-pink/50 to-transparent" />

                  <div className="relative z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-purple/10 text-neon-purple text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] border border-neon-purple/20 mb-4 sm:mb-6">
                      <Sparkles size={9} /> Waiting Lobby
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-black font-fredoka text-white mb-3 sm:mb-4">
                      Match Day{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-purple">
                        Countdown
                      </span>
                    </h1>
                    <p className="text-gray-400 max-w-md mx-auto mb-6 sm:mb-10 text-xs sm:text-sm md:text-base">
                      The big reveal is coming. Kill time, chat anonymously, play games and survive the wait together.
                    </p>

                    {status.isLocked ? (
                      <div className="flex justify-center gap-2 sm:gap-4 md:gap-6">
                        <TimerBox value={timeLeft.days} label="Days" />
                        <TimerBox value={timeLeft.hours} label="Hours" />
                        <TimerBox value={timeLeft.minutes} label="Mins" />
                        <TimerBox value={timeLeft.seconds} label="Secs" />
                      </div>
                    ) : (
                      <Link to="/results">
                        <button className="px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-neon-pink to-neon-purple text-white font-black rounded-full text-base sm:text-lg shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:scale-105 active:scale-95 transition-all animate-pulse flex items-center gap-2 sm:gap-3 mx-auto">
                          <Unlock size={18} /> View Your Matches Now
                        </button>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Portal cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
                  {/* Chat portal */}
                  <button
                    onClick={() => setActiveZone("chat")}
                    className="group relative overflow-hidden bg-white/[0.03] border border-white/10 hover:border-neon-pink/40 rounded-2xl p-4 sm:p-6 text-left transition-all hover:shadow-[0_0_30px_rgba(236,72,153,0.1)] active:scale-[0.97]"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-neon-pink/8 rounded-full blur-3xl group-hover:bg-neon-pink/15 transition-all" />
                    <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 bg-neon-pink/15 rounded-xl flex items-center justify-center text-neon-pink sm:mb-4 flex-shrink-0">
                        <MessageSquare size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">Live Room</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-white font-fredoka">Anonymous Chat</h3>
                        <p className="text-gray-500 text-[11px] sm:text-xs mt-0.5 sm:mt-1 hidden sm:block">Talk to everyone without revealing who you are</p>
                      </div>
                    </div>
                  </button>

                  {/* Games portal */}
                  <button
                    onClick={() => setActiveZone("games")}
                    className="group relative overflow-hidden bg-white/[0.03] border border-white/10 hover:border-neon-purple/40 rounded-2xl p-4 sm:p-6 text-left transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] active:scale-[0.97]"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-neon-purple/8 rounded-full blur-3xl group-hover:bg-neon-purple/15 transition-all" />
                    <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 bg-neon-purple/15 rounded-xl flex items-center justify-center text-neon-purple sm:mb-4 flex-shrink-0">
                        <Gamepad2 size={20} />
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-neon-purple uppercase tracking-widest">6 Games</span>
                        <h3 className="text-base sm:text-lg font-bold text-white font-fredoka">Mini Games</h3>
                        <p className="text-gray-500 text-[11px] sm:text-xs mt-0.5 sm:mt-1 hidden sm:block">Love tester, red flags, destiny wheel and more</p>
                      </div>
                    </div>
                  </button>

                  {/* Vibe portal */}
                  <button
                    onClick={() => setActiveZone("vibe")}
                    className="group relative overflow-hidden bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 rounded-2xl p-4 sm:p-6 text-left transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] active:scale-[0.97]"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-cyan-500/8 rounded-full blur-3xl group-hover:bg-cyan-500/12 transition-all" />
                    <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 bg-cyan-500/15 rounded-xl flex items-center justify-center text-cyan-400 sm:mb-4 flex-shrink-0">
                        <Waves size={20} />
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Community</span>
                        <h3 className="text-base sm:text-lg font-bold text-white font-fredoka">Vibe Zone</h3>
                        <p className="text-gray-500 text-[11px] sm:text-xs mt-0.5 sm:mt-1 hidden sm:block">WYR polls, vibe check and daily quotes</p>
                      </div>
                    </div>
                  </button>
                </div>

                <SharedFooter />
              </div>
            )}

            {/* ══════════════ GAMES ZONE ══════════════ */}
            {activeZone === "games" && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <Gamepad2 className="text-neon-purple" size={18} />
                  <h2 className="text-lg sm:text-xl font-bold font-fredoka text-white">Mini Games</h2>
                  <span className="px-2 py-0.5 rounded-full bg-neon-purple/10 text-neon-purple text-[9px] sm:text-[10px] font-bold border border-neon-purple/20">6 GAMES</span>
                </div>

                {/* Bento grid — single col mobile, 2 col tablet, 3 col desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {/* Love Tester */}
                  <div className="sm:col-span-2 lg:col-span-1">
                    <NeonLoveTester />
                  </div>

                  {/* Destiny Wheel */}
                  <div>
                    <DestinyWheel />
                  </div>

                  {/* Red Flag Swiper */}
                  <div>
                    <RedFlagSwiper />
                  </div>

                  {/* Roast My Rizz */}
                  <div>
                    <RoastMyRizz />
                  </div>

                  {/* Vibe Poll */}
                  <div>
                    <VibePoll />
                  </div>

                  {/* Daily Quote */}
                  <div className="flex flex-col justify-center">
                    <DailyQuote />
                  </div>
                </div>

                <SharedFooter />
              </div>
            )}

            {/* ══════════════ CHAT ZONE ══════════════ */}
            {activeZone === "chat" && (
              <div className="space-y-3 sm:space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <MessageSquare className="text-neon-pink" size={18} />
                    <h2 className="text-base sm:text-xl font-bold font-fredoka text-white">Live Anonymous Chat</h2>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] sm:text-xs text-green-400 font-bold">{onlineCount} online</span>
                  </div>
                </div>

                {/* Active users pill strip */}
                {whoIsHere.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {whoIsHere.slice(0, 8).map((name, i) => (
                      <span key={i} className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-[11px] text-gray-400 font-mono">
                        @{name}
                      </span>
                    ))}
                    {whoIsHere.length > 8 && (
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-[11px] text-gray-500">
                        +{whoIsHere.length - 8} more
                      </span>
                    )}
                  </div>
                )}

                {/* Chat window — responsive height */}
                <div className="w-full bg-black/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl flex flex-col border border-white/10 shadow-2xl overflow-hidden" style={{ height: 'min(600px, calc(100svh - 260px))' }}>
                  {/* Mac-style header */}
                  <div className="px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center bg-white/[0.02] border-b border-white/5">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/40" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                      <div className="w-3 h-3 rounded-full bg-green-500/40" />
                    </div>
                    <span className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-600">
                      {connected ? "Whisper Protocol Active" : "Connecting..."}
                    </span>
                    <div className="w-12" />
                  </div>

                  {/* Reply preview */}
                  <AnimatePresence>
                    {replyTo && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 py-2 bg-neon-pink/5 border-b border-neon-pink/10 flex items-center justify-between"
                      >
                        <span className="text-xs text-gray-400">
                          Replying to <span className="text-neon-pink font-bold">@{replyTo.anonName}</span>:{" "}
                          <span className="italic">"{replyTo.message?.slice(0, 40)}..."</span>
                        </span>
                        <button onClick={() => setReplyTo(null)} className="text-gray-600 hover:text-white text-xs">✕</button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Messages */}
                  <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-5 custom-scrollbar">
                    {messages.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-3">
                        <MessageSquare size={40} className="opacity-20" />
                        <p className="text-sm">No messages yet. Say something! 👀</p>
                      </div>
                    )}
                    {messages.map((m, i) => {
                      const isMe = m.anonName === anonName;
                      const isWhisper = m.isWhisper;
                      if (isWhisper && !isMe && m.mentionedName !== anonName) return null;

                      return (
                        <div key={m._id || i} className={`flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-pink/20 to-neon-purple/20 flex-shrink-0 border border-white/10 flex items-center justify-center text-[11px] font-black text-gray-400 uppercase">
                            {m.anonName?.[0] || "?"}
                          </div>
                          <div className={`space-y-1 max-w-[72%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                            {m.quoteText && (
                              <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl rounded-bl-none text-[10px] text-gray-500 italic max-w-full">
                                ↩ @{m.quoteAnonName}: "{m.quoteText?.slice(0, 50)}..."
                              </div>
                            )}
                            <div
                              className={`px-4 py-2.5 text-sm rounded-2xl cursor-pointer ${
                                isWhisper
                                  ? "bg-gradient-to-br from-neon-pink/30 to-neon-purple/30 border border-neon-pink/30"
                                  : isMe
                                  ? "bg-neon-pink/20 border border-neon-pink/20 rounded-tr-none"
                                  : "bg-white/[0.04] border border-white/[0.08] rounded-tl-none"
                              }`}
                              onClick={() => !isMe && setReplyTo(m)}
                            >
                              {isWhisper && <span className="text-neon-pink text-[9px] font-black uppercase tracking-widest block mb-1">🔒 Whisper</span>}
                              <span className="text-gray-200">{m.message}</span>
                            </div>
                            <span className={`text-[9px] text-gray-600 uppercase tracking-widest ${isMe ? "mr-1" : "ml-1"}`}>
                              @{m.anonName}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-3 sm:p-4 border-t border-white/5 bg-black/20">
                    <form onSubmit={handleSend} className="flex items-center gap-2 sm:gap-3 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 focus-within:border-neon-pink/30 transition-all px-3 sm:px-4 py-2">
                      <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-300 placeholder:text-gray-600"
                        placeholder={cooldown > 0 ? `Cooldown ${cooldown}s...` : "Send a message or @whisper someone..."}
                        disabled={cooldown > 0}
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || cooldown > 0}
                        className="w-9 h-9 bg-neon-pink rounded-xl flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neon-pink/80 transition-all active:scale-95 flex-shrink-0"
                      >
                        <Send size={15} />
                      </button>
                    </form>
                  </div>
                </div>

                <SharedFooter />
              </div>
            )}

            {/* ══════════════ VIBE ZONE ══════════════ */}
            {activeZone === "vibe" && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <Waves className="text-cyan-400" size={18} />
                  <h2 className="text-lg sm:text-xl font-bold font-fredoka text-white">Vibe Zone</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* WYR Card */}
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-cyan-400">Would You Rather</span>
                      <span className="text-[9px] sm:text-[10px] text-gray-600">{wyrIndex + 1}/{WYR_QUESTIONS.length}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
                      {["a", "b"].map((side) => {
                        const q = WYR_QUESTIONS[wyrIndex][side];
                        const pct = wyrVoted ? Math.round((wyrVotes[side] / totalWyr) * 100) : null;
                        return (
                          <button
                            key={side}
                            onClick={() => handleWyrVote(side)}
                            disabled={wyrVoted}
                            className={`relative overflow-hidden p-3 sm:p-6 rounded-xl sm:rounded-2xl border flex flex-col items-center text-center gap-2 sm:gap-3 transition-all active:scale-95 ${
                              wyrVoted && wyrVotes[side] >= wyrVotes[side === "a" ? "b" : "a"]
                                ? "border-cyan-400/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                                : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20"
                            } disabled:cursor-not-allowed`}
                          >
                            {wyrVoted && pct !== null && (
                              <div
                                className="absolute inset-0 bg-cyan-500/10 transition-all duration-1000 rounded-2xl"
                                style={{ width: `${pct}%` }}
                              />
                            )}
                            <span className="text-2xl sm:text-3xl relative z-10">{q.icon}</span>
                            <span className="text-xs sm:text-sm font-bold text-white relative z-10 leading-tight">{q.label}</span>
                            <span className="text-[10px] sm:text-[11px] text-gray-500 relative z-10 leading-tight hidden sm:block">{q.desc}</span>
                            {wyrVoted && pct !== null && (
                              <span className="text-lg font-black text-cyan-400 relative z-10">{pct}%</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={nextWyr}
                      className="w-full py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-[10px] sm:text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest"
                    >
                      Next Question →
                    </button>
                  </div>

                  {/* Vibe Emoji Reactor */}
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-purple/40 to-transparent" />
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-neon-purple block mb-4 sm:mb-6">Community Vibe Check</span>

                    <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
                      {VIBE_EMOJIS.map(({ emoji, label }) => {
                        const count = vibeCounts[emoji] || 0;
                        const total = Object.values(vibeCounts).reduce((a, b) => a + b, 0) || 1;
                        const pct = Math.round((count / total) * 100);
                        const isSelected = vibeEmoji === emoji;
                        return (
                          <button
                            key={emoji}
                            onClick={() => handleVibeVote(emoji)}
                            className={`relative overflow-hidden p-3 sm:p-4 rounded-xl sm:rounded-2xl border flex flex-col items-center gap-1 transition-all active:scale-95 ${
                              isSelected
                                ? "border-neon-purple/50 bg-neon-purple/10 scale-105 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                                : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                            }`}
                          >
                            <span className="text-xl sm:text-2xl">{emoji}</span>
                            <span className="text-[8px] sm:text-[9px] text-gray-600 uppercase tracking-widest hidden sm:block">{label}</span>
                            <span className={`text-[10px] sm:text-xs font-black ${isSelected ? "text-neon-purple" : "text-gray-500"}`}>{pct}%</span>
                          </button>
                        );
                      })}
                    </div>

                    <p className="text-center text-[11px] text-gray-600">
                      {vibeEmoji ? `You voted ${vibeEmoji} — vibe locked in!` : "Tap to cast your vibe"}
                    </p>
                  </div>
                </div>

                {/* Daily Quote & Vibe Poll full width */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col justify-center">
                    <DailyQuote />
                  </div>
                  <div>
                    <VibePoll />
                  </div>
                </div>

                <SharedFooter />
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center pb-safe-bottom pb-6 pt-3 px-2 bg-dark-950/95 backdrop-blur-2xl z-50 rounded-t-2xl border-t border-white/5 shadow-[0_-10px_30px_rgba(0,0,0,0.6)]">
        {zones.map((z) => (
          <button
            key={z.id}
            onClick={() => setActiveZone(z.id)}
            className={`flex flex-col items-center gap-1 min-w-[64px] px-3 py-2 rounded-2xl transition-all active:scale-95 ${
              activeZone === z.id
                ? "bg-neon-pink/15 text-neon-pink shadow-[0_0_12px_rgba(236,72,153,0.2)]"
                : "text-gray-600"
            }`}
          >
            {z.icon}
            <span className="text-[9px] uppercase tracking-widest font-bold">{z.label}</span>
          </button>
        ))}
      </nav>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(115, 117, 130, 0.2); border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </PageWrapper>
  );
};

export default WaitingRoom;

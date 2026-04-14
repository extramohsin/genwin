import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Send, AlertTriangle, User, CornerDownLeft, MessageSquare, Users, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import PageWrapper from "../components/ui/PageWrapper";
import GlassCard from "../components/ui/GlassCard";
import toast from "react-hot-toast";
import API_URL from "../config";

const ANIMALS = ["Fox", "Panda", "Owl", "Tiger", "Koala", "Penguin", "Lion", "Wolf", "Bear", "Cat"];
const ADJECTIVES = ["Neon", "Cyber", "Mystic", "Cosmic", "Happy", "Lucky", "Wild", "Chill"];

const ChatPage = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const [anonName, setAnonName] = useState("");
    const [connected, setConnected] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [replyTo, setReplyTo] = useState(null);
    const [onlineCount, setOnlineCount] = useState(0);
    const [mentionSearch, setMentionSearch] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(false);
    const [whoIsHere, setWhoIsHere] = useState([]);
    
    const messagesEndRef = useRef(null);

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
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const baseUrl = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;

        const newSocket = io(baseUrl, {
            auth: { token },
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionAttempts: 5
        });

        newSocket.on("connect", () => {
            setConnected(true);
            const myName = sessionStorage.getItem("anonName");
            if (myName) newSocket.emit("join_room", myName);
            setOnlineCount(prev => prev + 1); 
        });

        newSocket.on("sync_active_users", (activeNames) => {
            setWhoIsHere(activeNames);
        });

        // We keep user_joined only for the optional toast/animations if we want, but whoIsHere is fully managed by sync_active_users now
        newSocket.on("user_joined", (data) => {
            // (toast logic could go here)
        });

        newSocket.on("disconnect", () => setConnected(false));

        newSocket.on("error", (err) => toast.error(err.message || "Chat Error"));

        newSocket.on("receive_message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        setSocket(newSocket);

        fetch(`${API_URL}/api/chat/history`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(err => console.error("History Error", err));

        return () => {
            if (newSocket) newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.parentNode.scrollTo({
                top: messagesEndRef.current.parentNode.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [messages]);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setInterval(() => setCooldown(c => c - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [cooldown]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || cooldown > 0) return;
        if (newMessage.length > 200) return toast.error("Message too long!");

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

    const handleReport = async (msgId) => {
        try {
            const token = localStorage.getItem("token");
            await fetch(`${API_URL}/api/chat/report/${msgId}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Reported.");
        } catch (e) {
            toast.error("Failed to report");
        }
    };

    return (
        <PageWrapper className="flex flex-col h-screen overflow-hidden relative">
            {/* Animated Neon Background Orbs */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-neon-pink/20 rounded-full blur-[120px] pointer-events-none animate-blob z-[-1]"></div>
            <div className="absolute top-40 right-20 w-80 h-80 bg-neon-purple/20 rounded-full blur-[100px] pointer-events-none animate-blob animation-delay-2000 z-[-1]"></div>
            <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-neon-blue/20 rounded-full blur-[100px] pointer-events-none animate-blob animation-delay-4000 z-[-1]"></div>

            <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col p-4 md:p-6 pb-0 z-10 min-h-0">
                
                {/* Header Area */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate("/waiting-room")}
                            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all shadow-glow-sm"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold font-fredoka text-white flex items-center gap-2">
                                <MessageSquare className="text-neon-pink" size={24} />
                                Genwin Live Room
                            </h1>
                            <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"} animate-pulse`} />
                                {connected ? "Connected anonymously" : "Reconnecting..."}
                            </p>
                        </div>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-4">
                        <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Your Identity</p>
                                <p className="text-sm font-bold text-neon-pink">{anonName}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-neon-pink/20 border border-neon-pink/30 flex items-center justify-center text-neon-pink shadow-glow-sm">
                                <User size={20} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
                    
                    {/* Main Chat Area */}
                    <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden border-white/5 shadow-2xl relative mb-4">
                        
                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
                            {messages.map((msg, idx) => {
                                const isMe = msg.anonName === anonName;
                                const showName = idx === 0 || messages[idx-1].anonName !== msg.anonName;

                                const isWhisper = msg.isWhisper;
                                const isReceiver = msg.mentionedName === anonName;
                                const canSeeWhisper = isMe || isReceiver || !isWhisper;

                                let formattedMsg;
                                if (!canSeeWhisper) {
                                    formattedMsg = <span className="italic text-gray-500">🤫 Whispered to <span className="font-bold text-neon-pink drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]">@{msg.mentionedName}</span>...</span>;
                                } else {
                                    formattedMsg = isWhisper && msg.mentionedName && msg.message.includes(`@${msg.mentionedName}`)
                                        ? msg.message.split(`@${msg.mentionedName}`).reduce((prev, curr, i) => i === 0 ? [curr] : [...prev, <span key={i} className="font-bold text-neon-pink drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]">@{msg.mentionedName}</span>, curr], [])
                                        : msg.message;
                                }

                                return (
                                    <div key={msg._id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                        {showName && !isMe && (
                                            <span className="text-[10px] font-bold text-neon-purple uppercase tracking-widest ml-4 mb-1">
                                                {msg.anonName}
                                            </span>
                                        )}
                                        <div 
                                            onTouchStart={(e) => {
                                                const timer = setTimeout(() => setReplyTo(msg), 600);
                                                e.currentTarget.dataset.timer = timer;
                                            }}
                                            onTouchEnd={(e) => clearTimeout(e.currentTarget.dataset.timer)}
                                            onContextMenu={(e) => { e.preventDefault(); setReplyTo(msg); }}
                                            className={`group relative max-w-[85%] md:max-w-[70%] rounded-2xl p-3 px-4 shadow-xl transition-all hover:scale-[1.01] ${
                                            isWhisper ? "bg-gradient-to-br from-neon-purple/80 to-neon-pink/80 border-l-[3px] border-l-neon-pink border-t border-t-white/20 border-r border-r-white/20 border-b border-b-white/20 text-white shadow-[0_0_10px_rgba(236,72,153,0.3)]" : 
                                            (isMe ? "bg-gradient-to-br from-neon-pink/30 to-neon-pink/10 border border-neon-pink/30 text-white shadow-neon-pink/10" : "bg-white/10 border border-white/5 text-gray-200 shadow-black/20")
                                        } ${isMe ? "rounded-br-none" : "rounded-bl-none"} cursor-pointer`}
                                        >
                                            {isWhisper && (
                                                <div className="absolute -top-[22px] left-1 text-[9px] font-black uppercase text-pink-300 opacity-80 tracking-widest drop-shadow-md pb-1 bg-dark-950/80 px-2 rounded-t-md border-t border-l border-r border-white/10 z-10">
                                                    💬 Whisper
                                                </div>
                                            )}
                                            {(msg.quoteAnonName || msg.replyTo) && (
                                                <div className="text-xs text-gray-300 border-l-[3px] border-neon-pink pl-2 mb-2 bg-dark-950/40 p-2 rounded-r-lg shadow-inner">
                                                    <div className="text-[10px] font-black text-neon-purple mb-0.5">{msg.quoteAnonName || "Quoted message"}</div>
                                                    <div className="opacity-80 leading-tight">{msg.quoteText || "Replying..."}</div>
                                                </div>
                                            )}
                                            <p className="text-sm md:text-base leading-relaxed break-words relative z-20 pointer-events-auto">{formattedMsg}</p>
                                            
                                            <div className={`absolute bottom-1 ${isMe ? "right-full mr-2" : "left-full ml-2"} opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20`}>
                                                <span className="text-[9px] text-gray-400 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded backdrop-blur-sm shadow-sm">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                                                </span>
                                            </div>

                                            {/* Quick Actions Float */}
                                            {!isMe && (
                                                <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 z-30">
                                                    <button onClick={(e) => { e.stopPropagation(); setReplyTo(msg); }} className="p-1.5 rounded-full bg-dark-900 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all shadow-xl">
                                                        <CornerDownLeft size={12} />
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleReport(msg._id); }} className="p-1.5 rounded-full bg-dark-900 border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-400/30 transition-all shadow-xl">
                                                        <AlertTriangle size={12} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area Overlay */}
                        <div className="p-3 md:p-4 bg-dark-900/40 backdrop-blur-xl border-t border-white/5 relative z-10 w-full">
                            {replyTo && (
                                <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl mb-3 text-xs text-gray-400 animate-in slide-in-from-bottom-2">
                                    <div className="flex items-center gap-2">
                                        <CornerDownLeft size={12} className="text-neon-purple" />
                                        <span>Replying to <span className="text-neon-purple font-bold">{replyTo.anonName}</span></span>
                                    </div>
                                    <button onClick={() => setReplyTo(null)} className="p-1 hover:bg-white/10 rounded-full transition-colors">✕</button>
                                </div>
                            )}
                            <form onSubmit={handleSend} className="relative flex gap-3 items-center w-full">
                                <div className="relative flex-1 group">
                                    {activeDropdown && (
                                        <div className="absolute bottom-full left-0 mb-2 w-64 bg-dark-900 border border-neon-pink/30 rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.2)] overflow-hidden z-50">
                                            <div className="p-2 text-xs font-bold text-gray-400 bg-black/20 border-b border-white/5">Mention...</div>
                                            {whoIsHere.filter(n => n.toLowerCase().includes((mentionSearch||"").toLowerCase())).length === 0 ? (
                                                <div className="p-3 text-sm text-gray-500 text-center">No one found</div>
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
                                                            document.getElementById("chatpage-input").focus();
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-white/10 transition-colors"
                                                    >
                                                        {name}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    )}
                                    <Input 
                                        id="chatpage-input"
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
                                        placeholder={cooldown > 0 ? `Wait ${cooldown}s...` : "Type your message anonymously... (@ to mention)"}
                                        disabled={cooldown > 0 || !connected}
                                        className="!rounded-2xl !py-4 pr-14 border-white/10 focus:border-neon-pink/50 transition-all bg-dark-950/50 backdrop-blur-xl w-full text-white"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-bold group-focus-within:text-neon-pink transition-colors pointer-events-none">
                                        {newMessage.length}/200
                                    </div>
                                </div>
                                <Button 
                                    type="submit" 
                                    size="lg" 
                                    disabled={cooldown > 0 || !connected || !newMessage.trim()}
                                    className={`!rounded-2xl !p-4 min-w-[60px] shadow-glow-pink ${cooldown > 0 ? "opacity-50 grayscale" : ""}`}
                                >
                                    <Send size={20} />
                                </Button>
                            </form>
                            <p className="text-center mt-3 text-[10px] text-gray-500 flex items-center justify-center gap-2 uppercase tracking-widest font-bold">
                                <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                                Messages vanish after 24 hours
                                <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                            </p>
                        </div>
                    </GlassCard>

                    {/* Desktop Sidebar (Optional, for "Online" feel) */}
                    <div className="hidden lg:flex flex-col w-72 gap-6 pb-4">
                        <GlassCard className="flex flex-col items-center justify-center p-6 text-center border-neon-pink/20 shadow-neon-pink/5">
                            <div className="w-16 h-16 rounded-full bg-neon-pink/10 border border-neon-pink/30 flex items-center justify-center text-neon-pink mb-4 shadow-glow-sm">
                                <Users size={32} />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-1">Global Lobby</h4>
                            <p className="text-sm text-gray-400">Join the conversation with everyone currently online.</p>
                            <div className="mt-4 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                MULTIPLE USERS ONLINE
                            </div>
                        </GlassCard>

                        <GlassCard className="p-6 border-white/5 flex-1 opacity-50 select-none">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Chat Guidelines</h4>
                            <ul className="space-y-3 text-xs text-gray-400">
                                <li className="flex gap-2">
                                    <span className="text-neon-pink">•</span>
                                    <span>Be respectful and kind to others.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-neon-pink">•</span>
                                    <span>No hate speech or harassment.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-neon-pink">•</span>
                                    <span>Stay anonymous, don't share PII.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-neon-pink">•</span>
                                    <span>Have fun and vibe!</span>
                                </li>
                            </ul>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default ChatPage;

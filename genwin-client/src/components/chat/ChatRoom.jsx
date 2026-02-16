import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Send, AlertTriangle, User, CornerDownLeft } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import toast from "react-hot-toast";
import API_URL from "../../config";

const socketParams = {
    url: API_URL.replace("/api", "") // Remove /api if present, assuming root
};

// Animal Names for Anonymous ID
const ANIMALS = ["Fox", "Panda", "Owl", "Tiger", "Koala", "Penguin", "Lion", "Wolf", "Bear", "Cat"];
const ADJECTIVES = ["Neon", "Cyber", "Mystic", "Cosmic", "Happy", "Lucky", "Wild", "Chill"];

const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const [anonName, setAnonName] = useState("");
    const [connected, setConnected] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [replyTo, setReplyTo] = useState(null);
    
    const messagesEndRef = useRef(null);

    // Initialize Identity
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

    // Initialize Socket
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Use the base URL for socket connection (remove /api suffix if it exists in API_URL)
        const baseUrl = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;

        const newSocket = io(baseUrl, {
            auth: { token },
            transports: ["websocket", "polling"], // Try websocket first
        });

        newSocket.on("connect", () => {
            console.log("Socket connected");
            setConnected(true);
        });

        newSocket.on("disconnect", () => {
            console.log("Socket disconnected");
            setConnected(false);
        });

        newSocket.on("error", (err) => {
            toast.error(err.message || "Chat Error");
        });

        newSocket.on("receive_message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        setSocket(newSocket);

        // Fetch History
        fetch(`${API_URL}/api/chat/history`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(err => console.error("History Error", err));

        return () => newSocket.disconnect();
    }, []);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Cooldown Timer
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setInterval(() => setCooldown(c => c - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [cooldown]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || cooldown > 0) return;

        if (newMessage.length > 200) {
            toast.error("Message too long!");
            return;
        }

        socket.emit("send_message", {
            message: newMessage,
            anonName: anonName,
            replyTo: replyTo ? replyTo._id : null
        });

        setNewMessage("");
        setReplyTo(null);
        setCooldown(5); // Client-side cooldown UI
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
        <div className="flex flex-col h-[600px] w-full bg-dark-900/40 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"} animate-pulse`} />
                    <h3 className="font-bold text-white">Live Chat</h3>
                </div>
                <div className="text-xs text-gray-400">
                    You are: <span className="text-neon-pink font-bold">{anonName}</span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((msg) => {
                    const isMe = msg.anonName === anonName;
                    return (
                        <div key={msg._id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                            <div className={`max-w-[80%] rounded-2xl p-3 px-4 ${
                                isMe 
                                ? "bg-neon-pink/20 border border-neon-pink/30 text-white rounded-br-none" 
                                : "bg-white/10 border border-white/5 text-gray-200 rounded-bl-none"
                            }`}>
                                <div className="flex justify-between items-center gap-4 mb-1">
                                    <span className={`text-[10px] font-bold uppercase tracking-wide ${isMe ? "text-neon-pink" : "text-neon-purple"}`}>
                                        {msg.anonName}
                                    </span>
                                    <span className="text-[10px] text-gray-500">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                                    </span>
                                </div>
                                
                                {msg.replyTo && ( // Placeholder for reply UI
                                    <div className="text-xs italic text-gray-500 border-l-2 border-white/20 pl-2 mb-1">
                                        Replying to message...
                                    </div>
                                )}

                                <p className="text-sm leading-relaxed break-words">{msg.message}</p>
                            </div>
                            
                            {!isMe && (
                                <div className="flex gap-2 mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setReplyTo(msg)} className="text-[10px] text-gray-500 hover:text-white flex items-center gap-1">
                                        <CornerDownLeft size={10} /> Reply
                                    </button>
                                    <button onClick={() => handleReport(msg._id)} className="text-[10px] text-gray-500 hover:text-red-400 flex items-center gap-1">
                                        <AlertTriangle size={10} /> Report
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white/5 border-t border-white/5">
                {replyTo && (
                    <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg mb-2 text-xs text-gray-400">
                        <span>Replying to <span className="text-neon-purple">{replyTo.anonName}</span></span>
                        <button onClick={() => setReplyTo(null)} className="hover:text-white">✕</button>
                    </div>
                )}
                <form onSubmit={handleSend} className="relative">
                    <Input 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={cooldown > 0 ? `Wait ${cooldown}s...` : "Say something nice..."}
                        disabled={cooldown > 0 || !connected}
                        className="pr-12"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                         <Button 
                            type="submit" 
                            size="sm" 
                            disabled={cooldown > 0 || !connected}
                            className={`!p-2 rounded-lg ${cooldown > 0 ? "opacity-50" : ""}`}
                         >
                             <Send size={16} />
                         </Button>
                    </div>
                </form>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-gray-600">
                        Be kind. Messages auto-delete in 24h.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;

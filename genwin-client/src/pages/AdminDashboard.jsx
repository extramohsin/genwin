import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, LogOut, Users, Heart, Filter, Calendar, MessageSquare, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import API_URL from "../config";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import GlassCard from "../components/ui/GlassCard";
import PageWrapper from "../components/ui/PageWrapper";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("matches"); // matches | feedback
  const [matches, setMatches] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Match Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // Feedback Filters
  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [feedbackFilter, setFeedbackFilter] = useState("all"); // all | pending | resolved

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          navigate("/admin/login");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Fetch Matches
        const matchRes = await fetch(`${API_URL}/api/admin/matches`, { headers });
        if (!matchRes.ok) throw new Error("Failed to fetch matches");
        const matchData = await matchRes.json();
        setMatches(matchData);

        // Fetch Feedback
        const feedbackRes = await fetch(`${API_URL}/api/feedback/all`, { headers });
        if (feedbackRes.ok) {
            const feedbackData = await feedbackRes.json();
            setFeedbacks(feedbackData);
        }

      } catch (err) {
        toast.error(err.message);
        if (err.message.includes("token") || err.message.includes("auth")) {
           navigate("/admin/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const updateFeedbackStatus = async (id, newStatus) => {
      try {
          const token = localStorage.getItem("adminToken");
          const response = await fetch(`${API_URL}/api/feedback/${id}/status`, {
              method: "PATCH",
              headers: { 
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}` 
              },
              body: JSON.stringify({ status: newStatus })
          });
          
          if (response.ok) {
              setFeedbacks(prev => prev.map(f => f._id === id ? { ...f, status: newStatus } : f));
              toast.success(`Marked as ${newStatus}`);
          }
      } catch {
          // ignore
          toast.error("Failed to update status");
      }
  };

  // Filter Logic
  const filteredMatches = matches.filter((match) => {
    const matchesSearch =
      match.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.crush.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.like.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.adore.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;
    return matchesSearch && match.user.branch === filter;
  });

  const filteredFeedbacks = feedbacks.filter((fb) => {
      const matchesSearch = 
        fb.fullName.toLowerCase().includes(feedbackSearch.toLowerCase()) ||
        fb.message.toLowerCase().includes(feedbackSearch.toLowerCase());
      
      if (feedbackFilter === "all") return matchesSearch;
      return matchesSearch && fb.status === feedbackFilter;
  });

  // Moderation Logic
  const [reportedMessages, setReportedMessages] = useState([]);
  
  // Logic to fetch reported messages when tab is "moderation"
  useEffect(() => {
      if (activeTab === "moderation") {
          const fetchReports = async () => {
              const token = localStorage.getItem("adminToken");
              const res = await fetch(`${API_URL}/api/admin/reported-messages`, {
                  headers: { Authorization: `Bearer ${token}` }
              });
              const data = await res.json();
              setReportedMessages(data);
          };
          fetchReports();
      }
  }, [activeTab]);

  const branches = [...new Set(matches.map((match) => match.user.branch))];

  if (loading) {
    return (
      <PageWrapper className="flex items-center justify-center">
        <div className="animate-spin text-pink-500">
          <Users size={48} />
        </div>
      </PageWrapper>
    );
  }

  const handleDeleteMessage = async (id) => {
      if (!window.confirm("Delete this message?")) return;
      try {
          const token = localStorage.getItem("adminToken");
          await fetch(`${API_URL}/api/chat/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` }
          });
          setReportedMessages(prev => prev.filter(m => m._id !== id));
          toast.success("Message deleted");
      } catch {
          toast.error("Failed to delete");
      }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">Overview of student submissions</p>
        </div>
        <div className="flex gap-4">
            <div className="flex bg-white/5 rounded-lg p-1">
                <button 
                    onClick={() => setActiveTab("matches")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "matches" ? "bg-pink-500 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                >
                    Matches
                </button>
                <button 
                    onClick={() => setActiveTab("feedback")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "feedback" ? "bg-pink-500 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                >
                    Feedback
                </button>
                <button 
                    onClick={() => setActiveTab("moderation")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "moderation" ? "bg-red-500 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                >
                    Moderation
                </button>
            </div>
            <Button variant="outline" icon={LogOut} onClick={handleLogout}>
            Logout
            </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlassCard className="!p-6 flex items-center justify-between border-blue-500/20 shadow-blue-500/10">
          <div>
            <p className="text-gray-400 text-sm">Total Submissions</p>
            <h3 className="text-3xl font-bold text-white">{matches.length}</h3>
          </div>
          <div className="p-3 bg-blue-500/20 rounded-full text-blue-400">
            <Users size={24} />
          </div>
        </GlassCard>
        
        <GlassCard className="!p-6 flex items-center justify-between border-green-500/20 shadow-green-500/10">
          <div>
            <p className="text-gray-400 text-sm">Total Feedback</p>
            <h3 className="text-3xl font-bold text-white">{feedbacks.length}</h3>
          </div>
          <div className="p-3 bg-green-500/20 rounded-full text-green-400">
            <MessageSquare size={24} />
          </div>
        </GlassCard>

         <GlassCard className="!p-6 flex items-center justify-between border-pink-500/20 shadow-pink-500/10">
          <div>
            <p className="text-gray-400 text-sm">Pending Reviews</p>
            <h3 className="text-xl font-bold text-white">{feedbacks.filter(f => f.status === "pending").length}</h3>
          </div>
          <div className="p-3 bg-pink-500/20 rounded-full text-pink-400">
            <AlertTriangle size={24} />
          </div>
        </GlassCard>
      </div>

      {activeTab === "matches" && (
          <>
            {/* Search & Filter */}
            <GlassCard className="mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <Input 
                    placeholder="Search by student name..." 
                    icon={Search}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="md:w-1/3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Filter className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 appearance-none"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        >
                        <option value="all">All Branches</option>
                        {branches.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                </div>
                </div>
            </GlassCard>

            {/* Table */}
            <GlassCard className="!p-0 overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                    <tr>
                        <th className="px-6 py-4 font-medium">Student</th>
                        <th className="px-6 py-4 font-medium">Branch</th>
                        <th className="px-6 py-4 font-medium text-pink-400">Crush</th>
                        <th className="px-6 py-4 font-medium text-purple-400">Like</th>
                        <th className="px-6 py-4 font-medium text-indigo-400">Adore</th>
                        <th className="px-6 py-4 font-medium">Date</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                    {filteredMatches.length > 0 ? (
                        filteredMatches.map((match) => (
                        <tr key={match._id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-medium text-white">{match.user.fullName}</div>
                                <div className="text-xs text-gray-500">{match.user.email}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                                {match.user.branch} • Yr {match.user.year}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-300 flex items-center gap-2">
                                <Heart size={14} className="text-pink-500" /> {match.crush}
                            </td>
                            <td className="px-6 py-4 text-gray-300">{match.like}</td>
                            <td className="px-6 py-4 text-gray-300">{match.adore}</td>
                            <td className="px-6 py-4 text-gray-500 text-sm">
                                {new Date(match.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                            No matches found matching your filters.
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
            </GlassCard>
          </>
      )}

      {activeTab === "feedback" && (
        <>
            {/* Feedback Filters */}
            <GlassCard className="mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input 
                            placeholder="Search feedback..." 
                            icon={Search}
                            value={feedbackSearch}
                            onChange={(e) => setFeedbackSearch(e.target.value)}
                        />
                    </div>
                    <div className="md:w-1/3">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 appearance-none"
                                value={feedbackFilter}
                                onChange={(e) => setFeedbackFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>
                    </div>
                </div>
            </GlassCard>

            <div className="space-y-4">
                {filteredFeedbacks.length > 0 ? (
                    filteredFeedbacks.map((fb) => (
                        <GlassCard key={fb._id} className="!p-6 border-white/5 hover:border-pink-500/30 transition-all">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                            fb.category === 'Bug Report' ? 'bg-red-500/20 text-red-400' :
                                            fb.category === 'Suggestion' ? 'bg-green-500/20 text-green-400' :
                                            'bg-blue-500/20 text-blue-400'
                                        }`}>
                                            {fb.category}
                                        </span>
                                        <span className="text-gray-500 text-xs">
                                            {new Date(fb.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-white mb-1">{fb.fullName}</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">{fb.message}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <select 
                                        value={fb.status}
                                        onChange={(e) => updateFeedbackStatus(fb._id, e.target.value)}
                                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border appearance-none cursor-pointer outline-none focus:ring-2 ${
                                            fb.status === 'resolved' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                                            fb.status === 'reviewed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                                        }`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="reviewed">Reviewed</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                </div>
                            </div>
                        </GlassCard>
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        No feedback found.
                    </div>
                )}
            </div>
        </>
      )}

      {activeTab === "moderation" && (
         <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">Reported Messages</h2>
            {reportedMessages.length > 0 ? (
                reportedMessages.map(msg => (
                    <GlassCard key={msg._id} className="p-4 border-red-500/20 bg-red-900/10">
                        <div className="flex justify-between items-start">
                             <div>
                                <span className="text-xs font-bold text-red-400 uppercase">
                                    Reports: {msg.reportsCount}
                                </span>
                                <p className="text-white mt-1">{msg.message}</p>
                                <span className="text-xs text-gray-500">By: {msg.anonName}</span>
                             </div>
                             <Button onClick={() => handleDeleteMessage(msg._id)} size="sm" variant="outline" className="text-red-400 border-red-500/30 hover:bg-red-500/20">
                                 Delete
                             </Button>
                        </div>
                    </GlassCard>
                ))
            ) : (
                <p className="text-gray-500">No reported messages.</p>
            )}
         </div>
      )}

    </PageWrapper>
  );
};

export default AdminDashboard;

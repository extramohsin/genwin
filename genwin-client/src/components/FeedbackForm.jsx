import { useState } from "react";
import { MessageSquare, Send, AlertTriangle, Bug, ThumbsUp } from "lucide-react";
import toast from "react-hot-toast";
import API_URL from "../config";
import Button from "./ui/Button";
import GlassCard from "./ui/GlassCard";

const FeedbackForm = () => {
  const [category, setCategory] = useState("Suggestion");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter a message!");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Sending feedback...");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/feedback/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
             throw new Error("Please wait a moment before sending another message.");
        }
        throw new Error(data.message || "Failed to submit feedback");
      }

      toast.success("Feedback Recieved! Thank you! 💌", { id: loadingToast });
      setMessage("");
      setCategory("Suggestion");
    } catch (error) {
      toast.error(error.message, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="mt-8 border-pink-500/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-pink-500/20 text-pink-400">
          <MessageSquare size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Share Your Experience</h3>
          <p className="text-sm text-gray-400">Have suggestions, complaints, or found a bug?</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
           <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Category</label>
           <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {["Suggestion", "Complaint", "Bug Report", "Abuse Report", "Other"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 border ${
                    category === cat 
                      ? "bg-pink-500 text-white border-pink-500" 
                      : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what's on your mind..."
            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 resize-none transition-all duration-300 hover:bg-white/10"
            required
          />
        </div>

        {/* Placeholder for Screenshot Upload */}
        <div className="p-4 border border-dashed border-white/10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 text-sm cursor-not-allowed opacity-50">
            <span>📷 Screenshot Upload (Coming Soon)</span>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} icon={Send}>
            {loading ? "Sending..." : "Submit Feedback"}
          </Button>
        </div>
      </form>
    </GlassCard>
  );
};

export default FeedbackForm;

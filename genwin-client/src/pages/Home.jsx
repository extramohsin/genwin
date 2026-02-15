import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, Crown, Send, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import API_URL from "../config";
import Button from "../components/ui/Button";
import GlassCard from "../components/ui/GlassCard";
import PageWrapper from "../components/ui/PageWrapper";
import AutoComplete from "../components/AutoComplete";

const Home = () => {
  const [formData, setFormData] = useState({
    crush: "",
    like: "",
    adore: "",
  });
  const [loading, setLoading] = useState(false);
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user already has a match status, redirect to Waiting Room if so
    const checkStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/match/status/${user.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        // data.submitted is true if user has already submitted
        if (data.submitted) {
          navigate("/waiting-room");
        }
      } catch (error) {
        console.error("Error checking status:", error);
      }
    };
    if (user?.userId) checkStatus();
  }, [user, navigate]);

  // DEBUG: Log formData changes
  useEffect(() => {
    console.log("Home: FormData Updated", formData);
  }, [formData]);

  const handleSubmit = async () => {
    console.log("Home: Submitting with", formData); // DEBUG
    if (!formData.crush || !formData.like || !formData.adore) {
      toast.error("Please fill in all three choices!");
      return;
    }

    // Duplicates are ALLOWED now per user request.

    setLoading(true);
    const loadingToast = toast.loading("Submitting your choices...");

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser.userId) {
          throw new Error("User session not found. Please login again.");
      }

      const submitData = {
        userId: storedUser.userId, // Use fresh value from storage
        crush: formData.crush._id,
        like: formData.like._id,
        adore: formData.adore._id,
      };

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/match/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409 || (response.status === 400 && data.message === "You have already submitted your preferences.")) {
           toast.error("You have already submitted!", { id: loadingToast });
           navigate("/waiting-room");
           return;
        }
        throw new Error(data.message || "Submission failed");
      }

      toast.success("Choices submitted successfully! 💘", { id: loadingToast });
      navigate("/waiting-room");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "Something went wrong", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="flex items-center justify-center">
      <div className="w-full max-w-2xl">
         <div className="text-center mb-10">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 font-fredoka">
              Find Your Match
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
              Select your top 3 choices. Destiny awaits!
            </p>
          </div>

        <div className="space-y-6">
          {/* Crush Card */}
          <GlassCard className="!p-6 border-pink-500/30 shadow-pink-500/10 !overflow-visible">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-pink-500/20 text-pink-500 shrink-0">
                <Heart size={24} fill="currentColor" />
              </div>
              <div className="flex-grow space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Your Crush</h3>
                  <p className="text-sm text-gray-400">Your #1 Priority. The one you really want.</p>
                </div>
                <AutoComplete
                  placeholder="Search for your crush..."
                  icon={Heart}
                  onSelect={(val) => setFormData({ ...formData, crush: val })}
                  excludedUserId={user?.userId}
                />
              </div>
            </div>
          </GlassCard>

          {/* Like Card */}
          <GlassCard className="!p-6 border-purple-500/30 shadow-purple-500/10 !overflow-visible">
             <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-purple-500/20 text-purple-500 shrink-0">
                <Star size={24} fill="currentColor" />
              </div>
              <div className="flex-grow space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Your Like</h3>
                  <p className="text-sm text-gray-400">Your backup plan. Someone you vibe with.</p>
                </div>
                <AutoComplete
                  placeholder="Search for your like..."
                  icon={Star}
                  onSelect={(val) => setFormData({ ...formData, like: val })}
                  excludedUserId={user?.userId}
                />
              </div>
            </div>
          </GlassCard>

          {/* Adore Card */}
          <GlassCard className="!p-6 border-indigo-500/30 shadow-indigo-500/10 !overflow-visible">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-indigo-500/20 text-indigo-500 shrink-0">
                <Crown size={24} fill="currentColor" />
              </div>
              <div className="flex-grow space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Your Adore</h3>
                  <p className="text-sm text-gray-400">Secret admirer territory. Worth a shot!</p>
                </div>
                <AutoComplete
                  placeholder="Search for your adore..."
                  icon={Crown}
                  onSelect={(val) => setFormData({ ...formData, adore: val })}
                  excludedUserId={user?.userId}
                />
              </div>
            </div>
          </GlassCard>

          <div className="pt-6">
            <Button 
              onClick={handleSubmit} 
              disabled={loading || !formData.crush || !formData.like || !formData.adore} 
              className="w-full text-lg py-4 shadow-xl shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              icon={Send}
            >
              {loading ? "Locking in choices..." : "Submit Choices"}
            </Button>
            <p className="text-center text-xs text-gray-500 mt-4">
              Once submitted, choices cannot be changed. Choose wisely!
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Home;

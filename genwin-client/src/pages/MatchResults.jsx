import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MatchResults = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return navigate("/login");
      
      const user = JSON.parse(storedUser);
      
      try {
        const response = await fetch(`http://localhost:5000/api/match/result/${user.userId}`);
        const resultData = await response.json();
        
        if (resultData.locked) {
            navigate("/waiting-room");
            return;
        }
        
        setData(resultData);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [navigate]);

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading your destiny...</div>;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black"></div>
      </div>

      <div className="z-10 w-full max-w-2xl">
        {data && data.matches.length > 0 ? (
          <div className="text-center space-y-8 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
              It's a Match! 🎉
            </h1>
            <p className="text-xl text-gray-300">
              The stars have aligned. Here are your mutual matches:
            </p>

            <div className="grid gap-6">
              {data.matches.map((match, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 transform hover:scale-105 transition-all">
                      <div className="text-sm text-pink-400 font-bold uppercase tracking-widest mb-2">
                          Matched via {match.type}
                      </div>
                      <div className="text-3xl font-bold text-white">
                          {match.fullName}
                      </div>
                      <div className="text-gray-400">@{match.username}</div>
                  </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="text-6xl">💔</div>
            <h2 className="text-4xl font-bold text-gray-200">
              No Matches Found
            </h2>
            <p className="text-xl text-gray-400 max-w-lg mx-auto">
              "Better find someone else." <br/>
              Don't worry, the right person is out there, they just might not be on this app yet!
            </p>
            <button 
                onClick={() => navigate("/home")}
                className="mt-8 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
                Return Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchResults;

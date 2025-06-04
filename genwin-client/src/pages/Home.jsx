import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AutoComplete from "../components/AutoComplete";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [crush, setCrush] = useState("");
  const [like, setLike] = useState("");
  const [adore, setAdore] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        navigate("/login");
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser || !parsedUser.userId) {
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setUser(parsedUser);

      // Check if user has already submitted
      fetch(`http://localhost:5000/api/match/results/${parsedUser.userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.userSelections) {
            setCrush(data.userSelections.crush);
            setLike(data.userSelections.like);
            setAdore(data.userSelections.adore);
            setIsSubmitted(true);
          }
        })
        .catch(console.error);
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!crush || !like || !adore) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Check for duplicate selections
    const selections = [crush, like, adore];
    if (new Set(selections).size !== selections.length) {
      setError("Please select different names for each field");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/match/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.userId,
          crush,
          like,
          adore,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setIsSubmitted(true);
      navigate("/results");
    } catch (err) {
      setError(err.message || "Server error, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Match Preferences
          </h2>
          <p className="mt-2 text-gray-600">
            Choose your match preferences carefully
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Crush 💘
            </label>
            <AutoComplete
              value={crush}
              onChange={setCrush}
              placeholder="Enter name"
              excludeValues={[like, adore]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Like 💝
            </label>
            <AutoComplete
              value={like}
              onChange={setLike}
              placeholder="Enter name"
              excludeValues={[crush, adore]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adore 💖
            </label>
            <AutoComplete
              value={adore}
              onChange={setAdore}
              placeholder="Enter name"
              excludeValues={[crush, like]}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitted || loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isSubmitted
                ? "bg-gray-400"
                : loading
                ? "bg-pink-300"
                : "bg-pink-600 hover:bg-pink-700"
            }`}
          >
            {loading
              ? "Submitting..."
              : isSubmitted
              ? "Already Submitted"
              : "Submit Matches"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;

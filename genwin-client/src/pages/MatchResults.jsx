import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MatchResults = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          navigate("/login");
          return;
        }

        const { userId } = JSON.parse(storedUser);
        const response = await fetch(
          `http://localhost:5000/api/match/results/${userId}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch results");
        }

        setResults(data);
      } catch (error) {
        console.error("Error fetching results:", error);
        setError(error.message || "Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your matches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <p className="text-red-500 text-center">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-pink-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white text-center">
            Your Match Results
          </h2>
        </div>

        <div className="p-6">
          {results?.userSelections && (
            <div className="mb-6 p-4 bg-pink-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Your Choices:</h3>
              <p>Crush: {results.userSelections.crush}</p>
              <p>Like: {results.userSelections.like}</p>
              <p>Adore: {results.userSelections.adore}</p>
            </div>
          )}

          {results?.matches && results.matches.length > 0 ? (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                🎉 Mutual Matches Found!
              </h3>
              <div className="space-y-4">
                {results.matches.map((match, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:bg-pink-50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">
                          {match.matchedUser}
                        </p>
                        <p className="text-sm text-gray-500">
                          {match.branch} - {match.year} Year
                        </p>
                      </div>
                      <div className="text-pink-600 font-medium">
                        {match.matchType === "crush" && "💘"}
                        {match.matchType === "like" && "💝"}
                        {match.matchType === "adore" && "💖"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-600">
                No mutual matches found yet. Check back later! 😊
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchResults;


import { useEffect, useState } from "react";
import { Heart, MapPin, Loader2 } from "lucide-react";

const API_URL = "http://localhost:5000";

function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/matches`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load matches");
      }

      setMatches(data.matches);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-24">
        <Loader2 className="animate-spin text-pink-600" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-500">
        {error}
        <button onClick={fetchMatches} className="block mx-auto mt-4 underline">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">

      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-10">
          <Heart className="mx-auto text-pink-600" size={40} />

          <h1 className="text-3xl font-bold mt-3 text-gray-800">
            Your Matches
          </h1>

          <p className="text-gray-500 mt-2">
            People who liked you back ❤️
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="text-center mt-16">
            <h2 className="text-xl font-semibold text-gray-700">
              No matches yet!
            </h2>
            <p className="text-gray-500 mt-2">
              Keep discovering and find your connection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {matches.map((match) => (
              <div
                key={match.matchId}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
              >
                <img
                  src={match.photo}
                  alt={match.name}
                  className="w-full h-64 object-cover"
                />

                <div className="p-5">

                  <h2 className="text-xl font-bold text-gray-800">
                    {match.name}, {match.age}
                  </h2>

                  <p className="flex items-center gap-1 text-gray-500 mt-1">
                    <MapPin size={16} />
                    {match.city}
                  </p>

                  <p className="text-gray-600 mt-3">
                    {match.bio}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {match.interests.map((interest) => (
                      <span
                        key={interest}
                        className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-xs"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-pink-600 font-medium">
                    <Heart size={18} fill="currentColor" />
                    It's a Match!
                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default Matches;

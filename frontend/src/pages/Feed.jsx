
import { useEffect, useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import ProfileCard from "../components/ProfileCard";

const API_URL = "http://localhost:5000";

function Feed() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [matchedProfile, setMatchedProfile] = useState(null);

  // Fetch profiles
  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/feed`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load profiles");
      }

      setProfiles(data.profiles);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Handle Like and Pass
  const handleSwipe = async (profileId, action) => {
    try {
      const response = await fetch(`${API_URL}/swipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileId, action }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Swipe failed");
      }

      setProfiles((prev) =>
        prev.filter((profile) => profile.id !== profileId)
      );

      if (data.isMatch) {
        setMatchedProfile(data.match);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-pink-600" size={40} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center mt-20">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchProfiles}
          className="mt-4 bg-pink-600 text-white px-5 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  const currentProfile = profiles[0];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Discover People
        </h1>
        <p className="text-gray-500 mt-2">
          Find someone who shares your interests.
        </p>
      </div>

      {profiles.length === 0 ? (
        <div className="text-center mt-24">
          <Heart className="mx-auto text-pink-500" size={50} />
          <h2 className="text-2xl font-bold mt-4">
            No More Profiles!
          </h2>
          <p className="text-gray-500 mt-2">
            You've discovered everyone for now.
          </p>
        </div>
      ) : (
        <div className="flex justify-center">
          <ProfileCard
            profile={currentProfile}
            onLike={() => handleSwipe(currentProfile.id, "like")}
            onPass={() => handleSwipe(currentProfile.id, "pass")}
          />
        </div>
      )}

      {/* Match Screen */}
      {matchedProfile && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="text-6xl mb-4">❤️</div>

            <h2 className="text-4xl font-bold text-pink-600">
              It's a Match!
            </h2>

            <p className="text-gray-500 mt-3">
              You and {matchedProfile.name} liked each other.
            </p>

            <button
              onClick={() => setMatchedProfile(null)}
              className="mt-7 w-full bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700"
            >
              Continue Discovering
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Feed;

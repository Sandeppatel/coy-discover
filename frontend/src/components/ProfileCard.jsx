import { useRef, useState } from "react";

export default function ProfileCard({ profile, onSwipe }) {
  const startXRef = useRef(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [exitDirection, setExitDirection] = useState(null);

  const SWIPE_THRESHOLD = 110;

  if (!profile) return null;

  const triggerSwipe = (direction) => {
    if (exitDirection) return;
    setExitDirection(direction);
    setIsDragging(false);

    setTimeout(() => {
      onSwipe(profile.id, direction === "right" ? "like" : "pass");
      setExitDirection(null);
      setDragX(0);
    }, 250);
  };

  const handlePointerDown = (e) => {
    if (exitDirection) return;
    startXRef.current = e.clientX;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || exitDirection) return;
    setDragX(e.clientX - startXRef.current);
  };

  const handlePointerUp = () => {
    if (!isDragging || exitDirection) return;
    setIsDragging(false);

    if (dragX > SWIPE_THRESHOLD) {
      triggerSwipe("right");
    } else if (dragX < -SWIPE_THRESHOLD) {
      triggerSwipe("left");
    } else {
      setDragX(0);
    }
  };

  const finalX =
    exitDirection === "right" ? 500 : exitDirection === "left" ? -500 : dragX;
  const finalRotate =
    exitDirection === "right"
      ? 20
      : exitDirection === "left"
      ? -20
      : dragX * 0.05;

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto select-none">
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          transform: `translateX(${finalX}px) rotate(${finalRotate}deg)`,
          transition: isDragging
            ? "none"
            : "transform 0.25s ease-out, opacity 0.25s ease-out",
          opacity: exitDirection ? 0 : 1,
          touchAction: "none",
        }}
        className="relative w-full h-[460px] rounded-2xl overflow-hidden shadow-xl bg-gray-900 cursor-grab active:cursor-grabbing"
      >
        <img
          src={profile.photo}
          alt={profile.name}
          draggable="false"
          className="w-full h-full object-cover pointer-events-none"
        />

        {(dragX > 40 || exitDirection === "right") && (
          <div className="absolute top-6 left-6 border-4 border-green-500 text-green-500 text-3xl font-bold px-4 py-2 rounded-xl rotate-[-15deg] pointer-events-none">
            LIKE
          </div>
        )}

        {(dragX < -40 || exitDirection === "left") && (
          <div className="absolute top-6 right-6 border-4 border-red-500 text-red-500 text-3xl font-bold px-4 py-2 rounded-xl rotate-[15deg] pointer-events-none">
            PASS
          </div>
        )}

        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 text-white pointer-events-none">
          <h2 className="text-2xl font-bold">
            {profile.name}
            {profile.age ? `, ${profile.age}` : ""}
          </h2>
          {profile.bio && (
            <p className="text-sm text-gray-200 mt-1 line-clamp-2">
              {profile.bio}
            </p>
          )}
          {profile.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {profile.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-6">
        <button
          type="button"
          onClick={() => triggerSwipe("left")}
          disabled={Boolean(exitDirection)}
          className="w-16 h-16 rounded-full bg-white shadow-lg border border-red-200 text-red-500 text-2xl font-bold flex items-center justify-center hover:scale-105 active:scale-95 transition"
          aria-label="Pass"
        >
          ✕
        </button>
        <button
          type="button"
          onClick={() => triggerSwipe("right")}
          disabled={Boolean(exitDirection)}
          className="w-16 h-16 rounded-full bg-white shadow-lg border border-green-200 text-green-500 text-2xl font-bold flex items-center justify-center hover:scale-105 active:scale-95 transition"
          aria-label="Like"
        >
          ♥
        </button>
      </div>
    </div>
  );
}
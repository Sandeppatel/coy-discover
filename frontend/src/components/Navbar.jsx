import { Heart, Users, Compass, Home } from "lucide-react";

function Navbar({ activePage, setActivePage }) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "feed", label: "Discover", icon: Compass },
    { id: "matches", label: "Matches", icon: Users },
  ];

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Heart className="text-pink-600" size={28} fill="currentColor" />
        <h1 className="text-2xl font-bold text-gray-800">
          Coy<span className="text-pink-600">Discover</span>
        </h1>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActivePage(id)}
            className={`flex items-center gap-2 font-medium ${
              activePage === id
                ? "text-pink-600"
                : "text-gray-500 hover:text-pink-600"
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
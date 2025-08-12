import { User, Settings, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function UserMenu({ user, onShowSettings, onSignOut, theme }) {
  const [showHoverCard, setShowHoverCard] = useState(false);
  const hoverCardRef = useRef(null);
  const buttonRef = useRef(null);

  const isDark = theme === "dark";

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleClickOutside = (event) => {
      if (
        hoverCardRef.current &&
        !hoverCardRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowHoverCard(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 relative">
      {user && (
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setShowHoverCard(!showHoverCard)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-opacity-10 border hover:bg-opacity-20 transition-all duration-200 cursor-pointer"
          >
            <User size={16} />
            <span className="text-sm truncate max-w-24">{user.username}</span>
          </button>

          {showHoverCard && (
            <div
              ref={hoverCardRef}
              className={`absolute top-full right-0 mt-2 w-64 ${
                isDark
                  ? "bg-[#1B1B1E] border-[#374151]"
                  : "bg-[#FFFFFF] border-[#E5E7EB]"
              } border rounded-lg shadow-lg z-50 p-4`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <p
                    className={`font-medium ${isDark ? "text-white" : "text-[#000000]"}`}
                  >
                    {user.username}
                  </p>
                  {user.email && (
                    <p
                      className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {user.email}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`border-t ${isDark ? "border-[#374151]" : "border-[#E5E7EB]"} pt-3`}
              >
                <button
                  onClick={() => {
                    onSignOut();
                    setShowHoverCard(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-900 hover:bg-opacity-20 transition-all duration-200"
                >
                  <LogOut size={16} />
                  <span className="text-sm">Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={onShowSettings}
        className="w-10 h-10 rounded-lg bg-opacity-10 border flex items-center justify-center hover:bg-opacity-20 transition-all duration-200"
      >
        <Settings size={20} />
      </button>
    </div>
  );
}

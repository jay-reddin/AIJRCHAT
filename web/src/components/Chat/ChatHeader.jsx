import { Plus, Settings } from "lucide-react";
import ModelDropdown from "./ModelDropdown";
import UserMenu from "./UserMenu";

export default function ChatHeader({
  handleNewChat,
  selectedModel,
  setSelectedModel,
  enabledModels,
  isSignedIn,
  user,
  setShowSettings,
  handleSignOut,
  theme,
}) {
  return (
    <header className="w-full max-w-full px-2 sm:px-4 py-3 border-b border-opacity-20 bg-opacity-80 backdrop-blur-sm">
      {/* Unified responsive layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        {/* First row/section */}
        <div className="flex items-center justify-between sm:justify-start sm:gap-4">
          {/* New chat button - left on desktop, right position on mobile */}
          <button
            onClick={handleNewChat}
            className="order-2 sm:order-1 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#A855F7] flex items-center justify-center hover:from-[#6D28D9] hover:to-[#9333EA] transition-all duration-200"
          >
            <Plus size={16} className="text-white sm:w-5 sm:h-5" />
          </button>

          {/* Model dropdown - left on mobile, center on desktop */}
          <div className="order-1 sm:order-2 flex-1 max-w-[60%] sm:max-w-none sm:flex-initial">
            <ModelDropdown
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              enabledModels={enabledModels}
              isSignedIn={isSignedIn}
            />
          </div>

          {/* Username - right on mobile, hidden on desktop (shown in UserMenu) */}
          {user && (
            <div className="order-3 sm:hidden flex items-center gap-1 px-2 py-1 rounded-lg bg-opacity-10 border text-sm" suppressHydrationWarning>
              <span className="truncate max-w-20">{user.username}</span>
            </div>
          )}
        </div>

        {/* Second row/section - settings on mobile, UserMenu on desktop */}
        <div className="flex justify-end gap-2 sm:justify-start sm:gap-0">
          <button
            onClick={() => setShowSettings(true)}
            className="sm:hidden w-8 h-8 rounded-lg bg-opacity-10 border flex items-center justify-center hover:bg-opacity-20 transition-all duration-200"
            suppressHydrationWarning
          >
            <Settings size={16} />
          </button>

          {/* Desktop UserMenu */}
          <div className="hidden sm:block" suppressHydrationWarning>
            <UserMenu
              user={user}
              onShowSettings={() => setShowSettings(true)}
              onSignOut={handleSignOut}
              theme={theme}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

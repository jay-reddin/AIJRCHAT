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
      {/* Mobile Layout */}
      <div className="flex flex-col gap-2 sm:hidden">
        {/* Top Row: Model Dropdown on left, Username on right */}
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-[60%]">
            <ModelDropdown
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              enabledModels={enabledModels}
              isSignedIn={isSignedIn}
            />
          </div>
          {user && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-opacity-10 border text-sm">
              <span className="truncate max-w-20">{user.username}</span>
            </div>
          )}
        </div>

        {/* Bottom Row: + button and Settings button aligned under username */}
        <div className="flex justify-end gap-2">
          <button
            onClick={handleNewChat}
            className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#A855F7] flex items-center justify-center hover:from-[#6D28D9] hover:to-[#9333EA] transition-all duration-200"
          >
            <Plus size={16} className="text-white" />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="w-8 h-8 rounded-lg bg-opacity-10 border flex items-center justify-center hover:bg-opacity-20 transition-all duration-200"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center justify-between">
        <button
          onClick={handleNewChat}
          className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#A855F7] flex items-center justify-center hover:from-[#6D28D9] hover:to-[#9333EA] transition-all duration-200"
        >
          <Plus size={20} className="text-white" />
        </button>

        <ModelDropdown
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          enabledModels={enabledModels}
          isSignedIn={isSignedIn}
        />

        <UserMenu
          user={user}
          onShowSettings={() => setShowSettings(true)}
          onSignOut={handleSignOut}
          theme={theme}
        />
      </div>
    </header>
  );
}

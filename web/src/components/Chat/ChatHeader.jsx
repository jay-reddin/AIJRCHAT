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
    <header className="w-full max-w-full px-4 py-3 border-b border-opacity-20 bg-opacity-80 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={handleNewChat}
          className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#A855F7] flex items-center justify-center hover:from-[#6D28D9] hover:to-[#9333EA] transition-all duration-200 flex-shrink-0"
        >
          <Plus size={20} className="text-white" />
        </button>

        <div className="flex-1 mx-4">
          <ModelDropdown
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            enabledModels={enabledModels}
            isSignedIn={isSignedIn}
            theme={theme}
          />
        </div>

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

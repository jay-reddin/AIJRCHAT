import { useState, useRef } from "react";
import usePuterAuth from "../hooks/usePuterAuth";
import useChat from "../hooks/useChat.js";
import { defaultModels } from "../data/ai-models.js";

import LoadingScreen from "../components/Auth/LoadingScreen.jsx";
import AuthScreen from "../components/Auth/AuthScreen.jsx";
import PageFooter from "../components/Layout/PageFooter.jsx";
import ChatHeader from "../components/Chat/ChatHeader.jsx";
import AIModeSelector from "../components/Chat/AIModeSelector.jsx";
import MessageArea from "../components/Chat/MessageArea.jsx";
import ChatInput from "../components/Chat/ChatInput.jsx";
import SettingsModal from "../components/Settings/SettingsModal.jsx";
import TokenUsageTracker from "../components/Chat/TokenUsageTracker.jsx";

export default function AIChat() {
  const {
    isSignedIn,
    user,
    isLoading: authLoading,
    signIn,
    signOut,
  } = usePuterAuth();

  const [selectedModel, setSelectedModel] = useState("gpt-5");
  const [enabledModels, setEnabledModels] = useState(defaultModels);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [fontSize, setFontSize] = useState(100);

  const inputRef = useRef(null);

  const {
    messages,
    currentMessage,
    setCurrentMessage,
    isLoading,
    error,
    setError,
    chatMode,
    setChatMode,
    imageUrl,
    setImageUrl,
    enableFunctions,
    setEnableFunctions,
    enableStreaming,
    setEnableStreaming,
    handleNewChat,
    handleSendMessage,
    handleResend,
    handleCopy,
    handleDelete,
  } = useChat({ isSignedIn, authLoading, selectedModel, inputRef });

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error("Sign in failed:", error);
      setError("Failed to sign in. Please try again.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
      setError("Failed to sign out. Please try again.");
    }
  };

  const handleSaveSettings = () => {
    setShowSettings(false);
  };

  const toggleModelEnabled = (model) => {
    setEnabledModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model],
    );
  };

  const themeClasses =
    theme === "dark"
      ? "bg-gradient-to-br from-[#0E0E10] to-[#1B1B1E] text-white"
      : "bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF] text-[#000000]";

  if (authLoading) {
    return <LoadingScreen theme={theme} />;
  }

  if (!isSignedIn) {
    return (
      <AuthScreen handleSignIn={handleSignIn} error={error} theme={theme} />
    );
  }

  return (
    <div
      className={`min-h-screen w-full max-w-full flex flex-col ${themeClasses} transition-colors duration-300 overflow-x-hidden`}
      style={{ fontSize: `${fontSize}%` }}
    >
      <ChatHeader
        handleNewChat={handleNewChat}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        enabledModels={enabledModels}
        isSignedIn={isSignedIn}
        user={user}
        setShowSettings={setShowSettings}
        handleSignOut={handleSignOut}
        theme={theme}
      />

      <AIModeSelector
        chatMode={chatMode}
        setChatMode={setChatMode}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        enableFunctions={enableFunctions}
        setEnableFunctions={setEnableFunctions}
        enableStreaming={enableStreaming}
        setEnableStreaming={setEnableStreaming}
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
        selectedModel={selectedModel}
      />

      <TokenUsageTracker messages={messages} />

      <MessageArea
        messages={messages}
        isLoading={isLoading}
        error={error}
        theme={theme}
        isSignedIn={isSignedIn}
        onResend={handleResend}
        onCopy={handleCopy}
        onDelete={handleDelete}
      />

      <ChatInput
        ref={inputRef}
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
        handleSendMessage={handleSendMessage}
        isLoading={isLoading}
        isSignedIn={isSignedIn}
        theme={theme}
      />

      <PageFooter />

      <SettingsModal
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        theme={theme}
        setTheme={setTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
        user={user}
        enabledModels={enabledModels}
        toggleModelEnabled={toggleModelEnabled}
        handleSaveSettings={handleSaveSettings}
        enableFunctions={enableFunctions}
        setEnableFunctions={setEnableFunctions}
        enableStreaming={enableStreaming}
        setEnableStreaming={setEnableStreaming}
      />

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

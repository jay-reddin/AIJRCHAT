import { useState } from "react";
import { X } from "lucide-react";
import UISettingsTab from "./UISettingsTab";
import AIModelsSettingsTab from "./AIModelsSettingsTab";
import AIFunctionsSettingsTab from "./AIFunctionsSettingsTab";

export default function SettingsModal({
  showSettings,
  setShowSettings,
  theme,
  setTheme,
  fontSize,
  setFontSize,
  user,
  enabledModels,
  toggleModelEnabled,
  handleSaveSettings,
  enableFunctions,
  setEnableFunctions,
  enableStreaming,
  setEnableStreaming,
}) {
  const [activeTab, setActiveTab] = useState("ui");

  if (!showSettings) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${
          theme === "dark" ? "bg-[#1B1B1E]" : "bg-white"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            <button
              onClick={() => setShowSettings(false)}
              className="p-2 rounded-lg hover:bg-opacity-20 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex border-b border-opacity-20 mb-6">
            <button
              onClick={() => setActiveTab("ui")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "ui"
                  ? "border-b-2 border-purple-500 text-purple-500"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              UI
            </button>
            <button
              onClick={() => setActiveTab("functions")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "functions"
                  ? "border-b-2 border-purple-500 text-purple-500"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              AI Functions
            </button>
            <button
              onClick={() => setActiveTab("models")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "models"
                  ? "border-b-2 border-purple-500 text-purple-500"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              AI Models
            </button>
          </div>

          {activeTab === "ui" && (
            <UISettingsTab
              theme={theme}
              setTheme={setTheme}
              fontSize={fontSize}
              setFontSize={setFontSize}
              user={user}
            />
          )}

          {activeTab === "functions" && (
            <AIFunctionsSettingsTab
              enableFunctions={enableFunctions}
              setEnableFunctions={setEnableFunctions}
              enableStreaming={enableStreaming}
              setEnableStreaming={setEnableStreaming}
            />
          )}

          {activeTab === "models" && (
            <AIModelsSettingsTab
              enabledModels={enabledModels}
              toggleModelEnabled={toggleModelEnabled}
              handleSaveSettings={handleSaveSettings}
            />
          )}
        </div>
      </div>
    </div>
  );
}

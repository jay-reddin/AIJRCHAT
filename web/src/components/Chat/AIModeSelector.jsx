import { useState, useRef } from "react";
import { ImageIcon, Upload, MessageSquare, Zap } from "lucide-react";
import { getModelCapabilities } from "../../data/ai-models.js";
import TokenUsageTracker from "./TokenUsageTracker.jsx";
import ClientOnlyWrapper from "./ClientOnlyWrapper.jsx";

export default function AIModeSelector({
  chatMode,
  setChatMode,
  imageUrl,
  setImageUrl,
  enableFunctions,
  setEnableFunctions,
  enableStreaming,
  setEnableStreaming,
  currentMessage,
  setCurrentMessage,
  selectedModel,
  messages = [],
}) {
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const fileInputRef = useRef(null);

  // Get model capabilities
  const modelCapabilities = getModelCapabilities(selectedModel);

  const modes = [
    {
      id: "text",
      label: "💬 Text Chat",
      icon: MessageSquare,
      supported: true,
    },
    {
      id: "image-gen",
      label: "🎨 Generate Image",
      icon: ImageIcon,
      supported: modelCapabilities.imageGeneration,
    },
    {
      id: "image-analysis",
      label: "🔍 Analyze Image",
      icon: Upload,
      supported: modelCapabilities.vision,
    },
  ];

  const currentMode = modes.find((mode) => mode.id === chatMode) || modes[0];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
        setChatMode("image-analysis");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  const handleModeChange = (modeId) => {
    const mode = modes.find((m) => m.id === modeId);
    if (mode && mode.supported) {
      setChatMode(modeId);
      setShowModeDropdown(false);
    }
  };

  return (
    <div className="border-b border-opacity-20 p-4 space-y-3" suppressHydrationWarning>
      {/* Token Usage Tracker */}
      <ClientOnlyWrapper>
        <TokenUsageTracker messages={messages} />
      </ClientOnlyWrapper>
      {/* Mode Selector */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowModeDropdown(!showModeDropdown)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-opacity-10 border hover:bg-opacity-20 transition-all duration-200"
          >
            <currentMode.icon size={16} />
            <span className="text-sm font-medium">{currentMode.label}</span>
          </button>

          {showModeDropdown && (
            <div className="absolute top-full mt-2 w-48 rounded-lg bg-opacity-95 backdrop-blur-sm border shadow-lg z-50">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => handleModeChange(mode.id)}
                  disabled={!mode.supported}
                  className={`w-full text-left px-3 py-2 transition-colors flex items-center gap-2 ${
                    mode.supported
                      ? "hover:bg-opacity-20 cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  } ${chatMode === mode.id ? "bg-opacity-20" : ""}`}
                >
                  <mode.icon size={14} />
                  <span className="text-sm">{mode.label}</span>
                  {!mode.supported && (
                    <span className="text-xs opacity-60 ml-auto">❌</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Function Toggle - only show if model supports functions */}
        {modelCapabilities.functions && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={enableFunctions}
              onChange={(e) => setEnableFunctions(e.target.checked)}
              className="rounded"
            />
            <Zap size={14} />
            <span className="text-xs">Functions</span>
          </label>
        )}

        {/* Streaming Toggle - only show if model supports streaming */}
        {modelCapabilities.streaming && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={enableStreaming}
              onChange={(e) => setEnableStreaming(e.target.checked)}
              className="rounded"
            />
            <span className="text-xs">Stream</span>
          </label>
        )}

        {/* Reasoning indicator */}
        {modelCapabilities.reasoning && (
          <div className="flex items-center gap-1 text-xs opacity-70">
            <span>🧠</span>
            <span>Reasoning</span>
          </div>
        )}
      </div>

      {/* Image Analysis Controls */}
      {chatMode === "image-analysis" && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={handleImageUrlChange}
              placeholder="Enter image URL or upload file..."
              className="flex-1 px-3 py-2 text-sm rounded-lg bg-opacity-10 border focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 rounded-lg bg-opacity-10 border hover:bg-opacity-20 transition-colors"
              title="Upload image file"
            >
              <Upload size={16} />
            </button>
          </div>

          {imageUrl && (
            <div className="mt-2">
              <img
                src={imageUrl}
                alt="Preview"
                className="max-w-full h-auto rounded-lg border border-opacity-20 max-h-32"
              />
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Mode-specific tips */}
      <div className="text-xs opacity-60">
        {chatMode === "image-gen" && modelCapabilities.imageGeneration && (
          <span>💡 Tip: Describe the image you want to generate in detail</span>
        )}

        {chatMode === "image-gen" && !modelCapabilities.imageGeneration && (
          <span className="text-yellow-400">
            ⚠️ This model doesn't support image generation. Try GPT-5 or switch
            to DALL-E 3
          </span>
        )}

        {chatMode === "image-analysis" && modelCapabilities.vision && (
          <span>
            💡 Tip: Upload an image or paste a URL, then ask questions about it
          </span>
        )}

        {chatMode === "image-analysis" && !modelCapabilities.vision && (
          <span className="text-yellow-400">
            ⚠️ This model doesn't support vision. Try GPT-4.1, GPT-4o, Claude
            Sonnet 4, or Grok Vision
          </span>
        )}

        {chatMode === "text" &&
          enableFunctions &&
          modelCapabilities.functions && (
            <span>
              💡 Functions enabled: Ask for weather, calculations, or current
              time
            </span>
          )}

        {chatMode === "text" && !modelCapabilities.functions && (
          <span>
            ℹ️ Reasoning model: Great for complex problems, math, and deep
            analysis
          </span>
        )}
      </div>
    </div>
  );
}

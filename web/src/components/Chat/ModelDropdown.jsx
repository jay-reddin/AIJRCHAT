import { useState, useEffect } from "react";
import { ChevronDown, Zap, Eye, Image as ImageIcon, Brain } from "lucide-react";
import { aiModels, getModelCapabilities } from "../../data/ai-models.js";

export default function ModelDropdown({
  selectedModel,
  setSelectedModel,
  enabledModels,
  isSignedIn,
}) {
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderModelOption = (model) => {
    const capabilities = getModelCapabilities(model);
    const isSelected = selectedModel === model;

    return (
      <div
        key={model}
        onClick={() => {
          setSelectedModel(model);
          setShowModelDropdown(false);
        }}
        className={`p-3 hover:bg-gray-700/30 cursor-pointer transition-all duration-200 flex flex-col justify-start items-start w-full ${
          isSelected
            ? "bg-purple-500 bg-opacity-20 border-l-2 border-purple-500"
            : ""
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{model}</span>
              {/* Capability indicators */}
              <div className="flex gap-1">
                {capabilities.functions && (
                  <Zap
                    size={12}
                    className="text-yellow-500"
                    title="Function calling"
                  />
                )}
                {capabilities.vision && (
                  <Eye
                    size={12}
                    className="text-blue-500"
                    title="Vision capabilities"
                  />
                )}
                {capabilities.imageGeneration && (
                  <ImageIcon
                    size={12}
                    className="text-green-500"
                    title="Image generation"
                  />
                )}
                {capabilities.reasoning && (
                  <Brain
                    size={12}
                    className="text-purple-500"
                    title="Advanced reasoning"
                  />
                )}
              </div>
            </div>
            <p className="text-xs opacity-70 mt-1 line-clamp-2">
              {capabilities.description}
            </p>
            {capabilities.strengths && capabilities.strengths.length > 0 && (
              <div className="flex gap-1 mt-1 flex-wrap">
                {capabilities.strengths.slice(0, 3).map((strength, index) => (
                  <span
                    key={index}
                    className="text-xs bg-opacity-20 bg-blue-500 text-blue-300 px-1 py-0.5 rounded"
                  >
                    {strength}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="text-xs opacity-50 ml-2">
            {Math.floor(capabilities.maxTokens / 1000)}K
          </div>
        </div>
      </div>
    );
  };

  const currentCapabilities = getModelCapabilities(selectedModel);

  return (
    <div className="relative w-full flex flex-col">
      <button
        onClick={() => setShowModelDropdown(!showModelDropdown)}
        className="flex items-center justify-between w-full px-4 py-2 rounded-lg bg-opacity-10 border backdrop-blur-sm hover:bg-opacity-20 transition-all duration-200 min-h-[40px]"
        disabled={!isSignedIn}
      >
        <div className="flex flex-row justify-center flex-1">
          <span className="font-medium truncate text-base max-w-36 mr-2.5">{selectedModel}</span>
          <div className="flex gap-1 mt-0.5">
            {currentCapabilities.functions && (
              <Zap size={16} className="text-yellow-500 mr-2.5" />
            )}
            {currentCapabilities.vision && (
              <Eye size={16} className="text-blue-500 mr-2.5" />
            )}
            {currentCapabilities.imageGeneration && (
              <ImageIcon size={16} className="text-green-500 mr-2.5" />
            )}
            {currentCapabilities.reasoning && (
              <Brain size={16} className="text-purple-500 mr-2.5" />
            )}
          </div>
        </div>

        <ChevronDown
          size={14}
          className={`transition-transform ml-1 ${
            showModelDropdown ? "rotate-180" : ""
          }`}
        />
      </button>

      {isClient && showModelDropdown && (
        <div className="absolute top-full w-[351px] max-h-96 overflow-y-auto rounded-lg border shadow-xl z-50 flex flex-col justify-start items-center m-auto bg-gray-900/95 backdrop-blur-md border-gray-700">
          {/* Capability Legend */}
          <div className="p-3 border-b border-gray-700 bg-gray-800/50 flex flex-col justify-start items-start w-full">
            <h4 className="text-xs font-semibold mb-2">Capabilities</h4>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="flex items-center gap-1">
                <Zap size={10} className="text-yellow-500" />
                <span>Functions</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={10} className="text-blue-500" />
                <span>Vision</span>
              </div>
              <div className="flex items-center gap-1">
                <ImageIcon size={10} className="text-green-500" />
                <span>Image Gen</span>
              </div>
              <div className="flex items-center gap-1">
                <Brain size={10} className="text-purple-500" />
                <span>Reasoning</span>
              </div>
            </div>
          </div>

          {/* Group models by provider */}
          {Object.entries(aiModels).map(([provider, categories]) => {
            const allModels = [
              ...(categories.text || []),
              ...(categories.reasoning || []),
              ...(categories.vision || []),
            ];
            // Deduplicate models using Set
            const uniqueModels = [...new Set(allModels)];
            const providerModels = uniqueModels.filter((model) => enabledModels.includes(model));

            if (providerModels.length === 0) return null;

            return (
              <div key={provider}>
                <div className="px-3 py-2 text-xs font-semibold bg-gray-800/50 border-b border-gray-700 text-gray-200 w-full">
                  {provider === "Grok" ? "Grok (X.AI)" : provider}
                </div>
                {providerModels.map(renderModelOption)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

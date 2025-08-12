import { useState } from "react";
import { aiModels } from "../../data/ai-models.js";

export default function AIModelsSettingsTab({
  enabledModels,
  toggleModelEnabled,
  handleSaveSettings,
}) {
  const [openRouterEnabled, setOpenRouterEnabled] = useState(false);

  // Separate OpenRouter models from others
  const openRouterModels = Object.entries(aiModels)
    .filter(([provider]) => provider.toLowerCase().includes('openrouter'))
    .reduce((acc, [provider, models]) => {
      acc[provider] = models;
      return acc;
    }, {});

  const regularModels = Object.entries(aiModels)
    .filter(([provider]) => !provider.toLowerCase().includes('openrouter'))
    .reduce((acc, [provider, models]) => {
      acc[provider] = models;
      return acc;
    }, {});
  return (
    <div className="space-y-6">
      <div className="max-h-64 overflow-y-auto space-y-4">
        {Object.entries(aiModels).map(([provider, modelsByCategory]) => (
          <div key={provider} className="border rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3">{provider}</h3>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(modelsByCategory)
                .flat()
                .map((model) => (
                  <label
                    key={model}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={enabledModels.includes(model)}
                      onChange={() => toggleModelEnabled(model)}
                      className="rounded"
                    />
                    <span className="text-sm truncate">{model}</span>
                  </label>
                ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSaveSettings}
        className="w-full py-3 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-medium hover:from-[#6D28D9] hover:to-[#9333EA] transition-all duration-200"
      >
        Save Changes
      </button>
    </div>
  );
}

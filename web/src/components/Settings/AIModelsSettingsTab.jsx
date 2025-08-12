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
    .filter(([provider]) => provider === 'OpenRouter')
    .reduce((acc, [provider, models]) => {
      acc[provider] = models;
      return acc;
    }, {});

  const regularModels = Object.entries(aiModels)
    .filter(([provider]) => provider !== 'OpenRouter')
    .reduce((acc, [provider, models]) => {
      acc[provider] = models;
      return acc;
    }, {});
  return (
    <div className="space-y-6">
      {/* Enable OpenRouter Switch */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-base">Enable OpenRouter</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Access additional AI models through OpenRouter API
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={openRouterEnabled}
              onChange={(e) => setOpenRouterEnabled(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>

      {/* OpenRouter Models Section */}
      {openRouterEnabled && (
        <div className="border rounded-lg p-4">
          <h3 className="font-bold text-lg mb-3">OpenRouter Models</h3>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {Object.entries(openRouterModels).map(([provider, modelsByCategory]) => (
              <div key={provider}>
                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">{provider}</h4>
                <div className="grid grid-cols-1 gap-2 ml-4">
                  {[...new Set(Object.values(modelsByCategory).flat())]
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
        </div>
      )}

      {/* Regular Models Section */}
      <div className="max-h-64 overflow-y-auto space-y-4">
        {Object.entries(regularModels).map(([provider, modelsByCategory]) => (
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

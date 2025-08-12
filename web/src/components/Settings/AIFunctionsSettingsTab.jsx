import { Zap, Calculator, MapPin, Calendar } from "lucide-react";

export default function AIFunctionsSettingsTab({
  enableFunctions,
  setEnableFunctions,
  enableStreaming,
  setEnableStreaming,
}) {
  const functionInfo = [
    {
      name: "Weather",
      icon: MapPin,
      description: "Get current weather information for any city",
      example: "What's the weather in Paris?"
    },
    {
      name: "Calculator",
      icon: Calculator,
      description: "Perform mathematical calculations and evaluations",
      example: "Calculate 15% tip on $87.50"
    },
    {
      name: "Current Time",
      icon: Calendar,
      description: "Get the current date and time in various timezones",
      example: "What time is it now?"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">AI Capabilities</h3>
        
        {/* Streaming Toggle */}
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer p-3 border rounded-lg hover:bg-opacity-10">
            <div className="flex items-center gap-3">
              <Zap className="text-purple-500" size={20} />
              <div>
                <div className="font-medium">Real-time Streaming</div>
                <div className="text-sm opacity-70">See AI responses as they're being generated</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableStreaming}
              onChange={(e) => setEnableStreaming(e.target.checked)}
              className="rounded scale-110"
            />
          </label>

          {/* Functions Toggle */}
          <label className="flex items-center justify-between cursor-pointer p-3 border rounded-lg hover:bg-opacity-10">
            <div className="flex items-center gap-3">
              <Calculator className="text-green-500" size={20} />
              <div>
                <div className="font-medium">Function Calling</div>
                <div className="text-sm opacity-70">Enable AI to use tools and functions</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableFunctions}
              onChange={(e) => setEnableFunctions(e.target.checked)}
              className="rounded scale-110"
            />
          </label>
        </div>
      </div>

      {/* Available Functions */}
      {enableFunctions && (
        <div>
          <h4 className="text-md font-semibold mb-3">Available Functions</h4>
          <div className="space-y-3">
            {functionInfo.map((func, index) => (
              <div key={index} className="p-3 border rounded-lg bg-opacity-5">
                <div className="flex items-start gap-3">
                  <func.icon size={18} className="text-blue-500 mt-1" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{func.name}</div>
                    <div className="text-xs opacity-70 mb-2">{func.description}</div>
                    <div className="text-xs bg-opacity-20 bg-purple-500 text-purple-300 px-2 py-1 rounded italic">
                      "{func.example}"
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t pt-4">
        <h4 className="text-md font-semibold mb-3">Image Capabilities</h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 p-2 border rounded-lg bg-opacity-5">
            <span className="text-lg">🎨</span>
            <div>
              <div className="font-medium">Image Generation</div>
              <div className="text-xs opacity-70">Generate images using DALL-E 3</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-2 border rounded-lg bg-opacity-5">
            <span className="text-lg">🔍</span>
            <div>
              <div className="font-medium">Image Analysis</div>
              <div className="text-xs opacity-70">Analyze and describe images with vision models</div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs opacity-60 bg-blue-900 bg-opacity-10 p-3 rounded-lg">
        💡 <strong>Pro Tip:</strong> All AI functions are powered by Puter.com's free API. 
        No API keys required - costs are covered by individual users through the "User Pays" model.
      </div>
    </div>
  );
}
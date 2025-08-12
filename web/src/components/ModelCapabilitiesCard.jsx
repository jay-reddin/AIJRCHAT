import { Zap, Eye, Image as ImageIcon, Brain, Clock, FileText } from "lucide-react";
import { getModelCapabilities } from "../data/ai-models.js";

export default function ModelCapabilitiesCard({ selectedModel }) {
  const capabilities = getModelCapabilities(selectedModel);

  if (!capabilities) return null;

  return (
    <div className="bg-opacity-10 border rounded-lg p-4 m-4">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <span>🤖</span>
        {selectedModel} Capabilities
      </h3>
      
      <div className="space-y-2">
        <p className="text-sm opacity-80">{capabilities.description}</p>
        
        <div className="flex flex-wrap gap-2">
          {capabilities.functions && (
            <div className="flex items-center gap-1 text-xs bg-yellow-500 bg-opacity-20 text-yellow-300 px-2 py-1 rounded">
              <Zap size={12} />
              <span>Function Calling</span>
            </div>
          )}
          
          {capabilities.vision && (
            <div className="flex items-center gap-1 text-xs bg-blue-500 bg-opacity-20 text-blue-300 px-2 py-1 rounded">
              <Eye size={12} />
              <span>Vision Analysis</span>
            </div>
          )}
          
          {capabilities.imageGeneration && (
            <div className="flex items-center gap-1 text-xs bg-green-500 bg-opacity-20 text-green-300 px-2 py-1 rounded">
              <ImageIcon size={12} />
              <span>Image Generation</span>
            </div>
          )}
          
          {capabilities.reasoning && (
            <div className="flex items-center gap-1 text-xs bg-purple-500 bg-opacity-20 text-purple-300 px-2 py-1 rounded">
              <Brain size={12} />
              <span>Advanced Reasoning</span>
            </div>
          )}
          
          {capabilities.streaming && (
            <div className="flex items-center gap-1 text-xs bg-orange-500 bg-opacity-20 text-orange-300 px-2 py-1 rounded">
              <Clock size={12} />
              <span>Real-time Streaming</span>
            </div>
          )}
          
          <div className="flex items-center gap-1 text-xs bg-gray-500 bg-opacity-20 text-gray-300 px-2 py-1 rounded">
            <FileText size={12} />
            <span>{Math.floor(capabilities.maxTokens / 1000)}K Context</span>
          </div>
        </div>
        
        {capabilities.strengths && capabilities.strengths.length > 0 && (
          <div>
            <p className="text-xs font-medium opacity-70 mb-1">Best for:</p>
            <p className="text-xs opacity-60">{capabilities.strengths.join(", ")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
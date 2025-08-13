import { useState } from "react";
import { ImageIcon, Upload, MessageSquare, Zap, Brain, Code, Workflow, Eye } from "lucide-react";
import { getModelCapabilities } from "../../data/ai-models.js";
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
  messages,
}) {
  const capabilities = getModelCapabilities(selectedModel);

  // Get current mode states
  const isTextChat = chatMode === 'text';
  const isImageGen = chatMode === 'image-gen';
  const isImageAnalysis = chatMode === 'image-analysis';

  const handleModeChange = (mode) => {
    setChatMode(mode);
    // Clear image URL when switching away from image analysis
    if (mode !== 'image-analysis') {
      setImageUrl('');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
        setChatMode('image-analysis');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border-b border-opacity-20 p-4 space-y-4" suppressHydrationWarning>
      {/* Mode Selection Checkboxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Text Chat */}
        <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
          isTextChat 
            ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
            : 'border-gray-600 hover:border-gray-500'
        }`}>
          <input
            type="checkbox"
            checked={isTextChat}
            onChange={() => handleModeChange('text')}
            className="sr-only"
          />
          <MessageSquare size={16} />
          <span className="text-sm font-medium">Text Chat</span>
        </label>

        {/* Generate Image */}
        <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
          !capabilities.imageGeneration 
            ? 'opacity-50 cursor-not-allowed border-gray-700'
            : isImageGen
              ? 'bg-green-500/20 border-green-500 text-green-400'
              : 'border-gray-600 hover:border-gray-500'
        }`}>
          <input
            type="checkbox"
            checked={isImageGen}
            onChange={() => capabilities.imageGeneration && handleModeChange('image-gen')}
            disabled={!capabilities.imageGeneration}
            className="sr-only"
          />
          <ImageIcon size={16} />
          <span className="text-sm font-medium">Gen Image</span>
        </label>

        {/* Analyze Image */}
        <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
          !capabilities.vision 
            ? 'opacity-50 cursor-not-allowed border-gray-700'
            : isImageAnalysis
              ? 'bg-purple-500/20 border-purple-500 text-purple-400'
              : 'border-gray-600 hover:border-gray-500'
        }`}>
          <input
            type="checkbox"
            checked={isImageAnalysis}
            onChange={() => capabilities.vision && handleModeChange('image-analysis')}
            disabled={!capabilities.vision}
            className="sr-only"
          />
          <Eye size={16} />
          <span className="text-sm font-medium">Analyze Image</span>
        </label>

        {/* Streaming */}
        <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
          !capabilities.streaming 
            ? 'opacity-50 cursor-not-allowed border-gray-700'
            : enableStreaming
              ? 'bg-orange-500/20 border-orange-500 text-orange-400'
              : 'border-gray-600 hover:border-gray-500'
        }`}>
          <input
            type="checkbox"
            checked={enableStreaming}
            onChange={(e) => capabilities.streaming && setEnableStreaming(e.target.checked)}
            disabled={!capabilities.streaming}
            className="sr-only"
          />
          <Workflow size={16} />
          <span className="text-sm font-medium">Stream</span>
        </label>

        {/* Functions */}
        <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
          !capabilities.functions 
            ? 'opacity-50 cursor-not-allowed border-gray-700'
            : enableFunctions
              ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
              : 'border-gray-600 hover:border-gray-500'
        }`}>
          <input
            type="checkbox"
            checked={enableFunctions}
            onChange={(e) => capabilities.functions && setEnableFunctions(e.target.checked)}
            disabled={!capabilities.functions}
            className="sr-only"
          />
          <Zap size={16} />
          <span className="text-sm font-medium">Functions</span>
        </label>

        {/* Reasoning */}
        <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
          !capabilities.reasoning 
            ? 'opacity-50 cursor-not-allowed border-gray-700'
            : capabilities.reasoning
              ? 'bg-pink-500/20 border-pink-500 text-pink-400'
              : 'border-gray-600 hover:border-gray-500'
        }`}>
          <input
            type="checkbox"
            checked={capabilities.reasoning}
            disabled={true}
            className="sr-only"
          />
          <Brain size={16} />
          <span className="text-sm font-medium">Reasoning</span>
        </label>

        {/* Coding */}
        <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
          !capabilities.coding 
            ? 'opacity-50 cursor-not-allowed border-gray-700'
            : capabilities.coding
              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
              : 'border-gray-600 hover:border-gray-500'
        }`}>
          <input
            type="checkbox"
            checked={capabilities.coding}
            disabled={true}
            className="sr-only"
          />
          <Code size={16} />
          <span className="text-sm font-medium">Coding</span>
        </label>
      </div>

      {/* Image Upload for Analysis */}
      {isImageAnalysis && capabilities.vision && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL or upload a file"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <label className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer flex items-center gap-2">
              <Upload size={16} />
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          
          {imageUrl && (
            <div className="relative">
              <img
                src={imageUrl}
                alt="Preview"
                className="max-w-full h-auto max-h-40 rounded-lg border border-gray-600"
              />
              <button
                onClick={() => setImageUrl('')}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

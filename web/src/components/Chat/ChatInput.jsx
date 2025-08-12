import { forwardRef, useState, useCallback } from "react";
import { Send } from "lucide-react";

const ChatInput = forwardRef(
  (
    {
      currentMessage,
      setCurrentMessage,
      handleSendMessage,
      isLoading,
      isSignedIn,
      theme = "dark",
    },
    ref,
  ) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState([]);

    const isDark = theme === "dark";

    const handleKeyPress = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    const handleVoiceTranscript = useCallback(
      (transcript) => {
        setCurrentMessage(transcript);
      },
      [setCurrentMessage],
    );

    const handleFileUploaded = useCallback(
      (file) => {
        setAttachedFiles((prev) => [...prev, file]);
        // Add file reference to message
        const fileText = `\n\n[Attached: ${file.name}]\nFile URL: ${file.url}`;
        setCurrentMessage((prev) => prev + fileText);
      },
      [setCurrentMessage],
    );

    const handleTemplateSelect = useCallback(
      (template) => {
        setCurrentMessage(template);
      },
      [setCurrentMessage],
    );

    const handleSendWithFiles = () => {
      if (attachedFiles.length > 0) {
        // Include file information in the message
        let messageWithFiles = currentMessage;
        attachedFiles.forEach((file) => {
          messageWithFiles += `\n\nFile: ${file.name} (${file.type})\nURL: ${file.url}`;
        });
        setCurrentMessage(messageWithFiles);
      }
      handleSendMessage();
      setAttachedFiles([]);
    };

    return (
      <div className="p-2 sm:p-4 space-y-3 w-full max-w-full">
        {/* Advanced Features */}
        {showAdvanced && (
          <div
            className={`p-4 rounded-lg border ${
              isDark
                ? "bg-[#1B1B1E] border-[#374151]"
                : "bg-[#F8F9FA] border-[#E5E7EB]"
            }`}
          >
            <div className="text-center p-4">
              <p
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Advanced features coming soon...
              </p>
            </div>
          </div>
        )}

        {/* Main Input Area */}
        <div className="flex gap-2 sm:gap-3 items-end w-full">
          {/* Left side controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`px-3 py-2 rounded-lg text-xs transition-all duration-200 min-h-12 w-16 ${
                showAdvanced
                  ? isDark
                    ? "bg-blue-600 text-white"
                    : "bg-blue-500 text-white"
                  : isDark
                    ? "bg-[#1B1B1E] border border-[#374151] hover:bg-[#2A2A2E] text-white"
                    : "bg-[#FFFFFF] border border-[#E5E7EB] hover:bg-[#F1F3F4] text-black"
              }`}
              title="Toggle advanced features"
            >
              {showAdvanced ? "Hide" : "Files"}
            </button>
          </div>

          {/* Text Input */}
          <textarea
            ref={ref}
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              isSignedIn ? "Type your message..." : "Sign in to chat"
            }
            className={`flex-1 px-3 sm:px-4 py-3 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 resize-none ${
              isDark
                ? "bg-[#1B1B1E] bg-opacity-50 border border-[#374151] text-white placeholder-gray-400"
                : "bg-white bg-opacity-80 border border-[#E5E7EB] text-black placeholder-gray-500"
            }`}
            disabled={isLoading || !isSignedIn}
            rows={
              currentMessage.split("\n").length > 3
                ? Math.min(currentMessage.split("\n").length, 6)
                : 1
            }
            style={{
              minHeight: "48px",
              maxHeight: "200px",
              scrollbarWidth: "none",
              msOverflowStyle: "none"
            }}
          />

          {/* Send Button */}
          <button
            onClick={handleSendWithFiles}
            disabled={!currentMessage.trim() || isLoading || !isSignedIn}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-[#6D28D9] hover:to-[#9333EA] transition-all duration-200 shrink-0 flex flex-col justify-center items-center min-h-12 w-16"
          >
            <Send size={18} />
          </button>
        </div>

        {/* File attachments preview */}
        {attachedFiles.length > 0 && (
          <div
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {attachedFiles.length} file(s) attached
          </div>
        )}
      </div>
    );
  },
);

export default ChatInput;

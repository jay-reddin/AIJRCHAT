import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import MessageActions from "./MessageActions";

// SSR-safe ReactMarkdown wrapper
function SafeReactMarkdown({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return plain text on server to prevent hydration mismatch
    return <div className="whitespace-pre-wrap break-words">{children}</div>;
  }

  return <ReactMarkdown>{children}</ReactMarkdown>;
}

export default function Message({
  message,
  onResend,
  onCopy,
  onDelete,
  theme,
}) {
  const isDark = theme === "dark";

  return (
    <div
      key={message.id}
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div className="max-w-xs md:max-w-md">
        <div
          className={`text-xs opacity-70 mb-1 ${
            message.role === "user" ? "text-right" : "text-left"
          }`}
        >
          {message.role === "assistant" &&
            message.model &&
            `${message.model} • `}
          {message.functionUsed && `🔧 ${message.functionUsed} • `}
          {message.timestamp}
        </div>

        <div
          className={`px-4 py-2 rounded-lg ${
            message.role === "user"
              ? "bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white ml-auto"
              : message.role === "error"
                ? "bg-red-900 bg-opacity-20 border border-red-500 text-red-400"
                : isDark
                  ? "bg-[#2A2A2E] border border-[#374151] text-white"
                  : "bg-[#F1F3F4] border border-[#E5E7EB] text-[#000000]"
          }`}
        >
          {message.role === "assistant" ? (
            <div
              className={`prose prose-sm max-w-none ${
                isDark
                  ? "prose-invert prose-headings:text-white prose-p:text-white prose-strong:text-white prose-code:text-white prose-pre:bg-[#1B1B1E] prose-pre:text-white"
                  : "prose-headings:text-[#000000] prose-p:text-[#000000] prose-strong:text-[#000000] prose-code:text-[#000000] prose-pre:bg-[#F8F9FA] prose-pre:text-[#000000]"
              }`}
            >
              <SafeReactMarkdown>{message.content}</SafeReactMarkdown>
            </div>
          ) : (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          )}

          {/* Display generated image */}
          {message.type === "image" && message.imageUrl && (
            <div className="mt-3">
              <img
                src={message.imageUrl}
                alt={message.content}
                className="max-w-full h-auto rounded-lg border border-opacity-20"
                style={{ maxHeight: "300px" }}
              />
            </div>
          )}

          {/* Display image for analysis requests */}
          {message.type === "image-analysis-request" && message.imageUrl && (
            <div className="mt-3">
              <img
                src={message.imageUrl}
                alt="Image for analysis"
                className="max-w-full h-auto rounded-lg border border-opacity-20"
                style={{ maxHeight: "200px" }}
              />
            </div>
          )}
        </div>

        {message.role !== "error" && (
          <MessageActions
            message={message}
            onResend={onResend}
            onCopy={onCopy}
            onDelete={onDelete}
          />
        )}
      </div>
    </div>
  );
}

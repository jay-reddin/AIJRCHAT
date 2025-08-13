import { useEffect, useRef } from "react";
import Message from "./Message";

export default function MessageArea({
  messages,
  isLoading,
  error,
  theme,
  isSignedIn,
  onResend,
  onCopy,
  onDelete,
}) {
  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = 0;
    }
  }, [messages]);

  const messageBoxClasses =
    theme === "dark"
      ? "bg-[#1B1B1E] border-[#374151]"
      : "bg-[#FFFFFF] border-[#E5E7EB]";

  return (
    <div
      ref={messagesRef}
      className={`flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 ${messageBoxClasses} border-2 rounded-lg mx-2 sm:mx-4 mt-4 scrollbar-hide`}
      style={{
        maxHeight: "calc(100vh - 200px)",
        scrollbarWidth: "none",
        msOverflowStyle: "none"
      }}
    >
      {error && (
        <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-xs px-4 py-2 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-opacity-20">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                <div
                  className="w-2 h-2 rounded-full bg-current animate-pulse"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-current animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        </div>
      )}

      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          theme={theme}
          onResend={onResend}
          onCopy={onCopy}
          onDelete={onDelete}
        />
      ))}

    </div>
  );
}

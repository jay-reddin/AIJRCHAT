import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import MessageActions from "./MessageActions";
import { File, Image as ImageIcon, FileText } from "lucide-react";
import CodeBlock from "./CodeBlock.jsx";

// SSR-safe ReactMarkdown wrapper with custom code block rendering
function SafeReactMarkdown({ children, theme }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Custom components for markdown rendering
  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const codeText = String(children).replace(/\n$/, '');

      if (!inline) {
        // Block code - use our custom CodeBlock component
        return (
          <CodeBlock
            language={language}
            theme={theme}
            isStreaming={false}
            {...props}
          >
            {codeText}
          </CodeBlock>
        );
      } else {
        // Inline code - use default styling
        return (
          <code
            className={`px-1 py-0.5 rounded text-sm font-mono ${
              theme === 'dark'
                ? 'bg-gray-800 text-gray-200'
                : 'bg-gray-100 text-gray-800'
            }`}
            {...props}
          >
            {children}
          </code>
        );
      }
    },
    // Custom paragraph component for better spacing
    p({ children }) {
      return <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>;
    },
    // Custom list components
    ul({ children }) {
      return <ul className="mb-4 pl-6 space-y-2 list-disc">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="mb-4 pl-6 space-y-2 list-decimal">{children}</ol>;
    },
    li({ children }) {
      return <li className="leading-relaxed">{children}</li>;
    },
    // Custom heading components
    h1({ children }) {
      return <h1 className="text-xl font-bold mb-4 mt-6 first:mt-0">{children}</h1>;
    },
    h2({ children }) {
      return <h2 className="text-lg font-bold mb-3 mt-5 first:mt-0">{children}</h2>;
    },
    h3({ children }) {
      return <h3 className="text-base font-bold mb-2 mt-4 first:mt-0">{children}</h3>;
    },
    // Custom blockquote
    blockquote({ children }) {
      return (
        <blockquote className={`border-l-4 pl-4 py-2 my-4 italic ${
          theme === 'dark' ? 'border-gray-600 bg-gray-800/30' : 'border-gray-300 bg-gray-50'
        }`}>
          {children}
        </blockquote>
      );
    },
    // Custom line break
    br() {
      return <br className="mb-2" />;
    }
  };

  // Always render the same structure but suppress hydration warnings for content
  return (
    <div suppressHydrationWarning>
      {isClient ? (
        <ReactMarkdown components={components}>{children}</ReactMarkdown>
      ) : (
        <div className="whitespace-pre-wrap break-words">{children}</div>
      )}
    </div>
  );
}

// Function to extract file attachments from message content
function extractFileAttachments(content) {
  const files = [];
  const imageMatches = content.match(/\[Image: ([^\]]+)\]/g);
  const fileMatches = content.match(/\[File: ([^\]]+)\]\n```\n([\s\S]*?)\n```/g);

  if (imageMatches) {
    imageMatches.forEach(match => {
      const name = match.match(/\[Image: ([^\]]+)\]/)[1];
      files.push({ type: 'image', name });
    });
  }

  if (fileMatches) {
    fileMatches.forEach(match => {
      const [, name] = match.match(/\[File: ([^\]]+)\]/);
      const [, , content] = match.match(/\[File: ([^\]]+)\]\n```\n([\s\S]*?)\n```/);
      files.push({ type: 'file', name, content });
    });
  }

  return files;
}

export default function Message({
  message,
  onResend,
  onCopy,
  onDelete,
  theme,
}) {
  const isDark = theme === "dark";
  const attachedFiles = extractFileAttachments(message.content || '');

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

          {/* Display attached files */}
          {attachedFiles.length > 0 && (
            <div className="mt-3 space-y-2">
              {attachedFiles.map((file, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    isDark
                      ? "bg-gray-800/50 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {file.type === 'image' ? (
                      <ImageIcon size={16} className="text-blue-400" />
                    ) : (
                      <FileText size={16} className="text-green-400" />
                    )}
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {file.name}
                    </span>
                  </div>

                  {file.type === 'file' && file.content && (
                    <div className={`text-xs rounded p-2 font-mono overflow-x-auto ${
                      isDark ? 'bg-gray-900/50' : 'bg-white'
                    }`}>
                      <pre className="whitespace-pre-wrap">{file.content}</pre>
                    </div>
                  )}
                </div>
              ))}
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

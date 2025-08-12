import { useState, useEffect } from 'react';
import { formatTokenCount, TOKEN_LIMIT } from '../../utils/tokenCounter.js';
import { getStoredTokenUsage, addTokenUsage } from '../../utils/tokenStorage.js';

export default function TokenUsageTracker({ messages = [] }) {
  const [totalTokens, setTotalTokens] = useState(0);
  const [sessionTokens, setSessionTokens] = useState(0);

  useEffect(() => {
    // Load stored token usage on mount
    const stored = getStoredTokenUsage();
    setTotalTokens(stored);
  }, []);

  useEffect(() => {
    // Calculate tokens from current session messages
    let sessionTotal = 0;

    messages.forEach(message => {
      // Estimate tokens based on message content length
      if (message.content) {
        sessionTotal += Math.ceil(message.content.length / 4);
      }

      // Add tokens for any attachments (if messages have file data)
      if (message.files && message.files.length > 0) {
        message.files.forEach(file => {
          sessionTotal += file.type?.startsWith('image/') ? 765 : 100;
        });
      }
    });

    setSessionTokens(sessionTotal);
  }, [messages]);

  const combinedTokens = totalTokens + sessionTokens;
  const usagePercentage = (combinedTokens / TOKEN_LIMIT) * 100;
  const isNearLimit = usagePercentage > 80;
  const isAtLimit = usagePercentage > 95;


  return (
    <div className="px-4 py-2 border-b border-gray-700/50">
      <div className="flex items-start justify-center text-xs">
        <span className="text-gray-400">
          Total Usage: {formatTokenCount(combinedTokens)} / <span className="mr-2.5">{formatTokenCount(TOKEN_LIMIT)} --</span>
          {sessionTokens > 0 && (
            <span className="text-xs ml-2 opacity-60">
              (+{formatTokenCount(sessionTokens)} this session)
            </span>
          )}
        </span>
        <span className={`font-medium ${
          isAtLimit
            ? 'text-red-400'
            : isNearLimit
              ? 'text-yellow-400'
              : 'text-green-400'
        }`}>
          {usagePercentage.toFixed(1)}%
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="mt-1 w-full bg-gray-700 rounded-full h-1">
        <div
          className={`h-1 rounded-full transition-all duration-300 ${
            isAtLimit
              ? 'bg-red-500'
              : isNearLimit
                ? 'bg-yellow-500'
                : 'bg-green-500'
          }`}
          style={{ width: `${Math.min(usagePercentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

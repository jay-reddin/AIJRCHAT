import { useState } from 'react';
import { getStoredTokenUsage, setManualTokenUsage } from '../../utils/tokenStorage.js';
import { formatTokenCount } from '../../utils/tokenCounter.js';

export default function UISettingsTab({
  theme,
  setTheme,
  fontSize,
  setFontSize,
  user,
}) {
  const [manualTokens, setManualTokens] = useState(0);
  const [tokenInputValue, setTokenInputValue] = useState('0');

  // Load stored tokens on client mount
  useEffect(() => {
    const stored = getStoredTokenUsage();
    setManualTokens(stored);
    setTokenInputValue(stored.toString());
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Theme</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            theme === 'dark'
              ? 'bg-gray-800 text-white border-gray-600'
              : 'bg-white text-black border-gray-300'
          }`}
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Text Size: {fontSize}%
        </label>
        <input
          type="range"
          min="50"
          max="150"
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Token Usage from Puter (Monthly)
        </label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={tokenInputValue}
              onChange={(e) => setTokenInputValue(e.target.value)}
              placeholder="Enter tokens used from Puter settings"
              className={`flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                theme === 'dark'
                  ? 'bg-gray-800 text-white border-gray-600'
                  : 'bg-white text-black border-gray-300'
              }`}
            />
            <button
              onClick={() => {
                const tokens = parseInt(tokenInputValue) || 0;
                setManualTokenUsage(tokens);
                setManualTokens(tokens);
              }}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              Update
            </button>
          </div>
          <p className="text-xs opacity-60">
            Current stored usage: {formatTokenCount(manualTokens)} tokens
          </p>
          <p className="text-xs opacity-60">
            💡 Get your token usage from your Puter settings page and enter it here to sync
          </p>
        </div>
      </div>

      {user && (
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold mb-3">Account</h3>
          <div className="space-y-2 text-sm opacity-80">
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            {user.email && (
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

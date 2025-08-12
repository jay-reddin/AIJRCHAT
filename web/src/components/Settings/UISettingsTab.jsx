export default function UISettingsTab({
  theme,
  setTheme,
  fontSize,
  setFontSize,
  user,
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Theme</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-opacity-10 border focus:outline-none focus:ring-2 focus:ring-purple-500"
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

export default function LoadingScreen({ theme = "dark" }) {
  const themeClasses =
    theme === "dark"
      ? "bg-gradient-to-br from-[#0E0E10] to-[#1B1B1E] text-white"
      : "bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF] text-gray-900";
  return (
    <div
      className={`min-h-screen flex items-center justify-center ${themeClasses}`}
    >
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="opacity-70">Loading...</p>
      </div>
    </div>
  );
}

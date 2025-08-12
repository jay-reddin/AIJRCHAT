import { LogIn } from "lucide-react";
import PageFooter from "../Layout/PageFooter";

export default function AuthScreen({ handleSignIn, error, theme = "dark" }) {
  const themeClasses =
    theme === "dark"
      ? "bg-gradient-to-br from-[#0E0E10] to-[#1B1B1E] text-white"
      : "bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF] text-gray-900";
  const messageBoxClasses =
    theme === "dark"
      ? "bg-[#1B1B1E] border-[#353538]"
      : "bg-white border-gray-300";

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${themeClasses} p-4`}
    >
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent">
            AI Chat
          </h1>
          <p className="text-lg opacity-80">
            Chat with multiple AI models using Puter.com
          </p>
        </div>

        <div
          className={`${messageBoxClasses} border-2 rounded-lg p-6 space-y-4`}
        >
          <div className="space-y-2">
            <LogIn size={48} className="mx-auto text-purple-500" />
            <h2 className="text-xl font-semibold">Sign in to continue</h2>
            <p className="opacity-70 text-sm">
              Sign in with your Puter account to start chatting with AI models
            </p>
          </div>

          <button
            onClick={handleSignIn}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-medium hover:from-[#6D28D9] hover:to-[#9333EA] transition-all duration-200"
          >
            Sign in with Puter
          </button>

          {error && (
            <div className="text-red-400 text-sm bg-red-900 bg-opacity-20 p-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        <PageFooter />
      </div>
    </div>
  );
}

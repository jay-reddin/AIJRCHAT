import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PuterLoader({ children }) {
  useEffect(() => {
    // Load Puter.js if not already loaded
    if (typeof window !== "undefined" && !window.puter) {
      try {
        const script = document.createElement("script");
        script.src = "https://js.puter.com/v2/";
        script.async = true;
        script.onerror = () => {
          console.warn("Failed to load Puter.js - continuing without it");
        };
        document.head.appendChild(script);
      } catch (error) {
        console.warn("Error loading Puter.js:", error);
      }
    }

    // Register service worker for PWA (only in production-like environments)
    if ("serviceWorker" in navigator && window.location.protocol === "https:") {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registered: ", registration);
          })
          .catch((registrationError) => {
            console.warn("SW registration failed: ", registrationError);
          });
      });
    }
  }, []);

  return children;
}

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <PuterLoader>
        <div className="bg-gray-900 text-white min-h-screen">
          {children}
        </div>
      </PuterLoader>
    </QueryClientProvider>
  );
}

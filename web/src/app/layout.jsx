import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Load Puter.js if not already loaded
    if (typeof window !== 'undefined' && !window.puter) {
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

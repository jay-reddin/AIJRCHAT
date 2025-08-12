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
      const script = document.createElement("script");
      script.src = "https://js.puter.com/v2/";
      script.async = true;
      document.head.appendChild(script);
    }

    // Register service worker for PWA
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registered: ", registration);
          })
          .catch((registrationError) => {
            console.log("SW registration failed: ", registrationError);
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

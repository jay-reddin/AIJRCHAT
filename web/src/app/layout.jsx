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
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta
          name="description"
          content="Advanced AI chatbot with multiple models, voice input, file uploads, and conversation templates"
        />
        <meta
          name="keywords"
          content="AI, chatbot, GPT, Claude, Gemini, voice input, file upload, conversation templates"
        />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Apple PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="AI Chat" />
        <link rel="apple-touch-icon" href="/icon-192.png" />

        {/* Microsoft PWA Meta Tags */}
        <meta name="msapplication-TileColor" content="#7C3AED" />

        {/* Theme Colors */}
        <meta name="theme-color" content="#7C3AED" />
        <meta name="msapplication-navbutton-color" content="#7C3AED" />

        {/* Icons */}
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icon-192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/icon-512.png"
        />
        <link rel="shortcut icon" href="/icon-192.png" />

        <title>AI Chat - Multi-Model Conversation App</title>
      </head>
      <body className="bg-gray-900 text-white">
        <QueryClientProvider client={queryClient}>
          <PuterLoader>{children}</PuterLoader>
        </QueryClientProvider>
      </body>
    </html>
  );
}

import { useState, useEffect } from 'react';

export default function ClientOnlyWrapper({ children, fallback = null }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return fallback during SSR and initial hydration
  if (!isClient) {
    return fallback;
  }

  return children;
}

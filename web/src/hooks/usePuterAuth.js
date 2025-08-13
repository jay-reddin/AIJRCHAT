import { useState, useEffect } from 'react';

export default function usePuterAuth() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Check authentication status on component mount and when window regains focus
  const checkAuthStatus = async () => {
    if (typeof window !== 'undefined' && window.puter) {
      try {
        const signedIn = window.puter.auth.isSignedIn();
        setIsSignedIn(signedIn);
        
        if (signedIn) {
          const userData = await window.puter.auth.getUser();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsSignedIn(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  // Sign in function
  const signIn = async () => {
    if (typeof window !== 'undefined' && window.puter) {
      try {
        setIsLoading(true);
        await window.puter.auth.signIn();
        await checkAuthStatus(); // Refresh auth state after sign in
      } catch (error) {
        console.error('Sign in failed:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Sign out function
  const signOut = async () => {
    if (typeof window !== 'undefined' && window.puter) {
      try {
        setIsLoading(true);
        await window.puter.auth.signOut();
        setIsSignedIn(false);
        setUser(null);
      } catch (error) {
        console.error('Sign out failed:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Track client-side mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Wait for Puter to load, then check auth status
  useEffect(() => {
    if (!isClient) return;

    const waitForPuter = () => {
      if (typeof window !== 'undefined' && window.puter) {
        checkAuthStatus();
      } else {
        // Wait for Puter to load
        setTimeout(waitForPuter, 100);
      }
    };

    waitForPuter();
  }, [isClient]);

  // Listen for focus events to refresh auth state
  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;

    const handleFocus = () => {
      if (!isLoading) {
        checkAuthStatus();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isLoading, isClient]);

  return {
    isSignedIn,
    user,
    isLoading,
    signIn,
    signOut,
    refreshAuth: checkAuthStatus
  };
}

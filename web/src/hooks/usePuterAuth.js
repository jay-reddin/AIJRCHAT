import { useState, useEffect } from 'react';

export default function usePuterAuth() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Wait for Puter to load, then check auth status
  useEffect(() => {
    const waitForPuter = () => {
      if (typeof window !== 'undefined' && window.puter) {
        checkAuthStatus();
      } else {
        // Wait for Puter to load
        setTimeout(waitForPuter, 100);
      }
    };

    waitForPuter();
  }, []);

  // Listen for focus events to refresh auth state
  useEffect(() => {
    const handleFocus = () => {
      if (!isLoading) {
        checkAuthStatus();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isLoading]);

  return {
    isSignedIn,
    user,
    isLoading,
    signIn,
    signOut,
    refreshAuth: checkAuthStatus
  };
}
// Token usage persistence with monthly resets

const TOKEN_STORAGE_KEY = 'ai_chat_token_usage';
const LAST_RESET_KEY = 'ai_chat_last_token_reset';

export function getStoredTokenUsage() {
  try {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    const lastReset = localStorage.getItem(LAST_RESET_KEY);
    
    if (!stored || !lastReset) {
      return 0;
    }
    
    // Check if we need to reset (new month)
    const lastResetDate = new Date(lastReset);
    const now = new Date();
    
    // Reset if it's a new month
    if (now.getMonth() !== lastResetDate.getMonth() || 
        now.getFullYear() !== lastResetDate.getFullYear()) {
      resetTokenUsage();
      return 0;
    }
    
    return parseInt(stored, 10) || 0;
  } catch (error) {
    console.error('Error getting stored token usage:', error);
    return 0;
  }
}

export function saveTokenUsage(tokens) {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, tokens.toString());
    localStorage.setItem(LAST_RESET_KEY, new Date().toISOString());
  } catch (error) {
    console.error('Error saving token usage:', error);
  }
}

export function addTokenUsage(additionalTokens) {
  const current = getStoredTokenUsage();
  const newTotal = current + additionalTokens;
  saveTokenUsage(newTotal);
  return newTotal;
}

export function resetTokenUsage() {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, '0');
    localStorage.setItem(LAST_RESET_KEY, new Date().toISOString());
  } catch (error) {
    console.error('Error resetting token usage:', error);
  }
}

export function setManualTokenUsage(tokens) {
  saveTokenUsage(tokens);
  return tokens;
}

export function getResetDate() {
  const lastReset = localStorage.getItem(LAST_RESET_KEY);
  if (!lastReset) return null;
  
  const resetDate = new Date(lastReset);
  // Next reset is first day of next month
  const nextReset = new Date(resetDate.getFullYear(), resetDate.getMonth() + 1, 1);
  return nextReset;
}

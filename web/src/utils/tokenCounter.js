// Simple token estimation (GPT-style approximation)
// In reality, you'd want to use a proper tokenizer library like tiktoken

export function estimateTokens(text, files = []) {
  if (!text && (!files || files.length === 0)) return 0;
  
  let tokenCount = 0;
  
  // Text tokens (roughly 4 characters per token for English)
  if (text) {
    tokenCount += Math.ceil(text.length / 4);
  }
  
  // File tokens (estimate based on file type and size)
  if (files && files.length > 0) {
    files.forEach(file => {
      // Add base tokens for file reference
      tokenCount += 50; // Base tokens for file attachment
      
      // Add tokens based on file type
      if (file.type?.startsWith('image/')) {
        tokenCount += 765; // Vision model image processing tokens
      } else if (file.type?.includes('text') || file.type?.includes('json')) {
        // Estimate based on file size if available
        tokenCount += Math.ceil((file.size || 1000) / 4);
      } else {
        tokenCount += 100; // Default for other file types
      }
    });
  }
  
  return tokenCount;
}

export function formatTokenCount(count) {
  if (count < 1000) {
    return count.toString();
  } else if (count < 1000000) {
    return `${(count / 1000).toFixed(1)}K`;
  } else {
    return `${(count / 1000000).toFixed(1)}M`;
  }
}

export const TOKEN_LIMIT = 50000000; // 50M tokens as per Puter limit

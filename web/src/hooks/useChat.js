import { useState, useEffect } from "react";
import { conversationHistory } from "../data/conversation-history.js";
import { availableFunctions } from "../data/available-functions.js";
import { getModelCapabilities, modelSupports } from "../data/ai-models.js";

// Stable ID generator to prevent hydration mismatches
let messageIdCounter = 1;
const generateMessageId = () => {
  return `msg_${messageIdCounter++}`;
};

const executeFunction = (functionName, args) => {
  switch (functionName) {
    case "get_weather":
      const weatherData = {
        Paris: { temp: "22°C", condition: "Partly Cloudy", humidity: "65%" },
        London: { temp: "18°C", condition: "Rainy", humidity: "80%" },
        "New York": { temp: "25°C", condition: "Sunny", humidity: "45%" },
        Tokyo: { temp: "28°C", condition: "Clear", humidity: "70%" },
        "Los Angeles": { temp: "24°C", condition: "Sunny", humidity: "55%" },
        Berlin: { temp: "19°C", condition: "Cloudy", humidity: "70%" },
      };
      const weather = weatherData[args.location] || {
        temp: "20°C",
        condition: "Unknown",
        humidity: "50%",
      };
      return JSON.stringify(weather);

    case "calculate":
      try {
        const result = Function(
          '"use strict"; return (' +
            args.expression.replace(/[^0-9+\-*/.() ]/g, "") +
            ")",
        )();
        return JSON.stringify({
          expression: args.expression,
          result: result,
        });
      } catch (e) {
        return JSON.stringify({ error: "Invalid mathematical expression" });
      }

    case "get_current_time":
      const now = new Date();
      return JSON.stringify({
        datetime: now.toISOString(),
        local_time: now.toLocaleString(),
        timezone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
      });

    default:
      return JSON.stringify({ error: "Function not found" });
  }
};

export default function useChat({
  isSignedIn,
  authLoading,
  selectedModel,
  inputRef,
}) {
  const [messages, setMessages] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // Initialize messages after client mount to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    if (!isSignedIn) {
      setMessages(conversationHistory.messages);
    }
  }, [isClient, isSignedIn]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatMode, setChatMode] = useState("text");
  const [imageUrl, setImageUrl] = useState("");

  // Get model capabilities
  const modelCapabilities = getModelCapabilities(selectedModel);

  // Auto-enable/disable features based on model capabilities
  const [enableFunctions, setEnableFunctions] = useState(
    modelCapabilities.functions,
  );
  const [enableStreaming, setEnableStreaming] = useState(
    modelCapabilities.streaming,
  );

  // Update features when model changes
  useEffect(() => {
    const capabilities = getModelCapabilities(selectedModel);
    setEnableFunctions(capabilities.functions);
    setEnableStreaming(capabilities.streaming);

    // Reset chat mode if current mode is not supported
    if (chatMode === "image-gen" && !capabilities.imageGeneration) {
      setChatMode("text");
    }
    if (chatMode === "image-analysis" && !capabilities.vision) {
      setChatMode("text");
    }
  }, [selectedModel, chatMode]);

  const handleNewChat = () => {
    setMessages([]);
    setCurrentMessage("");
    setError(null);
    setImageUrl("");
    setChatMode("text");
  };

  const handleResend = (messageContent) => {
    setCurrentMessage(messageContent);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCopy = (content) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(content);
    }
  };

  const handleDelete = (messageId) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  // Handle image generation with DALL-E 3
  const handleImageGeneration = async () => {
    if (!currentMessage.trim() || isLoading || !isSignedIn) return;

    // Check if model supports image generation
    if (!modelSupports(selectedModel, "imageGeneration")) {
      setError(
        `${selectedModel} does not support image generation. Please select GPT-5 or use DALL-E 3 mode.`,
      );
      return;
    }

    const userMessage = {
      id: generateMessageId(),
      role: "user",
      content: `🎨 Generate image: "${currentMessage}"`,
      timestamp: new Date().toLocaleTimeString(),
      type: "image-generation-request",
    };

    setMessages((prev) => [userMessage, ...prev]);
    const imagePrompt = currentMessage;
    setCurrentMessage("");
    setIsLoading(true);
    setError(null);

    try {
      if (typeof window === 'undefined' || !window.puter) {
        throw new Error(
          "Puter is still loading. Please wait a moment and try again.",
        );
      }

      if (!window.puter.auth.isSignedIn()) {
        throw new Error("Please sign in to use AI image generation.");
      }

      // Generate image using DALL-E 3 (always use DALL-E 3 for image generation)
      const imageResponse = await window.puter.ai.txt2img(imagePrompt);

      // Create image message
      const imageMessage = {
        id: generateMessageId(),
        role: "assistant",
        content: `Generated image: "${imagePrompt}"`,
        timestamp: new Date().toLocaleTimeString(),
        model: "dall-e-3",
        type: "image",
        imageUrl: imageResponse.src || imageResponse,
      };

      setMessages((prev) => [imageMessage, ...prev]);
    } catch (error) {
      console.error("Image generation error:", error);
      setError(error.message);

      const errorMsg = {
        id: generateMessageId(),
        role: "error",
        content: `Image generation failed: ${error.message}`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [errorMsg, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image analysis with vision models
  const handleImageAnalysis = async () => {
    if ((!currentMessage.trim() && !imageUrl) || isLoading || !isSignedIn)
      return;

    // Check if model supports vision
    if (!modelSupports(selectedModel, "vision")) {
      setError(
        `${selectedModel} does not support vision analysis. Please select a vision-capable model like GPT-4.1, GPT-4o, Claude Sonnet 4, or Grok Vision.`,
      );
      return;
    }

    const userMessage = {
      id: generateMessageId(),
      role: "user",
      content: currentMessage || "Analyze this image",
      timestamp: new Date().toLocaleTimeString(),
      type: "image-analysis-request",
      imageUrl: imageUrl,
    };

    setMessages((prev) => [userMessage, ...prev]);
    const analysisPrompt =
      currentMessage ||
      "Describe this image in detail. What objects, people, or scenes do you see?";
    const analysisImageUrl = imageUrl;
    setCurrentMessage("");
    setImageUrl("");
    setIsLoading(true);
    setError(null);

    try {
      if (!window.puter) {
        throw new Error(
          "Puter is still loading. Please wait a moment and try again.",
        );
      }

      if (!window.puter.auth.isSignedIn()) {
        throw new Error("Please sign in to use AI image analysis.");
      }

      // Use the selected vision model
      const analysisResponse = await window.puter.ai.chat(analysisPrompt, {
        model: selectedModel,
        image: analysisImageUrl,
      });

      const analysisMessage = {
        id: generateMessageId(),
        role: "assistant",
        content: analysisResponse.message?.content || analysisResponse,
        timestamp: new Date().toLocaleTimeString(),
        model: selectedModel,
        type: "image-analysis",
      };

      setMessages((prev) => [analysisMessage, ...prev]);
    } catch (error) {
      console.error("Image analysis error:", error);
      setError(error.message);

      const errorMsg = {
        id: generateMessageId(),
        role: "error",
        content: `Image analysis failed: ${error.message}`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [errorMsg, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (attachedFiles = []) => {
    if (!currentMessage.trim() || isLoading || !isSignedIn) return;

    // Route to appropriate handler based on chat mode
    if (chatMode === "image-gen") {
      return handleImageGeneration();
    }
    if (chatMode === "image-analysis") {
      return handleImageAnalysis();
    }

    const userMessage = {
      id: generateMessageId(),
      role: "user",
      content: currentMessage,
      timestamp: new Date().toLocaleTimeString(),
      files: attachedFiles || [],
    };

    setMessages((prev) => [userMessage, ...prev]);
    const messageToSend = currentMessage;
    setCurrentMessage("");
    setIsLoading(true);
    setError(null);

    try {
      if (!window.puter) {
        throw new Error(
          "Puter is still loading. Please wait a moment and try again.",
        );
      }
      if (!window.puter.auth.isSignedIn()) {
        throw new Error("Please sign in to use AI chat features.");
      }

      const puterMessages = [...messages]
        .reverse()
        .filter((msg) => msg.role === "user" || msg.role === "assistant")
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));
      puterMessages.push({ role: "user", content: messageToSend });

      const options = { model: selectedModel };

      // Only add streaming if model supports it
      if (modelSupports(selectedModel, "streaming") && enableStreaming) {
        options.stream = true;
      }

      // Only add tools if model supports functions
      if (modelSupports(selectedModel, "functions") && enableFunctions) {
        options.tools = Object.values(availableFunctions).map((func) => ({
          type: "function",
          function: func,
        }));
      }

      let assistantMessage = {
        id: generateMessageId(),
        role: "assistant",
        content: "",
        timestamp: new Date().toLocaleTimeString(),
        model: selectedModel,
      };

      // Show reasoning indicator for reasoning models
      if (modelSupports(selectedModel, "reasoning")) {
        assistantMessage.content = "🧠 Thinking deeply about this...";
        setMessages((prev) => [assistantMessage, ...prev]);
      } else if (enableStreaming && modelSupports(selectedModel, "streaming")) {
        setMessages((prev) => [assistantMessage, ...prev]);
      }

      const aiResponse = await window.puter.ai.chat(puterMessages, options);

      if (
        enableStreaming &&
        modelSupports(selectedModel, "streaming") &&
        aiResponse[Symbol.asyncIterator]
      ) {
        let fullContent = "";
        for await (const part of aiResponse) {
          if (part?.text) {
            fullContent += part.text;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, content: fullContent }
                  : msg,
              ),
            );
          }
        }
        assistantMessage.content = fullContent;
      } else {
        if (
          aiResponse.message?.tool_calls &&
          enableFunctions &&
          modelSupports(selectedModel, "functions")
        ) {
          const toolCall = aiResponse.message.tool_calls[0];
          const functionResult = executeFunction(
            toolCall.function.name,
            JSON.parse(toolCall.function.arguments),
          );
          const finalResponse = await window.puter.ai.chat(
            [
              ...puterMessages,
              aiResponse.message,
              {
                role: "tool",
                tool_call_id: toolCall.id,
                content: functionResult,
              },
            ],
            { model: selectedModel },
          );
          assistantMessage.content =
            finalResponse.message?.content || finalResponse;
          assistantMessage.functionUsed = toolCall.function.name;
        } else {
          assistantMessage.content =
            aiResponse.message?.content || aiResponse.toString();
        }

        if (!enableStreaming || !modelSupports(selectedModel, "streaming")) {
          setMessages((prev) => [assistantMessage, ...prev]);
        } else {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id ? assistantMessage : msg,
            ),
          );
        }
      }
    } catch (error) {
      setError(error.message);
      const errorMsg = {
        id: generateMessageId(),
        role: "error",
        content: `Error: ${error.message}`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [errorMsg, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    currentMessage,
    setCurrentMessage,
    isLoading,
    error,
    setError,
    chatMode,
    setChatMode,
    imageUrl,
    setImageUrl,
    enableFunctions,
    setEnableFunctions,
    enableStreaming,
    setEnableStreaming,
    modelCapabilities,
    handleNewChat,
    handleSendMessage,
    handleResend,
    handleCopy,
    handleDelete,
  };
}

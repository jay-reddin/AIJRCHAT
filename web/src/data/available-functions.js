export const availableFunctions = {
  get_weather: {
    name: "get_weather",
    description: "Get current weather information for a specific location",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "City name (e.g., Paris, London, New York)",
        },
      },
      required: ["location"],
    },
  },
  calculate: {
    name: "calculate",
    description: "Perform mathematical calculations",
    parameters: {
      type: "object",
      properties: {
        expression: {
          type: "string",
          description:
            "Mathematical expression to evaluate (e.g., '2+2', '10*5', 'sqrt(16)')",
        },
      },
      required: ["expression"],
    },
  },
  get_current_time: {
    name: "get_current_time",
    description: "Get the current date and time",
    parameters: {
      type: "object",
      properties: {
        timezone: {
          type: "string",
          description: "Timezone (optional, defaults to local)",
        },
      },
    },
  },
};

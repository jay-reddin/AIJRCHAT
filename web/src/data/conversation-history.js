export const conversationHistory = {
  messages: [
    {
      id: 1,
      role: "user",
      content:
        "an AI chat app for AI using Puter.com's AI Models. Have the app both natively Mobile and desktop compatible. Have a header with a + button to start a new chat, a drop down menu to select active AI Model and a settings icon button. below have a text display box where the users text prompts are on the right - (with timestamp above every message and below each message, resend, copy, delete icon buttons to function as needed), to the left have the AI Models Text responses with - Models name and timestamp above every response, resend, copy and delete icon buttons below), Organise the message text display box from newest message up top and older below in a scrollable box with hidden scrollbars and a 2px rounded border box, make the display box auto size to the devices display frame minus other app elements. Below this and have persistent on screen a text input box for user to type text and a send button to send the users text to the AI Model - Also user pressing the enter or return key sends the inputted text. When the Resend button is pressed below any message in the text display box have the messages text repopulate the text input box so user can resend or edit before sending. below this have a small text footer: Created By Jamie Reddin (Make Jamie Reddin a link to: https://jayreddin.github.io) using Puter.com - (Make Puter.com a link to https://puter.com) | Version: 1.0 When the settings icon button is pressed in the header have a popup appear with Tabs for various app settings: Tab 1 : UI - Theme: dropdown menu and user can select light or dark mode, Text Size - Slider where user can slide app wide text size from 1%-100% default size is 50%. Also Clicking outside the settings Pop up card dismisses it and cancels users changed settings. Tab 2: AI - Models available should appear in a Display boxes that's scrollable and organised a box per provider (OpenAI, Claude, DeepSeek, Gemini, Llama, Grok, Mistral, Qwen) each model should have a check box that a user can select to add the Model to the Model Select Dropdown box on the main UI header.",
      timestamp: "2:30 PM",
    },
    {
      id: 2,
      role: "assistant",
      content:
        "I'll create an AI chat app for you using Puter.com's models with all the features you specified! This sounds like an exciting project with comprehensive functionality.",
      timestamp: "2:31 PM",
    },
  ],
};

# Puter.js API Reference

Puter.js is a JavaScript SDK that enables developers to build full-stack web applications directly from the frontend, eliminating the need for backend code.

## Installation
Include a single script tag to access cloud and AI services:
```html
<script src="https://js.puter.com/v2/"></script>
```

## Key Features and Methods

### File Storage (FileSystem)
Manage files in the cloud:
- `puter.fs.write()` - Create or update files
- `puter.fs.read()` - Retrieve file contents

### Key-Value Store
Store and retrieve simple data:
- `puter.kv.set()` - Store data
- `puter.kv.get()` - Retrieve data

### AI Integration

#### Chat with GPT-3.5 Turbo
```javascript
puter.ai.chat()
```
Use this method to interact with AI models.

#### Image Generation with DALL·E
```javascript
puter.ai.txt2img()
```
Generate images based on text prompts.

### Hosting
Host static websites:
- Create directories and files
- Use `puter.hosting.create()` to publish under a subdomain

### Authentication
Implement user authentication:
- `puter.auth.signIn()` - Manage user sessions

## Documentation Links
- Official Documentation: https://docs.puter.com/
- GitHub Repository: https://github.com/HeyPuter/puter.js

## Usage in Current Project
The current project uses Puter.js for:

### Authentication
- `usePuterAuth` hook for user authentication
- User sign-in/sign-out functionality
- Session management

### AI Chat Integration
- `window.puter.ai.chat()` method for AI conversations
- Support for multiple model providers including OpenRouter
- Streaming responses for real-time chat
- Function calling capabilities
- Vision model support for image analysis

### OpenRouter Integration
The project has extensive OpenRouter model support with 289+ models including:
- **Anthropic**: Claude models (2.1, 3, 3.5, 3.7, 4)
- **OpenAI**: GPT models (3.5, 4, 4o, o1, o3, o4)
- **Google**: Gemini and Gemma models
- **Meta**: Llama models (3, 3.1, 3.2, 3.3, 4)
- **DeepSeek**: Chat and reasoning models
- **Mistral**: Various model sizes
- **Qwen**: Latest models including reasoning variants
- **Many others**: Including specialized and fine-tuned models

### Model Capabilities System
The app includes a sophisticated model capabilities system that tracks:
- **Streaming**: Real-time response support
- **Functions**: Tool/function calling ability
- **Vision**: Image analysis capabilities
- **Reasoning**: Advanced reasoning model indicators
- **Image Generation**: Text-to-image functionality

### Current Implementation
- Models are defined in `web/src/data/ai-models.js`
- OpenRouter models are prefixed with `openrouter:`
- Default enabled models can be configured
- Model selection UI with capability indicators

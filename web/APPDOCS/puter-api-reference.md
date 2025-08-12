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
The current project uses Puter.js for authentication in the `usePuterAuth` hook and related components.

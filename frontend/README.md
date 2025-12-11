# ScrapeSense Frontend (Chrome Extension)

A React-based Chrome extension that provides AI-powered web scraping and chatbot assistance on any website.

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Chrome browser (for extension testing)

### Installation

```bash
cd frontend
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

### Build

Build the extension:

```bash
npm run build
```

Output is in `dist/` directory.

### Load Extension in Chrome

1. Open `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `dist/` folder
5. Extension should appear in your extensions list

## Project Structure

```
frontend/
├── src/
│   ├── extension/
│   │   ├── popup-ui.tsx      # Popup entry point
│   │   ├── content.ts        # Content script
│   │   ├── background.ts     # Service worker
│   │   └── ui.tsx            # Webpage injection (legacy)
│   ├── components/
│   │   └── ChatPanel.tsx      # Main chatbot component
│   ├── styles/
│   │   └── ChatPanel.css      # Component styling
│   └── main.tsx
├── public/
│   ├── manifest.json         # Extension manifest
│   ├── popup.html            # Popup UI
│   └── icons/                # Extension icons
├── dist/                     # Built extension
├── package.json
├── vite.config.ts           # Build configuration
└── tsconfig.json
```

## Features

- 💬 **AI Chat** - Ask questions about any webpage
- 📄 **Content Summarization** - Get instant summaries
- 🔍 **Information Extraction** - Find specific data
- 🎨 **Clean UI** - Modern, responsive design
- ⚡ **Fast** - Lightning-quick response times
- 🔒 **Secure** - Privacy-focused, no data logging

## Architecture

### Popup (`popup.html` → `popup-ui.tsx`)
- Main entry point when user clicks the extension icon
- Displays ChatPanel component in 450×600px popup
- Loads styling from `style.css`

### Content Script (`content.ts`)
- Minimal script that runs on every page
- Extracts page content (title, text, metadata)
- Responds to requests from popup/background

### Background Service Worker (`background.ts`)
- Handles message routing between popup and content scripts
- Stores page content temporarily
- Manages extension state

### ChatPanel Component
- React component with message history
- Auto-scrolling conversation view
- Input handling and AI response simulation
- Typing indicators and timestamps

## Styling

Uses CSS isolation with `all: initial !important` to prevent website CSS interference.

Color scheme:
- Header: Purple gradient (#667eea → #764ba2)
- Body: Light gray/white
- Messages: Blue (user), Gray (assistant)

## Development Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build extension
- `npm run lint` - Run ESLint
- `npm run preview` - Preview build

## Chrome Extension APIs Used

- `chrome.runtime.sendMessage()` - Message passing
- `chrome.runtime.onMessage()` - Message listening
- `chrome.tabs.query()` - Tab access
- `chrome.storage.local` - Persistent storage
- Extension permissions: `scripting`, `activeTab`, `storage`

## Integration with Backend

Currently uses placeholder responses. To integrate with ScrapeSense backend:

1. Update `ChatPanel.tsx` `simulateAIResponse()` function
2. Add API calls to `http://localhost:3000/api/chat`
3. Send page content and user message
4. Process and display AI response

Example:
```typescript
const response = await fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    message: userInput, 
    pageContent: pageData 
  })
});
```

## License

MIT

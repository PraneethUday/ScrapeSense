# ScrapeSense Chrome Extension

A React + TypeScript-based Chrome extension that provides an AI-powered web assistant. ScrapeSense appears as a chatbot panel on the right side of any webpage, allowing you to:

- **Summarize page content** - Get quick summaries of long articles
- **Ask questions** - Query the AI about anything on the page
- **Extract information** - Pull out specific data from web pages
- **AI-powered answers** - Connect to ChatGPT, Claude, or other AI services

## Project Structure

```
src/
├── extension/
│   ├── content.ts        # Content script (injected into all pages)
│   ├── background.ts     # Service worker (background tasks)
│   └── ui.tsx            # React app entry point
├── components/
│   └── ChatPanel.tsx     # Main chat UI component
└── styles/
    └── ChatPanel.css     # Chatbot styling

public/
├── manifest.json         # Chrome extension manifest
├── popup.html            # Extension popup UI
└── icons/                # Extension icons (add here)
```

## Build Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Extension

```bash
npm run build
```

This will generate all extension files in the `dist/` directory:

- `dist/ui.js` - React UI component
- `dist/content.js` - Content script
- `dist/background.js` - Service worker

### 3. Load Extension in Chrome

1. Open Chrome and navigate to: `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top-right corner)
3. Click **"Load unpacked"**
4. Select the `dist/` folder from your ScrapeSense project
5. The extension is now loaded and ready to use!

## Development

For development with hot reloading:

```bash
npm run dev
```

This will start the Vite development server. You'll need to rebuild and reload the extension after changes.

## Features Implemented (UI Only)

✅ Beautiful gradient-based UI design
✅ Real-time message streaming
✅ Typing indicators
✅ Message history
✅ Responsive design
✅ Dark mode support
✅ Smooth animations
✅ Keyboard shortcuts (Shift+Enter for new line)
✅ Auto-scrolling messages
✅ Clear chat button

## Next Steps (To Connect AI)

1. **Add OpenAI/Claude API Integration**

   - Create API key from OpenAI or Anthropic
   - Store securely in Chrome storage
   - Implement API calls in the `simulateAIResponse` function

2. **Enhance Page Content Extraction**

   - Use DOM parsing libraries for better extraction
   - Handle different content types
   - Implement better text summarization

3. **Add Settings/Configuration**

   - AI provider selection
   - API key management
   - Theme preferences

4. **Create Extension Icons**
   - Add 16x16, 48x48, and 128x128 PNG icons
   - Place in `public/icons/` folder

## API Configuration

The extension is ready to connect to any AI API. Currently, it has a placeholder response. To integrate with ChatGPT or Claude:

1. Update `src/extension/background.ts` with your API calls
2. Use Chrome's `storage` API to securely store API keys
3. Implement request/response handling in `ChatPanel.tsx`

Example AI integration (to be implemented):

```typescript
const response = await chrome.runtime.sendMessage({
  type: "QUERY_AI",
  query: userMessage,
  context: pageContent,
  provider: "chatgpt", // or 'claude'
});
```

## Manifest Permissions

The extension requests minimal permissions:

- `scripting` - To inject UI into pages
- `activeTab` - To access current tab info
- `storage` - To store settings and API keys
- `<all_urls>` - To run on any website

## Browser Support

- Chrome/Chromium: ✅ Tested
- Edge: ✅ Should work (Chromium-based)
- Firefox: ⚠️ Requires manifest v2 conversion
- Safari: ⚠️ Requires app packaging

## License

See LICENSE file for details.

## Author

Created as a React + TypeScript Chrome extension template.

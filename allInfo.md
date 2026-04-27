# ScrapeSense — Complete Project Documentation

## What Is ScrapeSense?

ScrapeSense is an AI-powered browser assistant that lets you have a real conversation with any webpage you're visiting. Instead of manually reading through long articles, documentation, product pages, or tables, you open the extension, ask questions in plain English, and get direct answers — all powered by Google Gemini AI with full awareness of the page you're on.

The core insight behind the project: browsers already have access to every word on a page. ScrapeSense bridges that raw page data to an AI model, turning passive reading into an interactive Q&A session without ever leaving the browser.

---

## The Problem It Solves

When browsing the web you often encounter:

- Long articles where you only need one specific fact
- Documentation pages with dozens of sections where you just need the relevant part
- Product pages with tables of specs you want compared or summarized
- Research material you want to query without copy-pasting into ChatGPT

Traditional approaches require you to: copy text, open a separate AI tool, paste, ask, come back. ScrapeSense collapses that into a single click — the AI already has the page context the moment you open the popup.

---

## Core Idea & Architecture

ScrapeSense is a **monorepo** with two independent but connected parts:

```
ScrapeSense/
├── frontend/     → Chrome Extension (React + Vite + TypeScript)
└── backend/      → REST API Server (Node.js + Express + TypeScript)
```

**How it works end-to-end:**

1. You visit any webpage and click the ScrapeSense extension icon
2. The popup opens (450×600px chat window)
3. A content script silently extracts the page title, URL, visible text, HTML, and metadata
4. The chat panel shows which page is loaded and waits for your question
5. You type a question and hit Enter
6. The extension sends your message + full page content + conversation history to the backend
7. The backend feeds everything to Google Gemini AI with a system prompt providing context
8. Gemini responds with a targeted answer, which appears in the chat
9. You keep the conversation going — full history is maintained in memory

---

## Tech Stack

### Frontend — Chrome Extension

| Layer | Technology | Version |
|---|---|---|
| Language | TypeScript | ~5.9.3 |
| UI Framework | React | ^19.2.0 |
| Build Tool | Vite | ^7.2.4 |
| Chrome API Types | @types/chrome | ^0.1.32 |
| Linting | ESLint + typescript-eslint | ^9.39.1 / ^8.46.4 |
| Extension Standard | Manifest v3 | — |

### Backend — API Server

| Layer | Technology | Version |
|---|---|---|
| Language | TypeScript | ^5.3.3 |
| Runtime | Node.js | 18+ |
| Framework | Express.js | ^4.18.2 |
| AI SDK | @google/generative-ai | ^0.24.1 |
| AI Model | Google Gemini 2.0 Flash | — |
| Security | Helmet.js | ^7.1.0 |
| CORS | cors | ^2.8.5 |
| Logging | Morgan | ^1.10.0 |
| Environment | dotenv | ^16.3.1 |
| Dev Runner | tsx | ^4.7.0 |
| Testing | Vitest | ^1.1.0 |

---

## Project Structure In Detail

```
ScrapeSense/
├── frontend/
│   ├── public/
│   │   ├── manifest.json           Extension configuration (Manifest v3)
│   │   ├── popup.html              450×600px popup shell
│   │   └── icons/
│   │       ├── icon-16.svg
│   │       ├── icon-48.svg
│   │       └── icon-128.svg
│   ├── src/
│   │   ├── extension/
│   │   │   ├── popup-ui.tsx        React root — mounts ChatPanel into popup
│   │   │   ├── content.ts          Content script — extracts page data
│   │   │   ├── background.ts       Service worker — message routing + tab storage
│   │   │   └── ui.tsx              Legacy webpage injection component
│   │   └── components/
│   │       ├── ChatPanel.tsx       Core chat component (317 lines)
│   │       └── styles/
│   │           └── ChatPanel.css   Isolated styles (406 lines)
│   ├── vite.config.ts              Multi-entry Vite build for extension scripts
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── server.ts               Main Express app + all endpoints (174 lines)
    │   ├── routes/                 Placeholder for future route files
    │   ├── controllers/            Placeholder for future handlers
    │   ├── services/               Placeholder for future business logic
    │   └── utils/                  Placeholder for future helpers
    ├── .env.example                Environment variable template
    └── package.json
```

---

## The Frontend — Chrome Extension

### Extension Architecture (Manifest v3)

The extension uses Chrome's modern Manifest v3 standard with three distinct execution contexts:

**1. Service Worker (`background.ts`)**

Runs persistently in the background. Its job is message routing — it listens for messages from content scripts (page data), stores them keyed by tab ID, and cleans up when tabs close. It acts as a message bus between the popup and the content script.

**2. Content Script (`content.ts`)**

Injected into every webpage. When the popup sends a `GET_PAGE_CONTENT` message, the content script reads the live DOM and collects:
- Page title
- Current URL
- Full HTML (capped at 50,000 characters)
- Visible text content (capped at 20,000 characters)
- Meta description, keywords, and author

These caps prevent memory and bandwidth issues when dealing with very large pages.

**3. Popup (`popup-ui.tsx` → `ChatPanel.tsx`)**

The chat interface rendered in the popup window. Built entirely in React.

### ChatPanel Component

The heart of the frontend. Key behaviors:

- **Page loading:** On mount, calls `chrome.tabs.sendMessage` to request page content from the content script. Displays the loaded page title once received.
- **Message state:** Each message has an `id`, `type` (user/assistant), `content`, and `timestamp`.
- **Sending a message:** Appends the user message to local state, sets loading to true, disables the input, calls the backend `/api/chat` endpoint with the message, page content, and full conversation history, then appends the AI response.
- **Typing indicator:** Shows animated dots while waiting for the backend response.
- **Auto-scroll:** `useRef` on the message container, scrolled on every state update.
- **Input behavior:** Enter sends, Shift+Enter adds a newline. Textarea auto-resizes up to 120px.
- **Clear chat:** Resets message state but keeps page content loaded.

### CSS Isolation

A deliberate design choice: the popup applies `all: initial !important` as a CSS reset to prevent any styles from the currently-visited webpage leaking into the extension UI. This ensures consistent appearance regardless of what site you're on.

**Color palette:**
- Header: `#667eea` (blue) → `#764ba2` (purple) gradient
- User messages: Blue bubble
- Assistant messages: Light gray bubble
- Background: White / light gray

### Vite Build Configuration

Vite is configured with multiple entry points to produce separate output bundles — one per extension context:

| Entry | Output | Purpose |
|---|---|---|
| `popup-ui.tsx` | `popup-ui.js` | Popup React app |
| `content.ts` | `content.js` | Content script |
| `background.ts` | `background.js` | Service worker |
| `ui.tsx` | `ui.js` | Legacy inject component |

This is necessary because Chrome extensions require each script context to be a separate file. Vite's rollup bundler handles this cleanly.

**Build output sizes:**
- `ChatPanel-[hash].js` — ~562KB uncompressed, ~99.78KB gzipped
- `style.css` — 9.12KB uncompressed, 1.79KB gzipped
- Total extension package — ~108KB gzipped

---

## The Backend — Express API Server

### Server Setup

Built with Express and TypeScript. Middleware stack:

- `helmet()` — sets security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- `cors()` — configured with `CORS_ORIGINS` from environment to whitelist the extension's origin
- `morgan()` — HTTP request logging
- `express.json()` — JSON body parsing

### Endpoints

#### `GET /health`

Simple liveness check. Returns:

```json
{
  "status": "ok",
  "message": "ScrapeSense API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### `POST /api/chat`

Main endpoint. Receives a user message, optional page content, and optional conversation history. Calls Google Gemini AI and returns the response.

**Request body:**
```json
{
  "message": "What is the main argument of this article?",
  "pageContent": {
    "title": "Page Title",
    "url": "https://example.com",
    "html": "...",
    "text": "...",
    "metadata": {
      "description": "...",
      "keywords": "...",
      "author": "..."
    }
  },
  "conversationHistory": [
    { "role": "user", "content": "Previous question" },
    { "role": "assistant", "content": "Previous answer" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "msg_1234567890",
    "type": "assistant",
    "content": "The main argument is...",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "usage": {
      "promptTokenCount": 450,
      "candidatesTokenCount": 120,
      "totalTokenCount": 570
    }
  }
}
```

#### `POST /api/analyze`

Placeholder endpoint for future page analysis (currently returns stub data). Intended to provide summary, key points, entities, and sentiment without a user prompt.

### Gemini AI Integration

The backend uses `@google/generative-ai` SDK. For each chat request:

1. Initializes a `GenerativeModel` with `gemini-2.0-flash`
2. Builds a system prompt that includes the page title, URL, and full page text
3. Calls `model.startChat()` with the formatted conversation history and generation config:
   - `maxOutputTokens: 1000`
   - `temperature: 0.7`
4. Sends the user's message via `chat.sendMessage()`
5. Returns the response text and token usage metadata

The system prompt grounds the model in the current page context, instructing it to answer based on the page content and clearly state when information isn't present on the page.

### Environment Variables

```bash
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
CORS_ORIGINS=http://localhost:3000,chrome-extension://YOUR_EXTENSION_ID
LOG_LEVEL=debug
```

---

## Data Flow Diagram

```
User opens extension popup
         │
         ▼
popup-ui.tsx mounts ChatPanel
         │
         ▼
ChatPanel sends GET_PAGE_CONTENT via chrome.tabs.sendMessage()
         │
         ▼
content.ts extracts DOM data (title, URL, HTML, text, metadata)
         │
         ▼
Data returned to ChatPanel via message callback
         │
         ▼
Popup shows "Loaded: [Page Title]" status
         │
         ▼
User types message + presses Enter
         │
         ▼
ChatPanel appends user message to state, shows typing indicator
         │
         ▼
fetch("http://localhost:3000/api/chat") POST with:
  - message
  - pageContent (full extracted data)
  - conversationHistory (all prior messages)
         │
         ▼
Express server receives request
         │
         ▼
Gemini AI called with system context + conversation history
         │
         ▼
AI response returned (text + token usage)
         │
         ▼
Backend sends JSON response to extension
         │
         ▼
ChatPanel appends assistant message, hides typing indicator
         │
         ▼
User continues conversation (history maintained in React state)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API key (from [Google AI Studio](https://aistudio.google.com/))
- Google Chrome browser

### 1. Clone & Install

```bash
git clone <repo-url>
cd ScrapeSense

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 2. Configure the Backend

```bash
cd backend
cp .env.example .env
# Edit .env and set your GEMINI_API_KEY
```

### 3. Start the Backend

```bash
cd backend
npm run dev
# Server starts on http://localhost:3000
```

### 4. Build the Frontend Extension

```bash
cd frontend
npm run build
# Output goes to frontend/dist/
```

### 5. Load the Extension in Chrome

1. Open `chrome://extensions/`
2. Toggle on **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `frontend/dist/` folder
5. The ScrapeSense icon appears in your Chrome toolbar

### 6. Use It

- Navigate to any webpage
- Click the ScrapeSense icon
- Wait for "Loaded: [page title]" to appear in the popup
- Type any question about the page and press Enter

---

## Build Scripts Reference

### Frontend

```bash
npm run dev      # Vite dev server (for component development)
npm run build    # TypeScript check + Vite production build → dist/
npm run lint     # ESLint
npm run preview  # Preview the built output
```

### Backend

```bash
npm run dev      # tsx watch — hot reload during development
npm run build    # tsc — compile TypeScript to dist/
npm start        # node dist/server.js — run compiled server
npm run lint     # ESLint
npm test         # Vitest test runner
```

---

## Key Design Decisions

### Why a Chrome Extension?

A browser extension has native access to the DOM of any page the user visits. No scraping from outside, no CORS issues, no need to re-fetch the page. The content script runs in the page's context and reads what's already rendered.

### Why a Separate Backend?

The Gemini API key cannot be shipped inside the extension bundle — it would be trivially extractable from the packaged `.crx` file. All AI calls go through the backend server which holds the key in a server-side environment variable.

### Why Gemini 2.0 Flash?

Flash is optimized for speed and cost at conversational response lengths. For the use case of answering questions about a page (typically short to medium answers), it is faster and cheaper than larger models while still being capable.

### Why React 19 + Vite for an Extension?

React provides component lifecycle management for the chat state (messages, loading state, auto-scroll). Vite's multi-entry build handles the unusual requirement of building multiple independent JS bundles from a single project. TypeScript across both packages catches integration bugs at compile time.

### CSS Isolation Strategy

Website stylesheets can interfere with extension popups. The `all: initial !important` reset on the root container ensures the extension always looks correct regardless of how aggressive a site's CSS is.

### Content Limits

Raw HTML for modern websites can easily be several megabytes. Capping at 50KB HTML and 20KB text keeps API payloads manageable, keeps token counts reasonable for the AI, and prevents slow requests while still providing the AI with enough context to answer most questions accurately.

---

## Extension Permissions Explained

| Permission | Why It's Needed |
|---|---|
| `scripting` | Execute content scripts to read page DOM |
| `activeTab` | Access the current active tab's content |
| `storage` | Store and retrieve page content between extension contexts |
| `<all_urls>` | Allow content script injection on any website |

---

## Limitations & Known Constraints

- **Localhost dependency:** The backend URL is hardcoded to `http://localhost:3000`. The extension requires the backend to be running on the same machine.
- **In-memory history only:** Conversation history lives in React component state. Closing and reopening the popup clears all history.
- **Page load timing:** If the content script fires before a JavaScript-heavy page fully renders, some dynamic content may not be captured.
- **`/api/analyze` is a stub:** The content analysis endpoint currently returns placeholder data — not yet wired to Gemini.
- **Single session:** No user authentication, no multi-device sync, no persistent storage across sessions.

---

## Future Expansion Areas

The backend has scaffolded directories for a more structured architecture:

- `src/routes/` — Move endpoints into separate route files as the API grows
- `src/controllers/` — Separate request/response handling from business logic
- `src/services/` — AI provider abstraction, history persistence, caching
- `src/utils/` — Shared helpers (text cleaning, token estimation, etc.)

Planned features indicated by the codebase structure:
- Complete the `/api/analyze` endpoint for one-click page summaries
- Persist conversation history to `chrome.storage.local`
- Support selecting text on a page to ask questions about a specific excerpt
- Configurable backend URL via extension options page

---

## Project Stats

| Metric | Value |
|---|---|
| Total source files | ~20 |
| Frontend source lines | ~800 (TSX + CSS) |
| Backend source lines | ~175 |
| Extension manifest version | 3 |
| AI model | Gemini 2.0 Flash |
| License | MIT |
| Repo structure | Monorepo (frontend + backend) |

---

## License

MIT — see [LICENSE](LICENSE) for the full text.

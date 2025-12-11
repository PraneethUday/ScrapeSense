# ScrapeSense Development Guide

## Project Overview

ScrapeSense is organized as a monorepo with two main components:

- **Frontend**: Chrome extension (React + Vite)
- **Backend**: Node.js API server (Express)

## Directory Structure

```
ScrapeSense/
├── .git/                    # Git repository
├── .gitignore              # Git ignore rules
├── LICENSE                 # MIT License
├── README.md               # Main documentation
│
├── frontend/               # Chrome Extension
│   ├── src/
│   │   ├── extension/      # Extension-specific code
│   │   │   ├── popup-ui.tsx      # Popup entry point
│   │   │   ├── content.ts        # Content script
│   │   │   ├── background.ts     # Service worker
│   │   │   └── ui.tsx            # Legacy webpage injection
│   │   ├── components/
│   │   │   └── ChatPanel.tsx     # Main chat component
│   │   ├── styles/
│   │   │   └── ChatPanel.css     # Component styling
│   │   ├── main.tsx              # App entry
│   │   └── App.tsx               # Root component
│   ├── public/
│   │   ├── manifest.json         # Extension manifest v3
│   │   ├── popup.html            # Popup UI template
│   │   └── icons/                # SVG icons (16, 48, 128px)
│   ├── dist/                     # Built extension (generated)
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts           # Build configuration
│   ├── eslint.config.js
│   ├── README.md
│   └── index.html               # Dev page
│
└── backend/                # Node.js Server
    ├── src/
    │   ├── server.ts            # Main Express app
    │   ├── routes/              # API routes (future)
    │   ├── controllers/         # Request handlers (future)
    │   ├── services/            # Business logic (future)
    │   └── utils/               # Helper functions (future)
    ├── dist/                    # Compiled JS (generated)
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    ├── .env.example
    ├── .gitignore
    ├── .eslintrc.json
    ├── README.md
    └── node_modules/
```

## Setup Instructions

### Initial Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ScrapeSense.git
   cd ScrapeSense
   ```

2. **Install dependencies**

   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend (new terminal)
   cd backend
   npm install
   ```

3. **Configure environment** (optional, for backend)
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your API keys
   ```

## Running the Application

### Option 1: Frontend Only (No Backend)

This runs the extension with placeholder responses.

```bash
cd frontend

# Build the extension
npm run build

# Output in: frontend/dist/
```

Then load in Chrome:

1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `frontend/dist/`

### Option 2: Frontend + Backend

Run both services for full functionality.

**Terminal 1 - Backend Server:**

```bash
cd backend
npm run dev
# Server runs on http://localhost:3000
```

**Terminal 2 - Build Frontend:**

```bash
cd frontend
npm run build
```

Then load extension in Chrome (same steps as above).

### Development Mode (Frontend)

For rapid frontend development with hot reload:

```bash
cd frontend
npm run dev
# Vite dev server on http://localhost:5173
```

Note: This is for component development. The extension popup must be loaded from `dist/`.

## Development Workflow

### Making Changes to the Extension

1. **Edit files in `frontend/src/`**

   - Components in `src/components/`
   - Styles in `src/styles/`
   - Extension code in `src/extension/`

2. **Build the extension**

   ```bash
   cd frontend
   npm run build
   ```

3. **Reload in Chrome**

   - Go to `chrome://extensions/`
   - Find ScrapeSense
   - Click the reload icon

4. **Test the extension**
   - Click the extension icon
   - Check if changes appear

### Making Changes to the Backend

1. **Edit files in `backend/src/`**

   - Main server: `src/server.ts`
   - API routes: `src/routes/` (create as needed)
   - Services: `src/services/` (create as needed)

2. **Development server with auto-reload**

   ```bash
   cd backend
   npm run dev
   ```

   Changes automatically reload the server.

3. **Build for production**
   ```bash
   cd backend
   npm run build
   npm start
   ```

## Code Guidelines

### Frontend (React/TypeScript)

- Use functional components with hooks
- Component files in `src/components/`
- Style files parallel to components
- Use TypeScript for type safety
- Follow ESLint rules

Example component:

```typescript
// src/components/MyComponent.tsx
import React, { useState } from "react";
import "./MyComponent.css";

export const MyComponent: React.FC = () => {
  const [state, setState] = useState("initial");

  return <div className="my-component">{state}</div>;
};
```

### Backend (Node/Express)

- Use async/await
- Add types for all functions
- Use middleware appropriately
- Validate all inputs
- Follow HTTP best practices

Example endpoint:

```typescript
// Backend endpoint
app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    // Process request
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ error: "Message" });
  }
});
```

## Build Process

### Frontend Build

```bash
cd frontend
npm run build
```

**What it does:**

1. Runs TypeScript compiler (`tsc -b`)
2. Bundles with Vite
3. Creates multiple entry points:
   - `popup-ui.js` - Popup entry (imports ChatPanel.js)
   - `content.js` - Content script
   - `background.js` - Service worker
   - `ui.js` - Legacy webpage injection
4. Generates `style.css` from all CSS imports
5. Copies static files from `public/`
6. Output: `frontend/dist/`

**Output files:**

```
dist/
├── popup-ui.js          # Popup initialization
├── ChatPanel-*.js       # React bundle (~562KB)
├── content.js           # Content script
├── background.js        # Service worker
├── ui.js                # Legacy injection
├── style.css            # All styles combined
├── popup.html           # Popup template
├── manifest.json        # Extension manifest
├── icons/               # SVG icons
└── assets/              # CSS/assets
```

### Backend Build

```bash
cd backend
npm run build
```

**What it does:**

1. Runs TypeScript compiler
2. Outputs JavaScript to `dist/`

**To run compiled version:**

```bash
npm start
```

## Testing

### Frontend Testing

```bash
cd frontend
npm run lint    # Check code quality
```

### Backend Testing

```bash
cd backend
npm run lint    # Check code quality
npm test        # Run tests (vitest)
```

## Debugging

### Frontend (Extension)

1. **View extension logs:**

   - Right-click extension icon → "Inspect popup"
   - View console in DevTools

2. **Inspect popup:**

   - Click extension icon
   - Right-click → "Inspect"
   - Inspect HTML/CSS/JS

3. **View service worker:**

   - Go to `chrome://extensions/`
   - Find ScrapeSense
   - Click "Service worker" link

4. **View content script:**
   - Open any webpage
   - Right-click → "Inspect"
   - Console shows content script messages

### Backend (Server)

1. **View logs:**

   ```bash
   npm run dev
   # Logs printed to console
   ```

2. **Test endpoints:**

   ```bash
   # Health check
   curl http://localhost:3000/health

   # Chat endpoint
   curl -X POST http://localhost:3000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"hello"}'
   ```

## Common Issues

### Extension Won't Load

**Error:** "Manifest is not valid"

**Solution:**

1. Check `public/manifest.json` syntax
2. Rebuild: `npm run build`
3. Reload extension in Chrome

### Blank Popup

**Problem:** Extension icon shows but popup is empty

**Solution:**

1. Rebuild: `npm run build`
2. Hard reload in Chrome: `Ctrl+Shift+R`
3. Check console: Right-click extension → "Inspect popup"

### Backend Won't Connect

**Problem:** Extension can't reach backend server

**Solution:**

1. Verify backend is running: `npm run dev`
2. Check port is 3000
3. Verify CORS settings in `backend/src/server.ts`
4. Check browser console for network errors

### Build Errors

**Problem:** TypeScript compilation fails

**Solution:**

1. Check file exists
2. Verify imports are correct
3. Rebuild: `npm run build`
4. Check tsconfig.json

## Performance Optimization

### Frontend

- Bundle analyzed in `dist/`
- Main bundle: ~562KB (101KB gzipped)
- CSS: 9.12KB (1.79KB gzipped)
- Minification disabled for debugging

### Backend

- Use request compression
- Implement caching
- Optimize database queries (future)
- Add rate limiting (future)

## Deployment

### Frontend (Chrome Web Store)

1. Build extension: `npm run build`
2. Zip `frontend/dist/`
3. Upload to Chrome Web Store
4. Fill in store listing
5. Submit for review

### Backend (Hosting)

Options:

- Heroku
- AWS EC2/Lambda
- DigitalOcean
- Railway
- Vercel (Node.js support)

Build and deploy:

```bash
cd backend
npm run build
npm start
```

## Contributing

1. Create a feature branch: `git checkout -b feature/xyz`
2. Make changes
3. Lint: `npm run lint`
4. Test: `npm test` (backend)
5. Build: `npm run build`
6. Commit: `git commit -m "Add feature"`
7. Push: `git push origin feature/xyz`
8. Create Pull Request

## Resources

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev)

## Support

- Check existing issues
- Review documentation
- Ask in discussions
- Create detailed bug report

---

**Happy coding! 🚀**

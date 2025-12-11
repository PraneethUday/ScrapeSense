# Quick Reference Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

```bash
# Frontend
cd frontend && npm install

# Backend (new terminal)
cd backend && npm install
```

### 2. Start Services

```bash
# Terminal 1: Backend
cd backend
npm run dev
# Server: http://localhost:3000

# Terminal 2: Frontend Build
cd frontend
npm run build
```

### 3. Load Extension in Chrome

1. Go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select `frontend/dist/`
5. Done! 🎉

---

## 📁 File Structure at a Glance

```
ScrapeSense/
├── LICENSE              ← MIT License
├── README.md           ← Main documentation
├── DEVELOPMENT.md      ← Dev guide (detailed)
│
├── frontend/           ← Chrome Extension
│   ├── src/
│   │   ├── components/ChatPanel.tsx     ← Main UI
│   │   ├── extension/popup-ui.tsx       ← Popup entry
│   │   ├── extension/content.ts         ← Content script
│   │   └── extension/background.ts      ← Service worker
│   ├── public/manifest.json             ← Extension config
│   └── dist/                            ← Built extension
│
└── backend/            ← Node.js Server
    └── src/server.ts   ← API server
```

---

## 💻 Common Commands

### Frontend

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Build extension for Chrome |
| `npm run lint` | Check code quality |
| `npm run preview` | Preview build |

### Backend

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server with auto-reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run production build |
| `npm run lint` | Check code quality |
| `npm test` | Run tests |

---

## 🔌 API Endpoints

**Base URL:** `http://localhost:3000`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Server status |
| POST | `/api/chat` | Send message |
| POST | `/api/analyze` | Analyze content |

### Example Requests

```bash
# Health check
curl http://localhost:3000/health

# Send chat message
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"hello","pageContent":"..."}'
```

---

## 🎯 Key Files

### Frontend
- **`frontend/src/components/ChatPanel.tsx`** - Main chat interface
- **`frontend/src/extension/popup-ui.tsx`** - Popup initialization
- **`frontend/public/manifest.json`** - Extension configuration
- **`frontend/public/popup.html`** - Popup template
- **`frontend/vite.config.ts`** - Build configuration

### Backend
- **`backend/src/server.ts`** - Main API server
- **`backend/.env.example`** - Environment template
- **`backend/package.json`** - Dependencies & scripts

---

## 🔧 Environment Setup

### Backend Only

```bash
cd backend
cp .env.example .env
# Edit .env with your API keys
npm run dev
```

### With AI Integration (Future)

Add to `backend/.env`:
```
OPENAI_API_KEY=sk-...
# or
ANTHROPIC_API_KEY=sk-...
```

---

## 🐛 Troubleshooting

### Extension won't load
```bash
cd frontend && npm run build
# Reload in chrome://extensions/
```

### Backend not starting
```bash
cd backend
npm install
npm run dev
# Check http://localhost:3000/health
```

### Port 3000 already in use
```bash
# Change PORT in backend/.env
PORT=3001
```

---

## 📚 Documentation

- **README.md** - Project overview
- **DEVELOPMENT.md** - Detailed development guide
- **frontend/README.md** - Extension documentation
- **backend/README.md** - Server documentation

---

## 🔄 Development Workflow

### Making Changes

1. **Edit code** in `src/` folders
2. **For frontend:**
   ```bash
   cd frontend && npm run build
   # Reload extension in Chrome
   ```
3. **For backend:**
   - Auto-reloads with `npm run dev`
4. **Commit** to git

### Example: Add API Endpoint

1. **Create endpoint** in `backend/src/server.ts`
2. **Test it:** 
   ```bash
   curl http://localhost:3000/api/your-endpoint
   ```
3. **Use in extension:** Update `ChatPanel.tsx`
4. **Rebuild:** `cd frontend && npm run build`

---

## 🚀 Next Steps

1. ✅ Install dependencies
2. ✅ Build frontend
3. ✅ Load in Chrome
4. ✅ Start backend
5. **→ Add AI integration**
6. **→ Deploy to Chrome Web Store**
7. **→ Add database**

---

## 📞 Help

- Check **DEVELOPMENT.md** for detailed guides
- Read endpoint errors in browser console
- View backend logs in terminal
- Inspect extension in `chrome://extensions/`

---

**Happy coding! 🎉**

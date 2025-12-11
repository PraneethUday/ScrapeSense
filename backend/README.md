# ScrapeSense Backend

Node.js/Express backend server for ScrapeSense Chrome extension. Handles AI-powered chat, page content analysis, and API integrations.

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd backend
npm install
```

### Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=your_key_here
```

### Development

Start the development server with hot reload:

```bash
npm run dev
```

Server runs on `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Health Check

- **GET** `/health` - Check server status

### Chat

- **POST** `/api/chat` - Send a chat message
  - Body: `{ message, pageContent?, conversationHistory? }`
  - Response: `{ success, data: { id, type, content, timestamp } }`

### Page Analysis

- **POST** `/api/analyze` - Analyze page content
  - Body: `{ pageContent, query? }`
  - Response: `{ success, data: { summary, keyPoints, entities, sentiment } }`

## Architecture

```
backend/
├── src/
│   ├── server.ts         # Main Express app
│   ├── routes/           # API routes (future)
│   ├── controllers/      # Request handlers (future)
│   ├── services/         # Business logic (future)
│   └── utils/            # Helper functions (future)
├── dist/                 # Compiled JavaScript
├── package.json
├── tsconfig.json
└── .env
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `OPENAI_API_KEY` - OpenAI API key for chat
- `ANTHROPIC_API_KEY` - Anthropic/Claude API key (alternative)
- `CORS_ORIGINS` - Allowed CORS origins
- `LOG_LEVEL` - Logging level

## Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled server
- `npm run lint` - Run ESLint
- `npm test` - Run tests (vitest)

## Integrations (TODO)

- [ ] OpenAI API integration
- [ ] Claude/Anthropic API integration
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Authentication & authorization
- [ ] Rate limiting
- [ ] Caching layer (Redis)
- [ ] Webhook support

## License

MIT

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "ScrapeSense backend is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { message, pageContent, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    // Placeholder for AI integration
    // In production, this will connect to OpenAI/Claude API
    const response = {
      id: `msg-${Date.now()}`,
      type: "assistant",
      content: `Echo: ${message}. [This is a placeholder response. Connect to your AI API for real answers.]`,
      timestamp: new Date().toISOString(),
      usage: {
        promptTokens: 0,
        completionTokens: 0,
      },
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Failed to process chat message",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Page content analysis endpoint
app.post("/api/analyze", async (req: Request, res: Response) => {
  try {
    const { pageContent, query } = req.body;

    if (!pageContent) {
      return res.status(400).json({
        error: "Page content is required",
      });
    }

    // Placeholder for content analysis
    const analysis = {
      summary: "Page analysis placeholder",
      keyPoints: ["Point 1", "Point 2", "Point 3"],
      entities: [],
      sentiment: "neutral",
    };

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({
      error: "Failed to analyze page content",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not found",
    path: req.path,
    method: req.method,
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "An error occurred",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  ScrapeSense Backend Server            ║
║  Running on http://localhost:${PORT}    ║
╚════════════════════════════════════════╝
  `);
});

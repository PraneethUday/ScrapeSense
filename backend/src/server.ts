import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Google Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-pro" });

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

    // Build conversation context with page content
    const systemContext = pageContent
      ? `You are ScrapeSense, an AI assistant that helps users understand and analyze web page content. 
        
Current page information:
Title: ${pageContent.title || "Unknown"}
URL: ${pageContent.url || "Unknown"}
Page content: ${pageContent.text?.substring(0, 8000) || "No content available"}

Help the user by answering questions about this page, summarizing content, extracting information, or explaining concepts found on the page.`
      : "You are ScrapeSense, an AI assistant that helps users understand web content. The current page content is not available.";

    // Build conversation history for Gemini
    const chatHistory = (conversationHistory || []).map((msg: any) => ({
      role: msg.type === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Create chat session with history
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // Construct the full prompt with context
    const fullPrompt = chatHistory.length === 0 
      ? `${systemContext}\n\nUser: ${message}`
      : message;

    // Call Gemini API
    const result = await chat.sendMessage(fullPrompt);
    const response_text = result.response.text();

    const aiResponse = response_text || "I'm sorry, I couldn't generate a response.";

    const response = {
      id: `msg-${Date.now()}`,
      type: "assistant",
      content: aiResponse,
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

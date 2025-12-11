import React, { useState, useRef, useEffect } from "react";
import "../styles/ChatPanel.css";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface PageContent {
  title: string;
  url: string;
  html: string;
  text: string;
  metadata: {
    description: string;
    keywords: string;
    author: string;
  };
}

export const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hi! I'm ScrapeSense, your AI-powered web assistant. I can help you understand and summarize the content on this page. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height =
        Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [inputValue]);

  // Extract page content when component mounts
  useEffect(() => {
    extractPageContent();
  }, []);

  const extractPageContent = () => {
    // Get page content from the content script
    window.postMessage(
      {
        type: "SCRAPESENSE_GET_CONTENT",
      },
      "*"
    );

    // Listen for content response
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "SCRAPESENSE_PAGE_CONTENT") {
        setPageContent(event.data.content);
        window.removeEventListener("message", handleMessage);
      }
    };

    window.addEventListener("message", handleMessage);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Prepare context for AI
      const context = pageContent
        ? `Current page: ${pageContent.title}\nURL: ${
            pageContent.url
          }\nPage content: ${pageContent.text.substring(0, 5000)}`
        : "No page content available";

      // TODO: Connect to AI agent (ChatGPT, Claude, etc.)
      // For now, we'll simulate a response
      const response = await simulateAIResponse(userMessage.content, context);

      const assistantMessage: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate AI response (remove this once connected to real AI)
  const simulateAIResponse = (
    query: string,
    context: string
  ): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (query.toLowerCase().includes("summary")) {
          resolve(
            "Here's a summary of the page content... [This is a placeholder response. Connect to your AI agent to get real responses.]"
          );
        } else if (query.toLowerCase().includes("help")) {
          resolve(
            "I can help you by:\n- Summarizing page content\n- Answering questions about what's on the page\n- Extracting specific information\n- Explaining complex topics\n\nWhat would you like to know about this page?"
          );
        } else {
          resolve(
            `Based on the current page "${
              context.split("\n")[0]
            }", here's my response to your question:\n\n[This is a placeholder. Connect to your AI agent for real answers.]`
          );
        }
      }, 800);
    });
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "1",
        type: "assistant",
        content: "Hi! I'm ScrapeSense. How can I help you with this page?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="scrapesense-chat-panel">
      {/* Header */}
      <div className="chat-header">
        <div className="header-content">
          <div className="logo">🤖</div>
          <div className="header-text">
            <h2>ScrapeSense</h2>
            <p>AI Web Assistant</p>
          </div>
        </div>
        <button
          className="header-button"
          title="Clear chat"
          onClick={handleClearChat}
        >
          🗑️
        </button>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message message-${message.type}`}>
            <div className="message-avatar">
              {message.type === "user" ? "👤" : "🤖"}
            </div>
            <div className="message-content">
              <p className="message-text">{message.content}</p>
              <span className="message-time">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message message-assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-container">
        <form onSubmit={handleSendMessage}>
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Ask me about this page... (Shift+Enter for new line)"
            disabled={isLoading}
            className="message-input"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="send-button"
          >
            {isLoading ? "..." : "➤"}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="chat-footer">
        <p>Powered by ScrapeSense • Built with React & TypeScript</p>
      </div>
    </div>
  );
};

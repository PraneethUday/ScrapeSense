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
  const [contentLoaded, setContentLoaded] = useState(false);
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

  const extractPageContent = async () => {
    try {
      // Get the active tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab.id) {
        console.error("No active tab found");
        return;
      }

      // Inject content script if not already injected
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"],
        });
      } catch (error) {
        // Content script might already be injected, which is fine
        console.log("Content script injection:", error);
      }

      // Send message to content script to get page content
      chrome.tabs.sendMessage(
        tab.id,
        { type: "GET_PAGE_CONTENT" },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Error getting page content:",
              chrome.runtime.lastError,
            );
            setContentLoaded(false);
            return;
          }

          if (response && response.status === "success") {
            setPageContent(response.content);
            setContentLoaded(true);
            console.log("Page content received:", response.content);
          } else {
            setContentLoaded(false);
          }
        },
      );
    } catch (error) {
      console.error("Error extracting page content:", error);
    }
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
      // Call backend API
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          pageContent: pageContent,
          conversationHistory: messages.filter((msg) => msg.id !== "1"), // Exclude welcome message
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to get response");
      }

      const assistantMessage: Message = {
        id: data.data.id,
        type: "assistant",
        content: data.data.content,
        timestamp: new Date(data.data.timestamp),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content:
          "Sorry, I encountered an error connecting to the AI service. Please make sure the backend is running on http://localhost:3000",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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

      {/* Page Content Status */}
      {contentLoaded && pageContent && (
        <div
          style={{
            padding: "8px 16px",
            fontSize: "12px",
            background: "#e8f5e9",
            color: "#2e7d32",
            borderBottom: "1px solid #ddd",
          }}
        >
          ✓ Analyzing: {pageContent.title || pageContent.url}
        </div>
      )}
      {!contentLoaded && (
        <div
          style={{
            padding: "8px 16px",
            fontSize: "12px",
            background: "#fff3e0",
            color: "#e65100",
            borderBottom: "1px solid #ddd",
          }}
        >
          ⚠ Loading page content...
        </div>
      )}

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

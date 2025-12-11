// Background service worker for ScrapeSense extension

// Store page content for later use
const pageContentStore: Record<string, any> = {};

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(
  (
    request: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    if (request.type === "STORE_PAGE_CONTENT") {
      const tabId = sender.tab?.id || "unknown";
      pageContentStore[tabId] = {
        content: request.content,
        url: request.url,
        title: request.title,
        timestamp: Date.now(),
      };

      console.log("[ScrapeSense] Page content stored for tab", tabId);
      sendResponse({ status: "stored" });
    } else if (request.type === "GET_PAGE_CONTENT") {
      const tabId = sender.tab?.id || "unknown";
      const content = pageContentStore[tabId];
      sendResponse({ content });
    } else if (request.type === "QUERY_AI") {
      // This is where you would connect to your AI service
      console.log("[ScrapeSense] AI query received:", request.query);
      sendResponse({
        response: "AI response will be implemented here",
      });
    }
  }
);

// Clean up when tabs are closed
chrome.tabs.onRemoved.addListener((tabId: number) => {
  delete pageContentStore[tabId];
  console.log("[ScrapeSense] Cleaned up content for tab", tabId);
});

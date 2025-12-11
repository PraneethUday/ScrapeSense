// Content script - minimal version for potential future page content extraction
// ScrapeSense now uses extension popup exclusively (no webpage injection)

// Extract page content for use in popup
function extractPageContent() {
  const content = {
    title: document.title,
    url: window.location.href,
    html: document.documentElement.outerHTML.substring(0, 50000), // Limit size
    text: document.body.innerText.substring(0, 20000), // Limit size
    metadata: {
      description:
        document
          .querySelector('meta[name="description"]')
          ?.getAttribute("content") || "",
      keywords:
        document
          .querySelector('meta[name="keywords"]')
          ?.getAttribute("content") || "",
      author:
        document
          .querySelector('meta[name="author"]')
          ?.getAttribute("content") || "",
    },
  };

  return content;
}

// Listen for requests from the extension popup
chrome.runtime.onMessage.addListener(
  (request: any, _sender: any, sendResponse: (response?: any) => void) => {
    if (request.type === "GET_PAGE_CONTENT") {
      try {
        const content = extractPageContent();
        sendResponse({ status: "success", content });
      } catch (error) {
        sendResponse({ status: "error", message: String(error) });
      }
    }
  }
);

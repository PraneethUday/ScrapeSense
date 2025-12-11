// Popup script for ScrapeSense extension

document.addEventListener("DOMContentLoaded", () => {
  const ctaButton = document.querySelector(".cta-button");

  if (ctaButton) {
    ctaButton.addEventListener("click", () => {
      // Get the active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) {
          // Send message to content script to open chat panel
          chrome.tabs
            .sendMessage(tabs[0].id, {
              type: "OPEN_CHAT_PANEL",
            })
            .catch((error) => {
              console.error("Failed to open chat panel:", error);
            });

          // Close the popup
          setTimeout(() => {
            window.close();
          }, 100);
        }
      });
    });
  }
});

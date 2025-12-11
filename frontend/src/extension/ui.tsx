import ReactDOM from "react-dom/client";
import { ChatPanel } from "../components/ChatPanel";

// Mount React app to the container
const container = document.getElementById("scrapesense-root");
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<ChatPanel />);
}

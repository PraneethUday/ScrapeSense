import React from "react";
import ReactDOM from "react-dom/client";
import { ChatPanel } from "../components/ChatPanel";
import "../styles/ChatPanel.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <ChatPanel />
  </React.StrictMode>
);

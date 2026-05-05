import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatLayout from "../components/ChatLayout";
import ErrorBoundary from "../components/ErrorBoundary";

export default function Dashboard() {
  const [history, setHistory] = useState([]);

  // Load history on mount
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("history") || "[]");
      setHistory(Array.isArray(stored) ? stored : []);
      console.log("📚 History loaded:", stored);
    } catch (err) {
      console.error("❌ History load error:", err);
      setHistory([]);
    }
  }, []);

  // New chat handler
  const handleNewChat = () => {
    console.log("🆕 New chat started");
    // ChatLayout will handle its own message state
  };

  // History click handler
  const handleHistoryClick = (item) => {
    console.log("📖 Loading history item:", item?.idea);
    // This could be used to load previous conversations
    // For now, ChatLayout maintains its own message state
  };

  console.log("DASHBOARD RENDER - history:", history);

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-black text-white">
        {/* Sidebar */}
        <Sidebar
          history={history}
          onNewChat={handleNewChat}
          onHistoryClick={handleHistoryClick}
        />

        {/* Chat Layout */}
        <div className="flex-1">
          <ChatLayout
            history={history}
            onNewChat={handleNewChat}
            onHistoryClick={handleHistoryClick}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}
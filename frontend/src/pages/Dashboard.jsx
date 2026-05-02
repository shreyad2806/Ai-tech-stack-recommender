import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import InputBox from "../components/InputBox";
import ResultView from "../components/ResultView";

// 🌐 API URL
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Dashboard() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 🔄 Load history on mount
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

  // 🆕 New chat
  const handleNewChat = () => {
    console.log("🆕 New chat started");
    setInput("");
    setResult(null);
    setIsLoading(false);
  };

  // 🚀 Generate (API CALL)
  const handleGenerate = async () => {
    if (!input.trim()) {
      console.log("⚠️ Empty input, skipping generation");
      return;
    }

    console.log("🚀 Starting generation for:", input);
    setIsLoading(true);
    setResult({ loading: true });

    try {
      const res = await fetch(`${API_URL}/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idea: input.trim() }),
      });

      console.log("📡 API response status:", res.status);

      let data = {};
      try {
        const text = await res.text();
        console.log("📄 Raw response:", text);
        data = JSON.parse(text);
      } catch (parseErr) {
        console.error("❌ JSON parse error:", parseErr);
        throw new Error("Invalid JSON response from server");
      }

      if (!res.ok) {
        console.error("❌ API error:", data);
        throw new Error(data?.error || data?.detail || `HTTP ${res.status}`);
      }

      console.log("✅ API success:", data);
      
      // ✅ Set result
      setResult(data);
      setIsLoading(false);

      // 💾 Save to history
      const updatedHistory = [
        { idea: input, result: data, timestamp: Date.now() },
        ...history,
      ].slice(0, 10);

      localStorage.setItem("history", JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
      console.log("💾 History updated:", updatedHistory);

    } catch (err) {
      console.error("❌ Generate error:", err);
      setResult({ error: err.message });
      setIsLoading(false);
    }
  };

  // 🔄 Handle history item click
  const handleHistoryClick = (item) => {
    console.log("📖 Loading history item:", item.idea);
    setInput(item.idea);
    setResult(item.result);
  };

  console.log("🎯 Current state:", { input: input.substring(0, 50), result, isLoading, historyLength: history.length });

  return (
    <div className="flex h-screen bg-[#050508] text-white">

      <Sidebar
        history={history}
        onNewChat={handleNewChat}
        onHistoryClick={handleHistoryClick}
      />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <div className="flex justify-end items-center p-4 border-b border-gray-800">
          <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            Share
          </button>

          <div className="ml-3 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
            S
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* Input */}
          <InputBox
            input={input}
            setInput={setInput}
            onGenerate={handleGenerate}
            loading={isLoading}
          />

          {/* Result */}
          <div className="mt-8">
            <ResultView data={result} />
          </div>

        </div>

      </div>
    </div>
  );
}
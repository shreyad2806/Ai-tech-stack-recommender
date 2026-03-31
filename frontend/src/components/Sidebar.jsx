import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";

// 🌐 API Configuration
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Sidebar() {
  const [history, setHistory] = useState([]);

  // ✅ Fetch history from backend
  useEffect(() => {
    fetch(`${API_URL}/stacks`)
      .then((res) => res.json())
      .then((data) => {
        if (import.meta.env.DEV) console.log("History loaded:", data);
        setHistory(data);
      })
      .catch((err) => {
        if (import.meta.env.DEV) console.error("History error:", err);
      });
  }, []);

  return (
    <div className="w-[260px] h-screen bg-[#0f0f17] border-r border-white/5 flex flex-col p-4">

      {/* Logo */}
      <div className="mb-6 text-xl font-bold text-white">
        ⚡ StackMind
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search chats..."
          className="w-full px-3 py-2 rounded-lg bg-[#1a1a25] text-gray-300 text-sm outline-none"
        />
      </div>

      {/* New Chat */}
      <button
        onClick={() => {
          localStorage.removeItem("lastStack");
          localStorage.removeItem("lastIdea");
          if (import.meta.env.DEV) console.log("Cleared localStorage for new chat");
          window.location.reload();
        }}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#6ef0c0] text-black font-semibold mb-6"
      >
        <Plus className="w-4 h-4" />
        New Chat
      </button>

      {/* History */}
      <div className="flex-1 overflow-y-auto">
        <p className="mb-3 text-xs text-gray-500">HISTORY</p>

        <div className="space-y-2">
          {history.length === 0 ? (
            <p className="text-xs text-gray-500">No history yet</p>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-2 text-sm text-gray-300 truncate rounded cursor-pointer hover:bg-white/5"
                title={item.idea}
              >
                {item.idea}
              </div>
            ))
          )}
        </div>
      </div>

      {/* User */}
      <div className="pt-3 mt-4 text-sm text-gray-400 border-t border-white/5">
        Guest
      </div>

    </div>
  );
}
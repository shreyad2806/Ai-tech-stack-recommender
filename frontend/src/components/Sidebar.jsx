import { Plus, Clock, Search } from "lucide-react";
import { useMemo, useState } from "react";

export default function Sidebar({
  history = [],
  onNewChat,
  onHistoryClick,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // =========================
  // FORMAT TIME
  // =========================
  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();

    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;

    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  // =========================
  // FILTERED HISTORY
  // =========================
  const filteredHistory = useMemo(() => {
    if (!Array.isArray(history)) return [];

    if (!searchQuery.trim()) return history;

    return history.filter((item) =>
      item?.idea
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [history, searchQuery]);

  return (
    <div className="w-[280px] h-screen bg-[#0f0f17] border-r border-white/5 flex flex-col">
      
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg shadow-lg bg-gradient-to-r from-emerald-400 to-teal-400 shadow-emerald-500/20">
              <span className="text-sm font-bold text-black">
                ⚡
              </span>
            </div>

            <h1 className="text-lg font-bold text-white">
              StackMind
            </h1>
          </div>

          <div className="px-2 py-1 border rounded-full bg-emerald-500/20 border-emerald-500/30">
            <span className="text-xs font-medium text-emerald-400">
              Guest Mode
            </span>
          </div>
        </div>

        {/* NEW CHAT BUTTON */}
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:opacity-90 text-black font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />

          New Chat
        </button>
      </div>

      {/* ========================= */}
      {/* SEARCH */}
      {/* ========================= */}
      <div className="p-4 border-b border-white/5">
        <div className="relative">
          
          <Search className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 left-3 top-1/2" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search history..."
            className="w-full pl-10 pr-3 py-2 bg-[#1a1a25] text-white text-sm rounded-lg outline-none border border-white/10 focus:ring-2 focus:ring-emerald-500/40 transition-all duration-200 placeholder-gray-500"
          />
        </div>
      </div>

      {/* ========================= */}
      {/* HISTORY */}
      {/* ========================= */}
      <div className="flex-1 p-4 overflow-y-auto">

        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-gray-500" />

          <h3 className="text-xs font-medium tracking-wider text-gray-500 uppercase">
            Recent Conversations
          </h3>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="py-8 text-center">

            <div className="w-12 h-12 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-3 border border-white/10">
              <Clock className="w-6 h-6 text-gray-600" />
            </div>

            <p className="text-sm text-gray-400">
              No conversations yet
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Start by describing your idea
            </p>
          </div>
        ) : (
          <div className="space-y-2">

            {filteredHistory.map((item, index) => (
              <div
                key={item?.timestamp || index}
                onClick={() =>
                  onHistoryClick && onHistoryClick(item)
                }
                className="p-3 transition-all duration-200 border rounded-lg cursor-pointer group bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20"
              >

                <div className="flex items-start justify-between gap-2">

                  <div className="flex-1 min-w-0">

                    <p className="text-sm leading-relaxed text-white transition-colors line-clamp-2 group-hover:text-white">
                      {item?.idea || "Untitled Conversation"}
                    </p>

                    {item?.timestamp && (
                      <p className="mt-1 text-xs text-gray-500">
                        {formatTime(item.timestamp)}
                      </p>
                    )}
                  </div>

                  <div className="flex-shrink-0 w-2 h-2 mt-1 transition-opacity rounded-full opacity-0 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:opacity-100" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================= */}
      {/* FOOTER */}
      {/* ========================= */}
      <div className="p-4 border-t border-white/5">

        <div className="flex items-center gap-3">

          <div className="flex items-center justify-center w-8 h-8 rounded-full shadow-lg bg-gradient-to-r from-emerald-400 to-purple-400 shadow-emerald-500/20">
            <span className="text-sm font-semibold text-black">
              G
            </span>
          </div>

          <div>
            <p className="text-sm font-medium text-white">
              Guest User
            </p>

            <p className="text-xs text-gray-500">
              Free tier
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
import { Plus, Clock, Search } from "lucide-react";

export default function Sidebar({ history, onNewChat, onHistoryClick }) {
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

  return (
    <div className="w-[280px] h-screen bg-[#0f0f17] border-r border-white/5 flex flex-col">
      
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-black font-bold text-sm">⚡</span>
            </div>
            <h1 className="text-lg font-bold text-white">StackMind</h1>
          </div>
          <div className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
            <span className="text-xs font-medium text-emerald-400">Guest Mode</span>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:opacity-90 text-black font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-white/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search history..."
            className="w-full pl-10 pr-3 py-2 bg-[#1a1a25] text-white text-sm rounded-lg outline-none border border-white/10 focus:ring-2 focus:ring-emerald-500/40 transition-all duration-200 placeholder-gray-500"
          />
        </div>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-gray-500" />
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Recent Conversations
          </h3>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-3 border border-white/10">
              <Clock className="w-6 h-6 text-gray-600" />
            </div>
            <p className="text-gray-400 text-sm">No conversations yet</p>
            <p className="text-gray-500 text-xs mt-1">Start by describing your idea</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item, index) => (
              <div
                key={item.timestamp || index}
                onClick={() => onHistoryClick && onHistoryClick(item)}
                className="group cursor-pointer p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
                      {item.idea}
                    </p>
                    {item.timestamp && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(item.timestamp)}
                      </p>
                    )}
                  </div>
                  <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-black font-semibold text-sm">G</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Guest User</p>
            <p className="text-xs text-gray-500">Free tier</p>
          </div>
        </div>
      </div>

    </div>
  );
}
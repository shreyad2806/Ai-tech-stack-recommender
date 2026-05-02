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
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">⚡</span>
          </div>
          <h1 className="text-lg font-bold text-white">StackMind</h1>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/20"
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
            className="w-full pl-10 pr-3 py-2 bg-[#1a1a25] text-gray-300 text-sm rounded-lg outline-none border border-gray-700 focus:border-cyan-500/50 transition-colors placeholder-gray-500"
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
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-gray-600" />
            </div>
            <p className="text-gray-500 text-sm">No conversations yet</p>
            <p className="text-gray-600 text-xs mt-1">Start by describing your idea</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item, index) => (
              <div
                key={item.timestamp || index}
                onClick={() => onHistoryClick && onHistoryClick(item)}
                className="group cursor-pointer p-3 rounded-lg bg-[#1a1a25] hover:bg-[#252535] border border-gray-800 hover:border-gray-700 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
                      {item.idea}
                    </p>
                    {item.timestamp && (
                      <p className="text-xs text-gray-600 mt-1">
                        {formatTime(item.timestamp)}
                      </p>
                    )}
                  </div>
                  <div className="w-2 h-2 bg-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">G</span>
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
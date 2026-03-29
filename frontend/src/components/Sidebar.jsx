import { Plus, Search } from "lucide-react";

export default function Sidebar() {
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
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#6ef0c0] text-black font-semibold mb-6">
        <Plus className="w-4 h-4" />
        New Chat
      </button>

      {/* History */}
      <div className="flex-1">
        <p className="mb-3 text-xs text-gray-500">HISTORY</p>

        <div className="space-y-2">
          <div className="p-2 text-sm text-gray-300 rounded cursor-pointer hover:bg-white/5">
            E-commerce SaaS
          </div>
          <div className="p-2 text-sm text-gray-300 rounded cursor-pointer hover:bg-white/5">
            FinTech Platform
          </div>
          <div className="p-2 text-sm text-gray-300 rounded cursor-pointer hover:bg-white/5">
            AI Healthcare App
          </div>
        </div>
      </div>

      {/* User */}
      <div className="pt-3 mt-4 text-sm text-gray-400 border-t border-white/5">
        Guest
      </div>

    </div>
  );
}
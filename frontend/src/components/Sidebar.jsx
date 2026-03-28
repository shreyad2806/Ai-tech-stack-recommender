import { Search, Plus, MoreHorizontal, Settings, Terminal, Moon, Bell, LogOut, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    }
  }, []);

  const getUserInitials = (email) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };
  const historyChats = [
    { id: 1, title: "E-commerce SaaS", color: "bg-linear-to-tr from-pink-400 to-orange-400" },
    { id: 2, title: "Fintech Payment Gateway", color: "bg-linear-to-tr from-emerald-400 to-teal-400" },
    { id: 3, title: "Telemedicine Platform", color: "bg-linear-to-tr from-blue-400 to-indigo-400" },
  ];

  return (
    <aside className="w-[260px] h-screen bg-[#0f0f1a] border-r border-white/5 flex flex-col relative z-20 shrink-0 p-4">
      
      {/* Top: Logo */}
      <div className="flex items-center gap-2.5 mb-7 px-2 mt-2">
        <div className="w-6 h-6 rounded bg-linear-to-tr from-cyan-400 via-purple-500 to-pink-500"></div>
        <span className="text-xl font-bold tracking-wide text-white">StackMind</span>
      </div>

      {/* Search Bar */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input 
          type="text" 
          placeholder="Search chats..." 
          className="w-full bg-[#151522] border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/10 transition-colors"
        />
      </div>

      {/* New Chat Button */}
      <button className="flex items-center justify-between w-full bg-[#151522]/50 border border-[#6ef0c0]/20 hover:bg-[#6ef0c0]/10 hover:border-[#6ef0c0]/40 rounded-xl py-2.5 px-4 mb-4 transition-all group">
        <div className="flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#6ef0c0]" />
          <span className="font-semibold text-[#6ef0c0] text-sm">New Chat</span>
        </div>
        <div className="w-5 h-5 rounded-full bg-[#6ef0c0]/10 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#6ef0c0]"></div>
        </div>
      </button>

      {/* History Button */}
      <div className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white cursor-pointer transition-colors mb-6">
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">History</span>
      </div>

      {/* History Section */}
      <div className="flex-1 overflow-y-auto no-scrollbar -mx-2 px-2">
        <div className="text-[10px] font-bold text-gray-600 tracking-wider mb-3 px-3">HISTORY</div>
        <div className="space-y-0.5">
          {historyChats.map((chat) => (
            <div key={chat.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/5 cursor-pointer group transition-colors">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-3.5 h-3.5 rounded-sm ${chat.color}`}></div>
                <span className="text-sm text-gray-300 truncate font-medium">{chat.title}</span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 hover:text-white transition-all shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Profile Section */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors mb-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-purple-600/20 flex items-center justify-center shrink-0 border border-purple-500/20">
              <span className="text-xs font-bold text-purple-300">{getUserInitials(user?.email)}</span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-white truncate">{user?.email || "Guest"}</span>
              <span className="text-xs text-gray-500 truncate">{user?.email || "Not logged in"}</span>
            </div>
          </div>
          <Settings className="w-4 h-4 text-gray-500 hover:text-white transition-colors shrink-0" />
        </div>

        {/* Action icons row */}
        <div className="flex items-center justify-between px-2">
          <button className="p-2 rounded-lg bg-[#151522] hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5">
            <Terminal className="w-3.5 h-3.5" />
          </button>
          <button className="p-2 rounded-lg bg-[#151522] hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5">
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button className="p-2 rounded-lg bg-[#151522] hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5">
            <Bell className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={handleLogout}
            className="p-2 rounded-lg bg-[#151522] hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors border border-white/5"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </aside>
  );
}

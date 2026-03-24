export default function Sidebar() {
  return (
    <aside className="h-screen w-64 bg-black border-r border-[#262626] flex flex-col px-4 py-6">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-lg font-semibold text-white">AI Stack Copilot</span>
      </div>

      {/* New Project Button */}
      <button className="w-full py-3 mb-6 text-sm font-medium text-white transition-all rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-400 hover:to-pink-500 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
        <div className="flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          New Project
        </div>
      </button>

      {/* Search */}
      <div className="relative mb-6">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#6b7280" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <input
          placeholder="Search projects..."
          className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg bg-[#1a1a1a] border border-[#262626] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 text-white placeholder-gray-500 transition-all"
        />
      </div>

      {/* Projects Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Projects</p>
          <div className="space-y-1">
            <div className="group flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#1a1a1a] border border-pink-500/20 hover:border-pink-500/40 transition-all cursor-pointer">
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              <span className="flex-1 text-sm font-medium text-white">Resume AI</span>
              <span className="text-xs text-pink-400">Active</span>
            </div>
            <div className="group flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1a1a1a] border border-transparent hover:border-[#262626] transition-all cursor-pointer">
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              <span className="flex-1 text-sm text-gray-300 group-hover:text-white">Fintech App</span>
            </div>
            <div className="group flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1a1a1a] border border-transparent hover:border-[#262626] transition-all cursor-pointer">
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              <span className="flex-1 text-sm text-gray-300 group-hover:text-white">Healthcare System</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-[#262626]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full"></div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">User</p>
            <p className="text-xs text-gray-500">Free Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}


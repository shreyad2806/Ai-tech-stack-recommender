export default function Sidebar() {
  return (
    <aside className="h-screen w-64 bg-gradient-to-b from-black via-[#18141f] to-[#1a1822] border-r border-zinc-900 flex flex-col px-6 py-8 shadow-xl z-30">
      <div className="flex items-center gap-2 mb-8">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#ec4899"/><path d="M7 16.5L12 7.5L17 16.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>
        <span className="text-lg font-bold tracking-tight text-white">Thumbify Copilot</span>
      </div>
      <button className="w-full py-2 mb-6 text-sm font-semibold text-white transition shadow rounded-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 hover:opacity-90">
        + New Project
      </button>
      <input
        placeholder="Search projects..."
        className="w-full px-3 py-2 mb-5 text-sm rounded-lg outline-none bg-[#23202a] border border-zinc-800 focus:ring-2 focus:ring-pink-500 text-white placeholder:text-zinc-400"
      />
      <div className="mt-8 mb-8">
        <p className="mb-2 text-xs tracking-widest uppercase text-zinc-500">Projects</p>
        <div className="space-y-3">
          <div className="bg-[#23202a] hover:bg-pink-500/20 transition rounded-lg px-4 py-3 cursor-pointer flex items-center justify-between group border border-transparent hover:border-pink-500">
            <span className="font-medium text-white">Resume AI</span>
            <span className="text-xs text-pink-400 group-hover:text-pink-200">Active</span>
          </div>
          <div className="bg-[#23202a] hover:bg-pink-500/20 transition rounded-lg px-4 py-3 cursor-pointer flex items-center justify-between group border border-transparent hover:border-pink-500">
            <span className="font-medium text-white">Fintech App</span>
          </div>
          <div className="bg-[#23202a] hover:bg-pink-500/20 transition rounded-lg px-4 py-3 cursor-pointer flex items-center justify-between group border border-transparent hover:border-pink-500">
            <span className="font-medium text-white">Healthcare System</span>
          </div>
        </div>
      </div>
      {/* Footer intentionally left blank for minimalism as per requirements */}
    </aside>
  );
}


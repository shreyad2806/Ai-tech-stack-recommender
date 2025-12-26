export default function Sidebar() {
  return (
    <aside className="flex flex-col w-64 p-6 border-r shadow-lg bg-zinc-900 border-zinc-800">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold accent">AI Copilot</h1>
        <div className="text-xs muted">v1.0</div>
      </div>

      <button className="w-full py-2 mb-4 text-sm text-left transition bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-500">
        + New Project
      </button>

      <input
        placeholder="Search projects..."
        className="px-3 py-2 mb-4 text-sm rounded-lg outline-none bg-zinc-800 focus:ring-2 focus:ring-indigo-500"
      />

      <div className="space-y-3 text-sm">
        <p className="text-xs uppercase muted">Projects</p>
        <div className="space-y-2">
          <p className="cursor-pointer hover:text-indigo-300">Resume AI</p>
          <p className="cursor-pointer hover:text-indigo-300">Fintech App</p>
          <p className="cursor-pointer hover:text-indigo-300">Healthcare System</p>
        </div>
      </div>

      <div className="pt-6 mt-auto">
        <div className="divider" />
        <div className="p-4 mt-4 text-sm shadow-inner bg-zinc-800 rounded-xl">
          <p className="mb-1 font-medium accent">Powered by Gemini</p>
          <p className="text-xs muted">AI-assisted system design</p>
        </div>
      </div>
    </aside>
  );
}

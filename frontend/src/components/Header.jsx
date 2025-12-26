export default function Header() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md">
      <div>
        <h2 className="text-lg font-semibold">Welcome, your AI Copilot awaits</h2>
        <p className="text-sm muted">Describe your project to get a tailored tech stack</p>
      </div>

      <div className="flex items-center space-x-4">
        <button className="px-3 py-1 text-sm transition rounded-md bg-zinc-800 muted hover:bg-zinc-700">Docs</button>
        <button className="px-3 py-1 text-sm transition bg-indigo-600 rounded-md hover:bg-indigo-500">New</button>
        <div className="text-sm muted">Signed in</div>
      </div>
    </header>
  );
}

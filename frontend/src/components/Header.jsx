export default function Header() {
  return (
    <header className="px-8 py-4 border-b border-neutral-800 flex justify-between bg-neutral-900">
      <h1 className="text-xl font-semibold text-neutral-100">
        Welcome, your AI Copilot awaits
      </h1>
      <span className="text-xs text-emerald-400 font-medium">
        Powered by Gemini
      </span>
    </header>
  );
}


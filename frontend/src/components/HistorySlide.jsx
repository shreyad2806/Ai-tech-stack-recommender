import { useState } from "react";

export default function HistorySlide({ history }) {
  // visually modern, pink accent, card bg, spacing, hover effect
  const [expanded, setExpanded] = useState(true);

  return (
    <section className="rounded-2xl bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 shadow-lg p-6 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg text-pink-400">History</h3>
        <button
          className="text-xs px-3 py-1 rounded-full bg-pink-500 hover:bg-pink-400 text-white font-semibold transition"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Hide" : "Show"}
        </button>
      </div>
      {expanded && (
        <ul className="space-y-3 max-h-48 overflow-y-auto">
          {history && history.length > 0 ? (
            history.map((item, idx) => (
              <li key={idx} className="p-3 rounded-xl bg-zinc-800/80 hover:bg-pink-500/20 transition shadow-sm">
                <div className="text-white/90 text-sm font-medium">{item.title}</div>
                <div className="text-xs text-pink-300 mt-1">{item.date}</div>
              </li>
            ))
          ) : (
            <li className="text-xs muted">No history yet.</li>
          )}
        </ul>
      )}
    </section>
  );
}

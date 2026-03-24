export default function ResultDashboard({ result }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <h2 className="text-lg font-semibold">
        Recommended Architecture
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(result).map(([key, value]) => (
          <div
            key={key}
            className="bg-slate-800 rounded-xl p-4"
          >
            <h3 className="text-indigo-400 text-sm font-semibold uppercase mb-2">
              {key}
            </h3>

            <pre className="text-xs text-slate-200 whitespace-pre-wrap">
              {typeof value === "string"
                ? value
                : JSON.stringify(value, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

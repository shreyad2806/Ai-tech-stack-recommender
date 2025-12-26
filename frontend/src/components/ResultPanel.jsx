export default function ResultPanel({ result }) {
  if (!result) return null;

  return (
    <div className="card">
      <h3 className="mb-2 text-lg font-semibold">Recommended Tech Stack</h3>
      <p className="mb-4 text-sm muted">Structured suggestions based on your description</p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Object.entries(result).map(([key, value]) => (
          <div key={key} className="p-4 bg-zinc-800 rounded-xl">
            <h4 className="mb-2 text-sm font-semibold uppercase accent">{key}</h4>
            <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

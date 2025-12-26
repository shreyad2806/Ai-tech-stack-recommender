const examples = [
  "AI-based resume screening platform",
  "Fintech dashboard with fraud detection",
  "Healthcare appointment management system",
];

export default function ExampleCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {examples.map((text) => (
        <div
          key={text}
          className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl hover:shadow-lg hover:border-indigo-500 cursor-pointer transition flex flex-col justify-between"
        >
          <p className="text-sm text-zinc-200 mb-4">{text}</p>
          <div className="text-xs muted">Use as a starting point</div>
        </div>
      ))}
    </div>
  );
}



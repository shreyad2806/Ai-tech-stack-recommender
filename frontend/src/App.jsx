import { useState } from "react";
import axios from "axios";

export default function App() {
  const [description, setDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("http://127.0.0.1:8000/recommend", {
        description,
      });

      setResult(res.data.result);
    } catch (err) {
      console.error(err);
      alert("Failed to generate response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="flex justify-between px-6 py-4 border-b border-zinc-800">
        <h1 className="text-xl font-semibold">AI Tech Stack Recommender</h1>
        <span className="text-sm text-zinc-400">Powered by Gemini</span>
      </header>

      {/* Hero */}
      <main className="flex flex-col items-center justify-center flex-1 px-6">
        <div className="w-full max-w-3xl text-center">
          <h2 className="mb-4 text-4xl font-bold">
            Design your tech stack in seconds
          </h2>
          <p className="mb-8 text-zinc-400">
            Describe your project idea and get a complete tech stack,
            architecture, roadmap, and deployment plan.
          </p>

          {/* Input */}
          <textarea
            rows={5}
            className="w-full p-4 text-lg border rounded-lg bg-zinc-900 border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. AI-based resume screening platform for HR teams"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-3 mt-4 font-semibold transition bg-indigo-600 rounded-lg hover:bg-indigo-500"
          >
            {loading ? "Thinking..." : "Generate Tech Stack"}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="w-full max-w-4xl mt-12 space-y-8">
            {/* Tech Stack */}
            <Section title="Tech Stack">
              <Item title="Frontend" items={result.tech_stack.frontend} />
              <Item title="Backend" items={result.tech_stack.backend} />
              <Item title="AI / ML" items={result.tech_stack.ai_ml} />
              <Item title="Database" items={result.tech_stack.database} />
            </Section>

            <Section title="Architecture">
              <p className="text-zinc-300">{result.architecture}</p>
            </Section>

            <Section title="MVP Roadmap">
              <ul className="pl-6 list-disc text-zinc-300">
                {result.mvp_roadmap.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </Section>

            <Section title="Deployment">
              <p><strong>Backend:</strong> {result.deployment.backend}</p>
              <p><strong>Frontend:</strong> {result.deployment.frontend}</p>
              <p><strong>CI/CD:</strong> {result.deployment.ci_cd}</p>
            </Section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-sm text-center text-zinc-500">
        Built for placements · FastAPI + Gemini + React
      </footer>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="p-6 border bg-zinc-900 border-zinc-800 rounded-xl">
      <h3 className="mb-4 text-xl font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function Item({ title, items }) {
  return (
    <div className="mb-2">
      <strong>{title}:</strong>{" "}
      <span className="text-zinc-300">{items.join(", ")}</span>
    </div>
  );
}

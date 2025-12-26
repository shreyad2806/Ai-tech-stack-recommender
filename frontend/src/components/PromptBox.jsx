import axios from "axios";
import { useState } from "react";

export default function PromptBox({ setResult }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!input) return;
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/recommend", {
        description: input,
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">Describe your project</h3>
          <p className="text-sm muted">Tell the copilot about your idea and constraints</p>
        </div>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe your project idea..."
        className="w-full h-32 bg-zinc-800 rounded-xl p-4 text-sm resize-none outline-none mt-4"
      />

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm muted">Examples: chatbot, fintech dashboard, healthcare app</div>
        <div className="flex items-center space-x-3">
          <button className="bg-zinc-800 px-4 py-2 rounded-md text-sm muted hover:bg-zinc-700 transition">Clear</button>
          <button onClick={generate} className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md text-sm">
            {loading ? "Generating..." : "Generate Tech Stack"}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Command, Sparkles, Rocket, BrainCircuit, Wallet, LineChart, Building2 } from "lucide-react";

export default function InputBox() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Safe result object
  const safeResult = result && typeof result === "object" ? result : null;

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const bodyPayload = { idea: input.trim() };
      console.log("Sending /recommend payload:", bodyPayload);

      const res = await fetch("http://127.0.0.1:8000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(bodyPayload),
      });

      console.log("/recommend response status:", res.status);

      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
        throw new Error("Request failed");
      }

      const data = await res.json();
      console.log("/recommend parsed JSON:", data);

      // Normalize backend response
      const normalized = {
        architecture: data.architecture || "",
        core_technologies: data.core_technologies || [],
        deployment: data.deployment || "",
        roadmap: data.roadmap || [],
      };

      setResult(normalized);

    // ✅ ADD THIS (SAVE TO DB)
    try {
      await fetch("http://127.0.0.1:8000/save-stack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: input, ...normalized }),
      });
    } catch (e) {
      console.error("Save failed:", e);
    }

    } catch (err) {
      console.error("API ERROR:", err);
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const tags = [
    { name: "Startup", icon: Rocket, color: "text-orange-400" },
    { name: "AI / ML", icon: BrainCircuit, color: "text-emerald-400" },
    { name: "FinTech", icon: Wallet, color: "text-blue-400" },
    { name: "Analytics", icon: LineChart, color: "text-purple-400" },
    { name: "Enterprise", icon: Building2, color: "text-indigo-400" }
  ];

  return (
    <>
      <div className="w-full bg-[#12121a]/90 backdrop-blur-xl border border-white/5 rounded-3xl p-6 text-left shadow-2xl relative z-20">

        {/* Header */}
        <div className="flex items-center justify-between px-1 mb-4">
          <div className="font-extrabold text-white">
            Your Idea <span className="font-medium text-gray-500">— describe anything</span>
          </div>
          <div className="text-sm text-gray-500">{input.length}/500</div>
        </div>

        {/* Textarea */}
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 bg-[#0a0a0f] border border-white/5 rounded-2xl p-5 text-gray-200 placeholder-gray-600 focus:outline-none"
          placeholder="e.g. AI SaaS platform for marketing analytics..."
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-4">
          {tags.map((tag) => (
            <button key={tag.name} className="px-3 py-1 text-sm text-gray-400 rounded-full bg-white/5">
              <tag.icon className={`inline w-3 h-3 mr-1 ${tag.color}`} />
              {tag.name}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6">

          <div className="flex items-center gap-1 text-sm text-gray-500">
            Press <Command className="w-3 h-3" /> + Enter
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="bg-[#6ef0c0] text-black font-bold px-6 py-3 rounded-xl"
          >
            {loading ? "Generating..." : "Generate Stack"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 text-sm text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Result */}
      {safeResult && (
        <div className="mt-8 bg-[#14141f] border border-white/10 rounded-xl p-6 text-white">

          <h2 className="flex items-center gap-2 mb-6 text-xl font-bold">
            <Sparkles className="w-5 h-5 text-green-400" />
            Your Tech Stack
          </h2>

          {/* Architecture */}
          <div className="mb-6">
            <h3 className="mb-2 font-semibold">Architecture</h3>
            <p className="text-gray-300">{safeResult.architecture}</p>
          </div>

          {/* Technologies */}
          <div className="mb-6">
            <h3 className="mb-2 font-semibold">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {safeResult.core_technologies.map((tech, i) => (
                <span key={i} className="px-3 py-1 text-sm text-green-300 rounded-full bg-green-500/10">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Deployment */}
          <div className="mb-6">
            <h3 className="mb-2 font-semibold">Deployment</h3>
            <p className="text-gray-300">{safeResult.deployment}</p>
          </div>

          {/* Roadmap */}
          <div>
            <h3 className="mb-2 font-semibold">Roadmap</h3>
            <ul className="space-y-2">
              {safeResult.roadmap.map((step, i) => (
                <li key={i} className="text-gray-300">
                  {i + 1}. {step}
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}
    </>
  );
}


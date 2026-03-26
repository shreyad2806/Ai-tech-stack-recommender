import { useState } from "react";
import { Command, Sparkles, Rocket, BrainCircuit, Wallet, LineChart, Building2 } from "lucide-react";

export default function InputBox() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);

    fetch("http://localhost:8000/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ description: input })
    })
      .then(res => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then(data => {
        console.log(data);
        setResult(data);
      })
      .catch(err => {
        console.error(err);
        setError("Something went wrong. Try again.");
      })
      .finally(() => setLoading(false));
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
      <div className="w-full bg-[#12121a]/90 backdrop-blur-xl border border-white/5 rounded-3xl p-6 text-left shadow-2xl relative z-20 shrink-0 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:border-white/10">
      
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="font-extrabold text-[1.1rem] text-white flex items-center gap-2 tracking-wide">
          Your Idea <span className="text-gray-500 font-medium text-[0.95rem] tracking-normal">— describe anything</span>
        </div>
        <div className="text-gray-500 font-medium text-sm">0/500</div>
      </div>

      {/* Textarea */}
      <div className="relative group">
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 md:h-36 bg-[#0a0a0f] border border-white/5 hover:border-white/10 rounded-2xl p-5 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-white/10 focus:border-white/20 resize-none transition-all duration-300 leading-relaxed font-medium"
          placeholder="e.g. A real-time SaaS platform that analyzes marketing data, predicts sales trends, and scales to handle 1M+ users..."
        ></textarea>
      </div>

      {/* Tags Row */}
      <div className="flex flex-wrap items-center gap-2.5 pt-5 px-1 pb-1">
        {tags.map((tag) => (
          <button 
            key={tag.name} 
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all text-sm font-semibold text-gray-400 hover:text-gray-200 cursor-pointer"
          >
            <tag.icon className={`w-3.5 h-3.5 ${tag.color}`} />
            {tag.name}
          </button>
        ))}
      </div>

      {/* Footer Row */}
      <div className="flex items-center justify-between pt-6 mt-2 border-t border-transparent px-1">
        
        {/* Shortcut Hint */}
        <div className="flex items-center gap-1.5 text-[13px] text-gray-500 font-medium">
          <span>Press</span>
          <kbd className="flex items-center justify-center w-5 h-5 rounded-md bg-white/10 border border-white/10 font-sans mx-0.5 shadow-sm">
            <Command className="w-3 h-3" />
          </kbd>
          <span>Enter</span>
          <span className="ml-1 opacity-60">to generate</span>
        </div>
        
        {/* Generate Button */}
        <button 
          onClick={handleGenerate}
          disabled={loading || !input.trim()}
          className={`flex items-center gap-2.5 bg-[#6ef0c0] text-black font-extrabold py-3 px-6 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(110,240,192,0.15)] ${
            (loading || !input.trim())
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-[#5ce0b0] hover:-translate-y-0.5 active:translate-y-0 hover:shadow-[0_0_30px_rgba(110,240,192,0.3)] cursor-pointer'
          }`}
        >
          <Sparkles className="w-4 h-4 fill-black/20" />
          {loading ? "Generating..." : "Generate Stack"}
        </button>
        
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      </div>
      
      {/* Result Card */}
      {result && result.result && (
        <div className="mt-8 bg-[#14141f] border border-white/10 rounded-xl p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 mb-10 w-full relative z-20">
          <h2 className="text-2xl font-extrabold text-white mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
            <Sparkles className="w-6 h-6 text-[#6ef0c0]" />
            Your Recommended Tech Stack
          </h2>

          {/* Architecture Section */}
          <div className="mb-8 pl-4 border-l-2 border-[#8b8bff]/50">
            <h3 className="text-lg font-bold text-white mb-2 tracking-wide">Architecture Overview</h3>
            <p className="text-gray-300 text-[15px] leading-relaxed">
              {result.result.architecture}
            </p>
          </div>

          {/* Tech Stack Pills */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4 tracking-wide">Core Technologies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(result.result.tech_stack).map(([key, items]) => (
                <div key={key} className="bg-white/5 border border-white/5 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">
                    {key.replace('_', ' ')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {items && items.map((item, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-[#6ef0c0]/10 border border-[#6ef0c0]/20 text-[#6ef0c0] text-sm font-semibold rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deployment Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4 tracking-wide">Deployment Strategy</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.entries(result.result.deployment).map(([key, item]) => (
                <div key={key} className="bg-white/5 border border-white/5 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-2">
                    {key.replace('_', ' ')}
                  </h4>
                  <p className="text-gray-200 font-medium text-[15px]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* MVP Roadmap Section */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 tracking-wide">MVP Roadmap</h3>
            <div className="bg-white/5 border border-white/5 rounded-xl p-5">
              <ul className="space-y-4">
                {result.result.mvp_roadmap && result.result.mvp_roadmap.map((step, idx) => (
                  <li key={idx} className="flex gap-4 text-gray-300 text-[15px] leading-relaxed items-start">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-[#8b8bff]/20 text-[#8b8bff] flex items-center justify-center text-sm font-black mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

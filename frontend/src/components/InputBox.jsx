import { Loader2, Rocket } from "lucide-react";

export default function InputBox({ input, setInput, onGenerate, loading }) {
  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      onGenerate();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-3">
          What are you <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-purple-500">building</span> today?
        </h1>
        <p className="text-gray-400 text-lg">
          Describe your idea and let AI design your perfect tech stack
        </p>
      </div>

      {/* Modern AI Input */}
      <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 shadow-lg backdrop-blur">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your idea in detail..."
          className="w-full bg-transparent text-gray-200 outline-none resize-none h-28 placeholder-gray-500"
          disabled={loading}
        />

        <div className="flex justify-between items-center mt-3">
          <p className="text-xs text-gray-500">
            {input.length}/500 characters
          </p>

          <button
            onClick={onGenerate}
            disabled={loading || !input.trim()}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                Generating...
              </>
            ) : (
              "Generate"
            )}
          </button>
        </div>
      </div>

      {/* Quick Tags */}
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {[
          "Startup MVP", "AI App", "E-commerce", "SaaS Platform", 
          "Mobile App", "Data Analytics", "Social Network", "API Service"
        ].map((tag) => (
          <button
            key={tag}
            onClick={() => setInput(prev => prev + (prev ? " " : "") + tag)}
            disabled={loading}
            className="
              px-3 py-1.5 text-sm rounded-full
              bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white
              border border-white/10 hover:border-white/20
              transition-all duration-200 disabled:opacity-50
            "
          >
            {tag}
          </button>
        ))}
      </div>

    </div>
  );
}
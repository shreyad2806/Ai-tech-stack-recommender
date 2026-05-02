import { Loader2, Rocket } from "lucide-react";

export default function InputBox({ input, setInput, onGenerate, loading }) {
  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      onGenerate();
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-center">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-3">
          What are you <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">building</span> today?
        </h1>
        <p className="text-gray-400 text-lg">
          Describe your idea and let AI design your perfect tech stack
        </p>
      </div>

      {/* Input Container */}
      <div className="bg-[#0f1b2d] rounded-2xl border border-gray-800 p-6 shadow-xl">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., A real-time collaboration tool for remote teams with AI-powered suggestions..."
          className="w-full h-32 bg-[#050508] rounded-xl p-4 text-gray-100 outline-none resize-none border border-gray-700 focus:border-cyan-500/50 transition-colors placeholder-gray-500"
          disabled={loading}
        />

        {/* Character count */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-gray-500 text-sm">
            {input.length}/500 characters
          </span>
          <span className="text-gray-500 text-sm">
            ⌘ + Enter to generate
          </span>
        </div>

        {/* Generate Button */}
        <button
          onClick={onGenerate}
          disabled={loading || !input.trim()}
          className="
            w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 
            bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600
            text-white font-semibold rounded-xl transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30
          "
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Tech Stack...
            </>
          ) : (
            <>
              <Rocket className="w-5 h-5" />
              Generate Tech Stack
            </>
          )}
        </button>
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
              bg-gray-800 hover:bg-gray-700 text-gray-300
              border border-gray-700 hover:border-gray-600
              transition-all disabled:opacity-50
            "
          >
            {tag}
          </button>
        ))}
      </div>

    </div>
  );
}
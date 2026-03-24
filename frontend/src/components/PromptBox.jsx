import { useState } from "react";

export default function PromptBox({ setResult }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: input }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-8 shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Describe Your Project
        </h2>
        <p className="text-gray-400">
          Tell us about your idea, requirements, and constraints. Our AI will recommend the perfect tech stack.
        </p>
      </div>

      <div className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-40 rounded-xl bg-black border border-[#262626] p-4 text-sm text-white resize-none
                     focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all
                     placeholder-gray-500"
          placeholder="e.g., I'm building an AI-powered resume screening platform that helps recruiters rank candidates based on their skills and experience. It needs to handle PDF uploads, use natural language processing, and scale to 10,000+ users..."
        />

        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {input.length}/500 characters
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="px-8 py-3 rounded-xl font-medium text-white transition-all transform
                     bg-gradient-to-r from-pink-500 to-pink-600 
                     hover:from-pink-400 hover:to-pink-500 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:scale-[1.02] hover:shadow-lg hover:shadow-pink-500/25
                     flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Generate Tech Stack
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

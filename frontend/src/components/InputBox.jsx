import { Command, Sparkles, Rocket, BrainCircuit, Wallet, LineChart, Building2 } from "lucide-react";

export default function InputBox() {
  const tags = [
    { name: "Startup", icon: Rocket, color: "text-orange-400" },
    { name: "AI / ML", icon: BrainCircuit, color: "text-emerald-400" },
    { name: "FinTech", icon: Wallet, color: "text-blue-400" },
    { name: "Analytics", icon: LineChart, color: "text-purple-400" },
    { name: "Enterprise", icon: Building2, color: "text-indigo-400" }
  ];

  return (
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
        <button className="flex items-center gap-2.5 bg-[#6ef0c0] text-black font-extrabold py-3 px-6 rounded-xl hover:bg-[#5ce0b0] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-[0_0_20px_rgba(110,240,192,0.15)] hover:shadow-[0_0_30px_rgba(110,240,192,0.3)] cursor-pointer">
          <Sparkles className="w-4 h-4 fill-black/20" />
          Generate Stack
        </button>
        
      </div>

    </div>
  );
}

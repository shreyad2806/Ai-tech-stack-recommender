import { BarChart3, Presentation, Wallet, ArrowUpRight } from "lucide-react";

export default function ExampleCards() {
  const examples = [
    {
      id: 1,
      title: "Analytics SaaS",
      icon: BarChart3,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-400/10",
      description: "Real-time dashboards and AI-driven forecasting for marketing performance.",
      tags: ["SaaS", "AI / ML", "Real-time"]
    },
    {
      id: 2,
      title: "Telemedicine App",
      icon: Presentation,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-400/10",
      description: "Video consults, patient records, HIPAA-compliant AI diagnostics.",
      tags: ["HealthTech", "HIPAA", "Video"]
    },
    {
      id: 3,
      title: "FinTech Payment",
      icon: Wallet,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-400/10",
      description: "P2P payments, crypto wallets, AI spend insights, 1M+ scale.",
      tags: ["FinTech", "Mobile", "Scale"]
    }
  ];

  return (
    <div className="w-full max-w-4xl mt-12 mb-20 relative z-20">
      
      <div className="flex items-center gap-2.5 mb-5 ml-1">
        <div className="w-2 h-2 rounded-full bg-[#6ef0c0] shadow-[0_0_10px_rgba(110,240,192,0.8)]"></div>
        <h2 className="text-white font-bold text-[17px] tracking-wide">Try an example</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {examples.map((example) => (
          <div 
            key={example.id}
            className="group relative bg-[#14141f]/80 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)] hover:border-white/20 hover:bg-[#14141f] transition-all duration-300 cursor-pointer flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-[10px] ${example.iconBg}`}>
                <example.icon className={`w-5 h-5 ${example.iconColor}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
            </div>

            <h3 className="text-white font-extrabold text-[15px] mb-2.5 tracking-wide">{example.title}</h3>
            
            <p className="text-gray-400 text-[13px] leading-relaxed mb-6 flex-1 font-medium">
              {example.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-auto">
              {example.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-bold text-gray-500 group-hover:text-gray-300 transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

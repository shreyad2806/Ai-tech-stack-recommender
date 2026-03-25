import { TrendingUp, Network, Cloud } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "AI Recommendations",
      description: "AI analyzes your concept and recommends the best tech stack. Get tailored suggestions for frontend, backend, database, and more.",
      icon: TrendingUp,
      iconColor: "text-emerald-400",
      glowColor: "from-emerald-500",
      tags: ["React", "Node", "APIs"],
    },
    {
      title: "Architecture Design",
      description: "Instantly get a modern, scalable architecture blueprint tailored to your project's needs. From APIs to databases, see how everything fits.",
      icon: Network,
      iconColor: "text-cyan-400",
      glowColor: "from-cyan-500",
      tags: ["Postgres", "Redis"],
    },
    {
      title: "Deployment Plan",
      description: "Receive a detailed deployment strategy with cloud provider recommendations, so ready to scale seamlessly on AWS, GCP and Vercel.",
      icon: Cloud,
      iconColor: "text-purple-400",
      glowColor: "from-purple-500",
      tags: ["AWS", "GCP", "Vercel"],
    }
  ];

  return (
    <section id="features" className="py-24 px-6 max-w-7xl mx-auto text-center relative z-10">
      <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-16 tracking-wide leading-tight">
        Transform ideas into <br className="hidden md:block" />
        production-ready stacks
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div 
              key={idx} 
              className="group relative bg-[#0d0d14]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:bg-[#12121a] hover:border-white/10 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Soft background blob behind icon */}
              <div className={`absolute -top-10 -left-10 w-48 h-48 bg-linear-to-br ${feature.glowColor} to-transparent opacity-10 blur-[50px] group-hover:opacity-30 transition-opacity duration-500 rounded-full pointer-events-none`}></div>
              
              {/* Top border glow highlighting */}
              <div className={`absolute top-0 left-0 w-full h-px bg-linear-to-r ${feature.glowColor}/50 via-${feature.glowColor}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className="relative mb-6 z-10">
                <Icon className={`w-8 h-8 ${feature.iconColor}`} strokeWidth={1.5} />
              </div>

              <h3 className="text-xl font-bold text-white mb-3 tracking-wide z-10">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 grow z-10">
                {feature.description}
              </p>

              {/* Pill Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-auto z-10">
                {feature.tags.map((tag, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1 bg-white/3 border border-white/10 rounded-md text-xs font-medium text-gray-400/80 group-hover:text-gray-300 group-hover:border-white/20 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

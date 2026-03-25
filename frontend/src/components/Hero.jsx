import { Link } from "react-router-dom";
import { Play, Sparkles, Zap, Database, Triangle } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative px-6 pt-32 pb-24 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      {/* Heading */}
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8 leading-tight max-w-4xl">
        Build your{" "}
        <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-emerald-400 to-purple-500">
          tech stack
        </span>
        <br className="hidden md:block" /> in seconds with AI
      </h1>

      {/* Subtitle */}
      <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
        Describe your software idea and get a complete architecture, tech stack,
        and deployment plan powered by AI, in seconds.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
        <Link
          to="/get-started"
          className="px-8 py-3.5 text-[#09090f] bg-linear-to-r from-emerald-300 to-emerald-400 rounded-xl font-bold text-lg hover:brightness-110 transition-all shadow-[0_0_30px_rgba(52,211,153,0.3)]"
        >
          Get Started — It's Free
        </Link>
        <Link
          to="/demo"
          className="px-8 py-3.5 text-white bg-white/5 border border-white/10 rounded-xl font-medium text-lg flex items-center gap-2 hover:bg-white/10 transition-all"
        >
          <Play className="w-5 h-5 text-purple-400 fill-purple-400" />
          See How It Works
        </Link>
      </div>

      {/* Tech Logos row */}
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 mt-4 text-sm font-medium text-gray-500/80">
        <div className="flex items-center gap-2 hover:text-gray-300 transition-colors cursor-default">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Gemini</span>
        </div>
        <div className="flex items-center gap-2 font-bold tracking-widest text-gray-400 hover:text-white transition-colors cursor-default">
          NEXT.js
        </div>
        <div className="flex items-center gap-2 hover:text-gray-300 transition-colors cursor-default">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>FastAPI</span>
        </div>
        <div className="flex items-center gap-2 hover:text-gray-300 transition-colors cursor-default">
          <Database className="w-4 h-4 text-blue-300" />
          <span>Postgres</span>
        </div>
        <div className="flex items-center gap-2 hover:text-gray-300 transition-colors cursor-default">
          <Triangle className="w-4 h-4 fill-current text-gray-300" />
          <span>Vercel</span>
        </div>
      </div>
    </section>
  );
}

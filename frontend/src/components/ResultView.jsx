import { Loader2, AlertCircle, Server, Layers, Rocket, Target, Cloud } from "lucide-react";

export default function ResultView({ data }) {
  // 🔄 Loading state
  if (data?.loading) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">AI is analyzing your idea...</h3>
            <p className="text-gray-400">Designing architecture & selecting optimal tech stack</p>
          </div>
        </div>
      </div>
    );
  }

  // ❌ Error state
  if (data?.error) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-semibold">Generation Failed</h3>
          </div>
          <p className="text-red-300 mt-2">{data.error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // 🧠 FALLBACK SAFETY - No data
  if (!data || typeof data !== 'object') {
    console.log("🛡️ ResultView: No valid data provided", data);
    return null;
  }

  console.log("🎯 ResultView rendering data:", data);

  // 🎨 Color configurations
  const categoryColors = {
    frontend: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-300",
    backend: "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300", 
    database: "from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-300",
    ai_ml: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300",
    devops: "from-red-500/20 to-rose-500/20 border-red-500/30 text-red-300",
  };

  const categoryIcons = {
    frontend: Layers,
    backend: Server,
    database: Cloud,
    ai_ml: Target,
    devops: Rocket,
  };

  // 🏗️ Architecture Component
  const ArchitectureCard = ({ architecture }) => {
    if (!architecture) return null;

    return (
      <div className="bg-[#0f1b2d] rounded-xl border border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Server className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Architecture</h2>
        </div>

        {typeof architecture === "string" ? (
          <p className="text-gray-300 leading-relaxed">{architecture}</p>
        ) : architecture?.description ? (
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">{architecture.description}</p>
            
            {architecture.layers?.map((layer, i) => (
              <div key={i} className="bg-[#050508] rounded-lg p-4 border border-gray-700">
                <h4 className="font-semibold text-white mb-3">{layer.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(layer.components) && layer.components.map((component, j) => (
                    <span
                      key={j}
                      className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-full text-sm border border-gray-600"
                    >
                      {component}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No architecture details provided</p>
        )}
      </div>
    );
  };

  // 🧰 Tech Stack Component
  const TechStackCard = ({ tech_stack }) => {
    if (!tech_stack || typeof tech_stack !== 'object') return null;

    const entries = Object.entries(tech_stack).filter(([key, value]) => 
      Array.isArray(value) && value.length > 0
    );

    if (entries.length === 0) return null;

    return (
      <div className="bg-[#0f1b2d] rounded-xl border border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Layers className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Tech Stack</h2>
        </div>

        <div className="space-y-6">
          {entries.map(([category, technologies]) => {
            const Icon = categoryIcons[category] || Layers;
            const colorClass = categoryColors[category] || categoryColors.frontend;
            
            return (
              <div key={category}>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {category.replace('_', ' / ')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, i) => (
                    <span
                      key={i}
                      className={`
                        px-3 py-1.5 rounded-full text-sm font-medium
                        bg-gradient-to-r ${colorClass}
                        border hover:scale-105 transition-transform cursor-default
                      `}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 🚀 Deployment Component
  const DeploymentCard = ({ deployment }) => {
    if (!deployment) return null;

    return (
      <div className="bg-[#0f1b2d] rounded-xl border border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Cloud className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Deployment Strategy</h2>
        </div>
        <p className="text-gray-300 leading-relaxed">{deployment}</p>
      </div>
    );
  };

  // 🗺️ Roadmap Component
  const RoadmapCard = ({ roadmap }) => {
    if (!roadmap || !Array.isArray(roadmap) || roadmap.length === 0) return null;

    return (
      <div className="bg-[#0f1b2d] rounded-xl border border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Implementation Roadmap</h2>
        </div>

        <div className="space-y-4">
          {roadmap.map((step, index) => (
            <div key={index} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-sm font-semibold text-cyan-300 flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-gray-300 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Success Header */}
      {data && !data.loading && !data.error && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            Tech Stack Generated Successfully
          </div>
          <h2 className="text-2xl font-bold text-white">Your Architecture is Ready</h2>
        </div>
      )}

      {/* Render all components */}
      <ArchitectureCard architecture={data?.architecture} />
      <TechStackCard tech_stack={data?.tech_stack} />
      <DeploymentCard deployment={data?.deployment} />
      <RoadmapCard roadmap={data?.roadmap} />
    </div>
  );
}
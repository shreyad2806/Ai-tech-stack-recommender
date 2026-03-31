import { 
  ArrowRight,
  Bot,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  Globe,
  Layers,
  LineChart,
  Loader2,
  Network,
  Rocket,
  Server,
  Target,
  Terminal,
  Wallet,
  Cloud
} from "lucide-react";

// 🛡️ SAFE DATA PARSING - Step 1: Fix data handling
const safeParseResult = (result) => {
  if (!result) return null;
  
  // If result is string, try to parse JSON
  if (typeof result === "string") {
    try {
      const parsed = JSON.parse(result);
      return safeParseResult(parsed);
    } catch {
      // If parsing fails, treat as raw architecture text
      return {
        architecture: result,
        core_technologies: [],
        deployment: "",
        roadmap: []
      };
    }
  }
  
  if (typeof result !== "object") return null;
  
  return {
    architecture: result.architecture || "",
    core_technologies: Array.isArray(result.core_technologies) 
      ? result.core_technologies 
      : typeof result.core_technologies === "object" && result.core_technologies !== null
        ? Object.values(result.core_technologies)
        : [],
    deployment: result.deployment || "",
    roadmap: Array.isArray(result.roadmap) 
      ? result.roadmap 
      : typeof result.roadmap === "object" && result.roadmap !== null
        ? Object.values(result.roadmap)
        : [],
    // NEW OPTIONAL FIELDS - Backward compatible
    architecture_diagram: result.architecture_diagram || { nodes: [], edges: [] },
    roadmap_phases: Array.isArray(result.roadmap_phases) ? result.roadmap_phases : [],
    deployment_structured: result.deployment_structured || {}
  };
};

// 🏷️ TECHNOLOGY TAGS - Step 5: Group technologies
const categorizeTech = (tech) => {
  const tech_lower = tech.toLowerCase();
  
  // Frontend technologies
  if (tech_lower.match(/react|vue|angular|svelte|next|nuxt|gatsby|html|css|tailwind|bootstrap|material|jquery/)) {
    return "frontend";
  }
  
  // Backend technologies
  if (tech_lower.match(/node|python|fastapi|django|flask|express|spring|java|go|rust|ruby|php|laravel/)) {
    return "backend";
  }
  
  // Database technologies
  if (tech_lower.match(/postgresql|mysql|mongodb|redis|sqlite|dynamodb|cassandra|neo4j/)) {
    return "database";
  }
  
  // AI/ML technologies
  if (tech_lower.match(/openai|gpt|claude|anthropic|gemini|tensorflow|pytorch|huggingface|ml|ai/)) {
    return "ai";
  }
  
  // DevOps/Deployment
  if (tech_lower.match(/docker|kubernetes|aws|azure|gcp|vercel|netlify|heroku|railway|ci\/cd|jenkins|github/)) {
    return "devops";
  }
  
  return "other";
};

const getCategoryColor = (category) => {
  const colors = {
    frontend: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-300",
    backend: "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300",
    database: "from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-300",
    ai: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300",
    devops: "from-red-500/20 to-rose-500/20 border-red-500/30 text-red-300",
    other: "from-gray-500/20 to-slate-500/20 border-gray-500/30 text-gray-300"
  };
  return colors[category] || colors.other;
};

const getCategoryIcon = (category) => {
  const icons = {
    frontend: Code2,
    backend: Terminal,
    database: Database,
    ai: Cpu,
    devops: Cloud,
    other: Layers
  };
  return icons[category] || icons.other;
};

// 🏗️ ARCHITECTURE DIAGRAM - Step 7: Visual flow diagram
const ArchitectureDiagram = ({ architecture }) => {
  const flowSteps = [
    { icon: Globe, label: "User", color: "blue" },
    { icon: Code2, label: "Frontend", color: "cyan" },
    { icon: Terminal, label: "Backend", color: "green" },
    { icon: Cpu, label: "AI Core", color: "purple", highlight: true },
    { icon: Database, label: "Database", color: "orange" }
  ];

  return (
    <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] rounded-xl p-5 border border-gray-800/50">
      <h4 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
        <Server className="w-4 h-4" />
        System Flow
      </h4>
      
      {/* Flow Diagram */}
      <div className="flex items-center justify-between gap-2 mb-6">
        {flowSteps.map((step, index) => (
          <div key={step.label} className="flex items-center gap-2">
            <div className={`
              flex flex-col items-center gap-1.5
              ${step.highlight ? 'scale-110' : ''}
            `}>
              <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center
                bg-gradient-to-br ${step.highlight 
                  ? 'from-purple-500/30 to-pink-500/30 border-2 border-purple-400/50 shadow-lg shadow-purple-500/20' 
                  : 'from-gray-700/50 to-gray-800/50 border border-gray-700'
                }
              `}>
                <step.icon className={`w-5 h-5 ${step.highlight ? 'text-purple-300' : 'text-gray-400'}`} />
              </div>
              <span className={`text-xs ${step.highlight ? 'text-purple-300 font-medium' : 'text-gray-500'}`}>
                {step.label}
              </span>
            </div>
            {index < flowSteps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-gray-600 mx-1" />
            )}
          </div>
        ))}
      </div>

      {/* AI Pipeline Detail */}
      {architecture && (
        <div className="border-t border-gray-800/50 pt-4">
          <h4 className="text-xs font-medium text-purple-400/80 mb-3 flex items-center gap-2">
            <Cpu className="w-3 h-3" />
            AI Processing Pipeline
          </h4>
          <div className="flex items-center justify-center gap-3 text-xs">
            <div className="px-3 py-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300">
              Input
            </div>
            <ArrowRight className="w-3 h-3 text-gray-600" />
            <div className="px-3 py-1.5 rounded-md bg-purple-500/20 border border-purple-500/30 text-purple-300 font-medium">
              LLM
            </div>
            <ArrowRight className="w-3 h-3 text-gray-600" />
            <div className="px-3 py-1.5 rounded-md bg-green-500/10 border border-green-500/20 text-green-300">
              Output
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 🗺️ ROADMAP - Step 8: Timeline UI
const RoadmapTimeline = ({ steps }) => {
  if (!Array.isArray(steps) || steps.length === 0) return null;

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const value = typeof step === "string" ? step : JSON.stringify(step);
        
        return (
          <div key={index} className="flex gap-4">
            {/* Timeline line and number */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-sm font-semibold text-cyan-300">
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className="w-px h-full bg-gradient-to-b from-cyan-500/30 to-transparent my-2" />
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="bg-[#1a1a2e]/80 rounded-lg p-4 border border-gray-800/50">
                <p className="text-gray-300 text-sm leading-relaxed">{value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 🎯 ENHANCED DIAGRAM COMPONENT
const EnhancedDiagram = ({ diagram }) => {
  if (!diagram?.nodes || !Array.isArray(diagram.nodes) || diagram.nodes.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#0f172a] rounded-lg p-4 border border-gray-800">
      <h4 className="text-sm font-medium text-gray-400 mb-4">System Architecture</h4>
      
      {/* Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {diagram.nodes.map((node) => (
          <div
            key={node.id}
            className={`
              p-3 rounded-lg border text-center
              ${node.type === 'component' ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' : ''}
              ${node.type === 'service' ? 'bg-green-500/10 border-green-500/30 text-green-300' : ''}
              ${node.type === 'data' ? 'bg-orange-500/10 border-orange-500/30 text-orange-300' : ''}
              ${!node.type ? 'bg-gray-500/10 border-gray-500/30 text-gray-300' : ''}
            `}
          >
            <div className="font-medium text-sm">{node.label}</div>
            <div className="text-xs opacity-75 mt-1">{node.type}</div>
          </div>
        ))}
      </div>

      {/* Connections */}
      {diagram.edges && Array.isArray(diagram.edges) && diagram.edges.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-gray-500 uppercase">Connections</h5>
          {diagram.edges.map((edge, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <span className="text-blue-400">{edge.from}</span>
              <ArrowRight className="w-3 h-3 text-gray-500" />
              <span className="text-green-400">{edge.to}</span>
              {edge.label && (
                <span className="text-gray-500 ml-2">({edge.label})</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 🗺️ STARTUP ROADMAP COMPONENT
const StartupRoadmap = ({ phases }) => {
  if (!Array.isArray(phases) || phases.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {phases.map((phase, index) => (
        <div key={index} className="relative">
          {/* Phase Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-sm font-semibold text-purple-300">
              {index + 1}
            </div>
            <h4 className="text-lg font-semibold text-white">{phase.phase}</h4>
          </div>

          {/* Phase Items */}
          {phase.items && Array.isArray(phase.items) && (
            <div className="ml-11 space-y-2">
              {phase.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* Connector Line */}
          {index < phases.length - 1 && (
            <div className="absolute left-4 top-12 w-px h-full bg-gradient-to-b from-purple-500/30 to-transparent" />
          )}
        </div>
      ))}
    </div>
  );
};

// ☁️ DEPLOYMENT PLAN COMPONENT
const DeploymentPlan = ({ deployment }) => {
  if (!deployment || typeof deployment !== 'object' || Object.keys(deployment).length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(deployment).map(([key, value]) => (
        <div key={key} className="bg-[#0f172a] rounded-lg p-4 border border-gray-800">
          <h5 className="text-sm font-medium text-cyan-400 capitalize mb-2">
            {key.replace(/_/g, ' ')}
          </h5>
          <p className="text-gray-300 text-sm">
            {typeof value === 'object' ? JSON.stringify(value) : value}
          </p>
        </div>
      ))}
    </div>
  );
};

// 🎯 TECHNOLOGY TAGS COMPONENT
const TechnologyTags = ({ technologies }) => {
  if (!Array.isArray(technologies) || technologies.length === 0) return null;
  
  const categorized = technologies.reduce((acc, tech) => {
    const category = categorizeTech(tech);
    if (!acc[category]) acc[category] = [];
    acc[category].push(tech);
    return acc;
  }, {});

  const categoryOrder = ["frontend", "backend", "database", "ai", "devops", "other"];
  const categoryLabels = {
    frontend: "Frontend",
    backend: "Backend",
    database: "Database",
    ai: "AI / ML",
    devops: "DevOps",
    other: "Other"
  };

  return (
    <div className="space-y-4">
      {categoryOrder.map(category => {
        const techs = categorized[category];
        if (!techs || techs.length === 0) return null;
        
        const Icon = getCategoryIcon(category);
        
        return (
          <div key={category}>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Icon className="w-3 h-3" />
              {categoryLabels[category]}
            </h4>
            <div className="flex flex-wrap gap-2">
              {techs.map((tech, index) => (
                <span
                  key={index}
                  className={`
                    px-3 py-1.5 rounded-full text-sm font-medium
                    bg-gradient-to-r ${getCategoryColor(category)}
                    border hover:scale-105 transition-transform
                  `}
                >
                  {typeof tech === "string" ? tech : JSON.stringify(tech)}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 🎴 CLEAN CARDS - Step 3: Modern card components
const Card = ({ title, icon: Icon, children, className = "" }) => (
  <div className={`bg-[#111827] rounded-xl border border-gray-800 p-5 ${className}`}>
    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
      {Icon && <Icon className="w-5 h-5 text-cyan-400" />}
      {title}
    </h3>
    {children}
  </div>
);

// 🚀 MAIN COMPONENT
export default function InputBox({ input, setInput, result, setResult }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🛡️ Safe result parsing
  const safeResult = safeParseResult(result);

  // 🚀 GENERATE
  const handleGenerate = async () => {
    if (!input.trim()) return;

    const idea = input.trim();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      console.log("📤 Sending request to backend...");
      
      const res = await fetch("http://127.0.0.1:8000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idea }),
      });

      // STEP 8: LOG RAW API RESPONSE
      const text = await res.text();
      console.log("API RAW:", text);

      let data;
      try {
        data = JSON.parse(text);
        console.log("✅ Parsed JSON:", data);
      } catch (parseErr) {
        console.error("❌ Invalid JSON from backend:", parseErr);
        throw new Error("Invalid JSON from backend");
      }
      
      // 🛡️ Ensure data is properly structured
      const normalized = safeParseResult(data);
      console.log("Normalized result:", normalized);
      
      setResult(normalized);

      // 💾 Save to localStorage
      localStorage.setItem("lastStack", JSON.stringify(data));
      localStorage.setItem("lastIdea", idea);

    } catch (err) {
      console.error("Frontend error:", err);
      setError("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const quickTags = [
    { name: "Startup", icon: Rocket, color: "from-cyan-500/20 to-blue-500/20" },
    { name: "AI / ML", icon: BrainCircuit, color: "from-purple-500/20 to-pink-500/20" },
    { name: "FinTech", icon: Wallet, color: "from-green-500/20 to-emerald-500/20" },
    { name: "Analytics", icon: LineChart, color: "from-orange-500/20 to-amber-500/20" },
    { name: "Enterprise", icon: Building2, color: "from-red-500/20 to-rose-500/20" },
  ];

  return (
    <div className="space-y-6">
      {/* 🎯 INPUT SECTION */}
      <div className="bg-[#111827] rounded-xl border border-gray-800 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <label className="text-white font-semibold">
            Describe Your Idea
            <span className="text-gray-500 font-normal ml-2">— be specific for better results</span>
          </label>
          <span className="text-gray-500 text-sm">{input.length}/500</span>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={500}
          className="w-full h-32 bg-[#0B0F19] rounded-lg p-4 text-gray-200 outline-none resize-none border border-gray-800 focus:border-cyan-500/50 transition-colors"
          placeholder="e.g., A real-time collaboration tool for remote teams with AI-powered suggestions..."
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              handleGenerate();
            }
          }}
        />

        {/* Quick Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {quickTags.map((tag) => (
            <button
              key={tag.name}
              onClick={() => setInput(prev => prev + (prev ? " " : "") + tag.name + " ")}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
                bg-gradient-to-r ${tag.color} text-gray-300
                border border-white/5 hover:scale-105 transition-transform
              `}
            >
              <tag.icon className="w-3.5 h-3.5" />
              {tag.name}
            </button>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-800">
          <span className="text-gray-500 text-sm">Press ⌘ + Enter to generate</span>

          <button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="
              flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold
              bg-gradient-to-r from-cyan-500 to-blue-500 text-white
              hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
              transition-all shadow-lg shadow-cyan-500/20
            "
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                Generate Stack
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      {/* ⏳ LOADING STATE */}
      {loading && !safeResult && (
        <div className="bg-[#111827] rounded-xl border border-gray-800 p-12 text-center">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">AI is analyzing your idea...</p>
          <p className="text-gray-600 text-sm mt-1">Designing architecture & selecting optimal tech stack</p>
        </div>
      )}

      {/* ✅ RESULTS DASHBOARD */}
      {safeResult && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-semibold">Your Tech Stack is Ready</span>
          </div>

          {/* Architecture Card */}
          <Card title="Architecture" icon={Server}>
            {safeResult.architecture ? (
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {typeof safeResult.architecture === "object" 
                    ? JSON.stringify(safeResult.architecture, null, 2)
                    : safeResult.architecture}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 italic">No architecture details provided</p>
            )}
            
            {/* Architecture Diagram */}
            <div className="mt-6">
              <ArchitectureDiagram architecture={safeResult.architecture} />
            </div>
          </Card>

          {/* Technology Stack Card */}
          <Card title="Technology Stack" icon={Layers}>
            {safeResult.core_technologies && safeResult.core_technologies.length > 0 ? (
              <TechnologyTags technologies={safeResult.core_technologies} />
            ) : (
              <p className="text-gray-500 italic">No technologies specified</p>
            )}
          </Card>

          {/* Deployment Card */}
          <Card title="Deployment Strategy" icon={Cloud}>
            {safeResult.deployment ? (
              <div className="text-gray-300 leading-relaxed">
                {typeof safeResult.deployment === "object" 
                  ? Object.entries(safeResult.deployment).map(([key, value]) => (
                      <div key={key} className="mb-2">
                        <span className="font-semibold text-cyan-400">{key}:</span>{" "}
                        <span>{typeof value === "object" ? JSON.stringify(value) : value}</span>
                      </div>
                    ))
                  : safeResult.deployment}
              </div>
            ) : (
              <p className="text-gray-500 italic">No deployment strategy provided</p>
            )}
          </Card>

          {/* Roadmap Card */}
          <Card title="Implementation Roadmap" icon={CheckCircle2}>
            {safeResult.roadmap && safeResult.roadmap.length > 0 ? (
              <RoadmapTimeline steps={safeResult.roadmap} />
            ) : (
              <p className="text-gray-500 italic">No roadmap provided</p>
            )}
          </Card>

          {/* NEW ENHANCED SECTIONS */}
          
          {/* Enhanced Architecture Diagram */}
          {safeResult.architecture_diagram && (
            <Card title="Enhanced Diagram" icon={Network}>
              <EnhancedDiagram diagram={safeResult.architecture_diagram} />
            </Card>
          )}

          {/* Startup Roadmap Phases */}
          {safeResult.roadmap_phases && safeResult.roadmap_phases.length > 0 && (
            <Card title="Startup Roadmap" icon={Target}>
              <StartupRoadmap phases={safeResult.roadmap_phases} />
            </Card>
          )}

          {/* Deployment Plan */}
          {safeResult.deployment_structured && Object.keys(safeResult.deployment_structured).length > 0 && (
            <Card title="Deployment Plan" icon={Cloud}>
              <DeploymentPlan deployment={safeResult.deployment_structured} />
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

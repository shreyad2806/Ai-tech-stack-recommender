import { useState } from "react";
import { 
  ArrowRight,
  Bot,
  BrainCircuit,
  Building2,
  CheckCircle,
  CheckCircle2,
  Code,
  Code2,
  Cpu,
  Database,
  Download,
  ExternalLink,
  Globe,
  Key,
  Layers,
  LineChart,
  Loader2,
  Rocket,
  Server,
  Share,
  Target,
  Terminal,
  Wallet,
  Zap,
  Cloud,
  AlertCircle  
} from "lucide-react";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ArchitectureDiagram from "./ArchitectureDiagram";

// 🌐 API Configuration
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

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

// ☁️ DEPLOYMENT PLAN COMPONENT - Beginner Friendly
const DeploymentPlan = ({ deployment }) => {
  // Default beginner-friendly deployment data
  const defaultDeployment = {
    frontend: "Deploy on Vercel (free, fast, ideal for React apps)",
    backend: "Deploy on Render / Railway (easy Python/FastAPI hosting)",
    database: "Use Supabase / Firebase (no setup, free tier)",
    ai_model: "Use API-based models (Gemini / OpenAI)",
    quick_start: "For demo projects, use Streamlit for full app deployment"
  };

  const deployData = deployment && Object.keys(deployment).length > 0 
    ? deployment 
    : defaultDeployment;

  // Service icons and colors
  const serviceConfig = {
    frontend: { icon: Code2, color: "blue", label: "Frontend" },
    backend: { icon: Server, color: "green", label: "Backend" },
    database: { icon: Database, color: "orange", label: "Database" },
    ai_model: { icon: Cpu, color: "purple", label: "AI Model" },
    quick_start: { icon: Zap, color: "yellow", label: "Quick Demo" }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-500/10 border-blue-500/30 text-blue-300",
      green: "bg-green-500/10 border-green-500/30 text-green-300",
      orange: "bg-orange-500/10 border-orange-500/30 text-orange-300",
      purple: "bg-purple-500/10 border-purple-500/30 text-purple-300",
      yellow: "bg-yellow-500/10 border-yellow-500/30 text-yellow-300"
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(deployData).map(([key, value]) => {
          const config = serviceConfig[key] || { icon: Cloud, color: "blue", label: key };
          const Icon = config.icon;
          
          return (
            <div 
              key={key} 
              className={`rounded-lg p-4 border ${getColorClasses(config.color)} transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-md bg-${config.color}-500/20`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h5 className="font-semibold text-white capitalize">
                  {config.label}
                </h5>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                {typeof value === 'object' ? JSON.stringify(value) : value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Deploy Section */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-5 border border-cyan-500/30">
        <div className="flex items-center gap-3 mb-4">
          <Rocket className="w-6 h-6 text-cyan-400" />
          <h4 className="text-lg font-semibold text-white">Quick Deploy (1-day setup)</h4>
        </div>
        
        <div className="space-y-3">
          {[
            { step: 1, text: "Push code to GitHub", icon: Code },
            { step: 2, text: "Deploy frontend on Vercel", icon: ExternalLink },
            { step: 3, text: "Deploy backend on Render", icon: Server },
            { step: 4, text: "Connect API keys", icon: Key },
            { step: 5, text: "Go live!", icon: Globe }
          ].map(({ step, text, icon: Icon }) => (
            <div key={step} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-semibold text-sm">
                {step}
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Icon className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{text}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-cyan-500/20">
          <p className="text-xs text-gray-400">
            Perfect for college projects, hackathons, and portfolio demos. No DevOps experience needed!
          </p>
        </div>
      </div>
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
      if (import.meta.env.DEV) console.log("📤 Sending request to backend...");
      
      const res = await fetch(`${API_URL}/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idea }),
      });

      // STEP 8: LOG RAW API RESPONSE
      const text = await res.text();
      if (import.meta.env.DEV) console.log("API RAW:", text);

      let data;
      try {
        data = JSON.parse(text);
        if (import.meta.env.DEV) console.log("✅ Parsed JSON:", data);
      } catch (parseErr) {
        if (import.meta.env.DEV) console.error("❌ Invalid JSON from backend:", parseErr);
        throw new Error("Invalid JSON from backend");
      }
      
      // 🛡️ Ensure data is properly structured
      const normalized = safeParseResult(data);
      if (import.meta.env.DEV) console.log("Normalized result:", normalized);
      
      setResult(normalized);

      // 💾 Save to localStorage
      localStorage.setItem("lastStack", JSON.stringify(data));
      localStorage.setItem("lastIdea", idea);

    } catch (err) {
      if (import.meta.env.DEV) console.error("Frontend error:", err);
      setError("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 📄 EXPORT PDF
  const handleExportPDF = async () => {
    const element = document.getElementById("export-section");
    if (!element) return;

    try {
      // Show loading state
      const originalOverflow = element.style.overflow;
      element.style.overflow = "visible";

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#0f172a", // Dark background
        logging: false,
      });

      // Restore original state
      element.style.overflow = originalOverflow;

      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 20; // Top margin

      // Add watermark
      pdf.setFontSize(10);
      pdf.setTextColor(150);
      pdf.text("Generated by StackMind", pdfWidth - 60, pdfHeight - 10);

      // Add image
      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      pdf.save("tech-stack.pdf");
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("Failed to export PDF. Please try again.");
    }
  };

  // 🔗 SHARE STACK
  const handleShare = async () => {
    try {
      const res = await fetch(`${API_URL}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });

      if (!res.ok) throw new Error("Failed to share");

      const data = await res.json();
      const shareUrl = `${window.location.origin}/share/${data.id}`;

      navigator.clipboard.writeText(shareUrl);
      alert("Shareable link copied to clipboard!");
    } catch (err) {
      if (import.meta.env.DEV) console.error("Share failed:", err);
      alert("Failed to share. Please try again.");
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
        <div id="export-section" className="space-y-6">
          {/* Header with Export Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
              <span className="font-semibold">Your Tech Stack is Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                  bg-blue-600 hover:bg-blue-500 text-white border border-blue-500
                  transition-all hover:scale-105
                "
              >
                <Share className="w-4 h-4" />
                Share
              </button>
              <button
                onClick={handleExportPDF}
                className="
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                  bg-gray-800 hover:bg-gray-700 text-white border border-gray-700
                  transition-all hover:scale-105
                "
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
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

          {/* Roadmap Card */}
          <Card title="Implementation Roadmap" icon={CheckCircle2}>
            {safeResult.roadmap && safeResult.roadmap.length > 0 ? (
              <RoadmapTimeline steps={safeResult.roadmap} />
            ) : (
              <p className="text-gray-500 italic">No roadmap provided</p>
            )}
          </Card>

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

import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Layers,
  Server,
  Cloud,
  Target,
  Rocket,
  Download,
  Maximize2,
  X,
} from "lucide-react";
import { useState } from "react";

/* =========================
   ICON + CATEGORY CONFIG
========================= */
const categoryIcons = {
  frontend: Layers,
  backend: Server,
  database: Cloud,
  ai_ml: Target,
  devops: Rocket,
};

const categoryNames = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  ai_ml: "AI / ML",
  devops: "DevOps",
};

/* =========================
   MAIN COMPONENT
========================= */
export default function ResultView({ data, isLoading }) {
  /* ===== LOADING ===== */
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              AI is analyzing your idea...
            </h3>
            <p className="text-white/50">
              Designing architecture & selecting optimal tech stack
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ===== EMPTY STATES ===== */
  if (!data || typeof data !== "object") return null;

  if (data?.error) {
    return (
      <div className="text-red-400 text-center mt-10">
        Error: {data.error}
      </div>
    );
  }

  /* ===== SAFE DATA ===== */
  const safeData = {
    tech_stack: data?.tech_stack || {},
    architecture: data?.architecture || {},
    deployment: data?.deployment || "",
    roadmap: data?.roadmap || [],
    cost: data?.cost || null,
    reasoning: data?.reasoning || null,
    idea: data?.idea || "Your project",
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 space-y-6">

      {/* SUCCESS BADGE */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          <CheckCircle className="w-4 h-4" />
          Tech Stack Generated
        </div>
      </div>

      
      {/* TECH STACK */}
      <TechStackCard techStack={safeData?.tech_stack} />

      {/* COST ESTIMATE */}
      {safeData?.cost && (
        <CostCard cost={safeData?.cost} />
      )}

      {/* REASONING */}
      {safeData?.reasoning && (
        <ReasoningCard reasoning={safeData?.reasoning} />
      )}

      {/* DEPLOYMENT */}
      <DeploymentCard deployment={safeData?.deployment} />

      {/* ROADMAP */}
      <RoadmapCard roadmap={safeData?.roadmap} />
    </div>
  );
}


/* =========================
   TECH STACK
========================= */
function TechStackCard({ techStack }) {
  console.log("TECHSTACK CARD - techStack:", techStack);
  console.log("TECHSTACK CARD - entries:", Object.entries(techStack || {}));
  
  if (!techStack) return null;

  const entries = Object.entries(techStack);

  const normalize = (items) => {
    if (!items) return [];

    if (!Array.isArray(items)) items = [items];

    return items.map((item) => {
      if (typeof item === "string") return item;

      if (typeof item === "object") {
        return item.name || JSON.stringify(item);
      }

      return "Unknown";
    });
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-5">
        Tech Stack
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {entries.map(([category, items]) => {
          const Icon = categoryIcons?.[category] || Layers;
          const name = categoryNames?.[category] || category;

          const safeItems = normalize(items);

          return (
            <div
              key={category}
              className="bg-white/5 border border-white/10 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-white/80">{name}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {safeItems.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs rounded-full bg-emerald-500/10 border border-emerald-500/20"
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
}

/* =========================
   DEPLOYMENT
========================= */
function DeploymentCard({ deployment }) {
  if (!deployment) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-3">
        Deployment
      </h2>
      <p className="text-white/70">{deployment}</p>
    </div>
  );
}

/* =========================
   COST ESTIMATE
========================= */
function CostCard({ cost }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-3">
        Cost Estimate
      </h2>
      
      {cost ? (
        typeof cost === 'string' ? (
          <p className="text-white/70">{cost}</p>
        ) : (
          <div className="space-y-3">
            {cost.estimate && (
              <p className="text-white/70 font-medium">{cost.estimate}</p>
            )}
            {cost.breakdown && cost.breakdown.length > 0 && (
              <ul className="mt-2 text-sm text-gray-400 space-y-1">
                {cost.breakdown.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            )}
          </div>
        )
      ) : (
        <div className="text-center py-4 border-2 border-dashed border-white/20 rounded-xl">
          <div className="text-gray-400 text-sm">
            Cost estimate not available
          </div>
          <div className="text-gray-500 text-xs mt-1">
            Check backend response for cost data
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   REASONING
========================= */
function ReasoningCard({ reasoning }) {
  if (!reasoning) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-3">
        Why This Stack?
      </h2>
      
      {Array.isArray(reasoning) ? (
        <div className="space-y-2">
          {reasoning.map((point, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-white/70">
                {typeof point === "string" ? point : point?.text || JSON.stringify(point)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white/70">{reasoning}</p>
      )}
    </div>
  );
}

/* =========================
   ROADMAP
========================= */
function RoadmapCard({ roadmap }) {
  if (!roadmap || roadmap.length === 0) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">
        Roadmap
      </h2>

      <div className="space-y-3">
        {roadmap.map((step, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-6 h-6 bg-emerald-500 rounded-full text-xs flex items-center justify-center text-white">
              {i + 1}
            </div>
            <p className="text-white/80">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
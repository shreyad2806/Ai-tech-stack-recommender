import { useState } from "react";

import {
  Monitor,
  Server,
  Database,
  Brain,
  Rocket,
  Layers,
} from "lucide-react";

import ArchitectureCanvas from "./visuals/ArchitectureCanvas";
import WorkflowInfographic from "./WorkflowInfographic";
import BuildModes from "./buildmodes";

const categoryIcons = {
  frontend: Monitor,
  backend: Server,
  database: Database,
  ai: Brain,
  ai_ml: Brain,
  devops: Rocket,
  storage: Layers,
};

const categoryNames = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  ai: "AI / ML",
  ai_ml: "AI / ML",
  devops: "DevOps",
  storage: "Storage",
};

export default function ResultView({ data }) {
  const [activeTab, setActiveTab] = useState("tech");

  if (!data) return null;

  const safeData = data?.data || data || {};

  const normalizeArray = (arr = []) => {
    if (!arr) return [];

    if (!Array.isArray(arr)) {
      arr = [arr];
    }

    return arr.map((item) => {
      if (typeof item === "string") {
        return {
          name: item,
          purpose: "",
        };
      }

      if (typeof item === "object" && item !== null) {
        return {
          name: item.name || "Unknown",
          purpose: item.purpose || "",
        };
      }

      return {
        name: "Unknown",
        purpose: "",
      };
    });
  };

  const techStack = {
    frontend: normalizeArray(
      safeData.frontend ||
        safeData.tech_stack?.frontend
    ),

    backend: normalizeArray(
      safeData.backend ||
        safeData.tech_stack?.backend
    ),

    database: normalizeArray(
      safeData.database ||
        safeData.tech_stack?.database
    ),

    ai: normalizeArray(
      safeData.ai ||
        safeData.ai_ml ||
        safeData.tech_stack?.ai ||
        safeData.tech_stack?.ai_ml
    ),

    devops: normalizeArray(
      safeData.devops ||
        safeData.tech_stack?.devops
    ),

    storage: normalizeArray(
      safeData.storage ||
        safeData.tech_stack?.storage
    ),
  };

  const tabs = [
    { id: "tech", label: "Tech Stack" },
    { id: "architecture", label: "Architecture" },
    { id: "workflow", label: "AI Workflow" },
    { id: "modes", label: "Build Modes" },
    { id: "deployment", label: "Deployment" },
    { id: "why", label: "Why This Stack?" },
    { id: "roadmap", label: "Cost & Roadmap" },
  ];

  return (
    <div className="w-full">

      {/* SUCCESS */}
      <div className="mb-8">
        <span className="px-5 py-2 text-sm border rounded-full bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
          ● Tech Stack Generated
        </span>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-10 mb-10 border-b border-zinc-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm transition-all duration-200 ${
              activeTab === tab.id
                ? "text-emerald-400 border-b border-emerald-400"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TECH STACK */}
      {activeTab === "tech" && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {Object.entries(techStack).map(
            ([category, items]) => {
              const Icon =
                categoryIcons?.[category] || Layers;

              const title =
                categoryNames?.[category] || category;

              return (
                <div
                  key={category}
                  className="p-6 transition-all border rounded-3xl border-zinc-800 bg-zinc-950 hover:border-emerald-500/30"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Icon className="w-5 h-5 text-emerald-400" />

                    <h3 className="text-2xl font-semibold text-white">
                      {title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-3">

                    {items.length > 0 ? (
                      items.map((item, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 border rounded-2xl bg-emerald-500/10 border-emerald-500/20"
                        >
                          <div className="font-medium text-white">
                            {item.name}
                          </div>

                          {item.purpose && (
                            <div className="mt-1 text-xs text-zinc-400">
                              {item.purpose}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-zinc-500">
                        None
                      </div>
                    )}

                  </div>
                </div>
              );
            }
          )}
        </div>
      )}

      {/* ARCHITECTURE */}
      {activeTab === "architecture" && (
        <ArchitectureCanvas graph={safeData.architecture_graph || safeData.architecture || {}} />
      )}

      {/* WORKFLOW */}
      {activeTab === "workflow" && (
        <WorkflowInfographic workflow={safeData.workflow_infographic || safeData.workflow || []} />
      )}

      {/* BUILD MODES */}
      {activeTab === "modes" && (
        <BuildModes modes={safeData.build_modes} />
      )}

      {/* DEPLOYMENT */}
      {activeTab === "deployment" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {Object.entries(safeData.deployment || {}).map(
            ([key, value]) => (
              <div
                key={key}
                className="bg-[#07111f] border border-white/10 rounded-3xl p-8"
              >
                <div className="mb-4 text-lg tracking-wide uppercase text-emerald-400">
                  {key.replace("_", " ")}
                </div>

                <div className="text-xl leading-relaxed text-gray-300">
                  {value}
                </div>
              </div>
            )
          )}

        </div>
      )}

      {/* WHY THIS STACK */}
      {activeTab === "why" && (
        <div className="bg-[#07111f] border border-white/10 rounded-3xl p-10">

          <h2 className="mb-8 text-4xl font-bold text-white">
            Why This Stack?
          </h2>

          <div className="space-y-5">

            {(Array.isArray(safeData.reasoning)
              ? safeData.reasoning
              : []
            ).map((reason, index) => (
              <div
                key={index}
                className="flex items-start gap-4"
              >
                <div className="w-2 h-2 mt-3 rounded-full bg-emerald-400" />

                <p className="text-lg leading-relaxed text-gray-300">
                  {reason}
                </p>
              </div>
            ))}

          </div>
        </div>
      )}

      {/* ROADMAP */}
      {activeTab === "roadmap" && (
        <div className="space-y-6">

          {/* COST */}
          <div className="p-8 border rounded-3xl border-zinc-800 bg-zinc-950">

            <h2 className="mb-6 text-2xl font-semibold text-white">
              Cost Estimate
            </h2>

            <p className="mb-6 text-white">
              {safeData.cost?.estimate}
            </p>

            <div className="space-y-3">
              {safeData.cost?.breakdown?.map(
                (item, i) => (
                  <div
                    key={i}
                    className="text-zinc-400"
                  >
                    • {item}
                  </div>
                )
              )}
            </div>

          </div>

          {/* ROADMAP */}
          <div className="bg-[#0B0F19] border border-white/10 rounded-3xl p-8">

            <h2 className="mb-8 text-3xl font-bold text-white">
              Product Roadmap
            </h2>

            <div className="space-y-8">

              {safeData.roadmap?.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start gap-5"
                >
                  <div className="flex items-center justify-center w-10 h-10 font-bold text-black rounded-full bg-emerald-400">
                    {index + 1}
                  </div>

                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-white">
                      Phase {index + 1}
                    </h3>

                    <p className="text-gray-400">
                      {step}
                    </p>
                  </div>
                </div>
              ))}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
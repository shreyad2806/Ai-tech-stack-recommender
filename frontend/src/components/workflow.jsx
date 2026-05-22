import {
  Brain,
  Database,
  Sparkles,
  ShieldCheck,
  Search,
  FileText,
} from "lucide-react";

const steps = [
  {
    icon: Sparkles,
    title: "User Query",
    desc: "User submits project idea or AI request",
  },
  {
    icon: Search,
    title: "Prompt Enhancement",
    desc: "System optimizes and enriches prompt",
  },
  {
    icon: Database,
    title: "Retriever / Context",
    desc: "Relevant context and data are fetched",
  },
  {
    icon: Brain,
    title: "LLM Reasoning",
    desc: "AI model performs reasoning and generation",
  },
  {
    icon: ShieldCheck,
    title: "Validation",
    desc: "Guardrails validate response quality",
  },
  {
    icon: FileText,
    title: "Structured Output",
    desc: "Frontend-ready response generated",
  },
];

export default function WorkflowDiagram() {
  return (
    <div className="relative py-10">

      <div className="absolute left-10 top-0 bottom-0 w-[2px] bg-emerald-500/30" />

      <div className="space-y-10">

        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={index}
              className="relative flex items-start gap-8"
            >
              <div className="relative z-10 w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.25)]">

                <Icon className="w-9 h-9 text-emerald-400" />

              </div>

              <div className="flex-1 bg-[#07111f] border border-white/10 rounded-3xl p-8 hover:border-emerald-500/30 transition-all duration-300">

                <div className="text-sm uppercase tracking-[0.25em] text-emerald-400 mb-3">
                  Step {index + 1}
                </div>

                <h3 className="mb-3 text-3xl font-bold text-white">
                  {step.title}
                </h3>

                <p className="text-lg leading-relaxed text-gray-400">
                  {step.desc}
                </p>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
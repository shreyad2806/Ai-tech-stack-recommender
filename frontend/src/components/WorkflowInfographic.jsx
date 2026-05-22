import {
  Brain,
  Database,
  Search,
  ShieldCheck,
  Sparkles,
  FileText,
} from "lucide-react";

const sections = [
  {
    title: "User Interaction",
    icon: Sparkles,
    items: [
      "User submits AI query",
      "Frontend validates request",
      "Session context attached",
    ],
  },

  {
    title: "Context Retrieval",
    icon: Search,
    items: [
      "Retriever searches vector DB",
      "Relevant documents selected",
      "Semantic ranking applied",
    ],
  },

  {
    title: "AI Reasoning Engine",
    icon: Brain,
    items: [
      "Prompt optimized dynamically",
      "LLM generates structured reasoning",
      "Guardrails validate response",
    ],
  },

  {
    title: "Data Infrastructure",
    icon: Database,
    items: [
      "PostgreSQL stores metadata",
      "Redis handles caching",
      "Vector DB stores embeddings",
    ],
  },

  {
    title: "Final Output",
    icon: FileText,
    items: [
      "JSON response generated",
      "UI-ready formatting applied",
      "Streaming response returned",
    ],
  },

  {
    title: "Validation & Security",
    icon: ShieldCheck,
    items: [
      "Moderation checks",
      "Hallucination reduction",
      "Response validation",
    ],
  },
];

export default function WorkflowInfographic() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">

      {sections.map((section, index) => {
        const Icon = section.icon;

        return (
          <div
            key={index}
            className="rounded-[32px] border border-white/10 bg-[#07111f] p-8 shadow-[0_0_40px_rgba(16,185,129,0.06)]"
          >
            <div className="flex items-center gap-4 mb-6">

              <div className="flex items-center justify-center w-16 h-16 border rounded-2xl bg-emerald-500/10 border-emerald-500/20">

                <Icon className="w-8 h-8 text-emerald-400" />

              </div>

              <h2 className="text-2xl font-bold text-white">
                {section.title}
              </h2>
            </div>

            <div className="space-y-4">

              {section.items.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 text-gray-300"
                >
                  <div className="w-2 h-2 mt-2 rounded-full bg-emerald-400" />

                  <p>{item}</p>
                </div>
              ))}

            </div>
          </div>
        );
      })}
    </div>
  );
}
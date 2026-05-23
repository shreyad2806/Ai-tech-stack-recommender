import React from "react";

const steps = [
  {
    title: "User Query",
    desc: "User submits AI request",
  },
  {
    title: "Prompt Optimization",
    desc: "Prompt enhanced dynamically",
  },
  {
    title: "Retriever",
    desc: "Relevant context fetched",
  },
  {
    title: "LLM Reasoning",
    desc: "AI generates reasoning",
  },
  {
    title: "Validation",
    desc: "Response checked for quality",
  },
  {
    title: "Formatter",
    desc: "Structured response generated",
  },
];

export default function WorkflowInfographic() {
  return (
    <div className="space-y-6">
      {steps.map((step, index) => (
        <div
          key={index}
          className="rounded-3xl border border-zinc-800 bg-[#020617] p-8"
        >
          <div className="flex items-start gap-6">
            <div className="flex items-center justify-center w-12 h-12 font-bold border rounded-2xl bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
              {index + 1}
            </div>

            <div>
              <h3 className="mb-2 text-2xl font-bold text-white">
                {step.title}
              </h3>

              <p className="text-zinc-400">
                {step.desc}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
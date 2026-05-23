import React from "react";

export default function ArchitectureCanvas() {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-[#020617] p-10 min-h-[600px]">
      <div className="grid grid-cols-3 gap-8">

        <div className="rounded-2xl border border-emerald-500/20 bg-[#031525] p-6">
          <h2 className="mb-4 text-sm text-emerald-400">
            FRONTEND
          </h2>

          <div className="text-2xl font-bold text-white">
            Next.js Dashboard
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 text-sm rounded-full bg-emerald-500/10 text-emerald-300">
              Tailwind
            </span>

            <span className="px-3 py-1 text-sm rounded-full bg-emerald-500/10 text-emerald-300">
              Auth
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-[#031525] p-6">
          <h2 className="mb-4 text-sm text-cyan-400">
            AI ORCHESTRATION
          </h2>

          <div className="text-2xl font-bold text-white">
            LLM Engine
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 text-sm rounded-full bg-cyan-500/10 text-cyan-300">
              OpenAI
            </span>

            <span className="px-3 py-1 text-sm rounded-full bg-cyan-500/10 text-cyan-300">
              RAG
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-purple-500/20 bg-[#031525] p-6">
          <h2 className="mb-4 text-sm text-purple-400">
            DATABASE
          </h2>

          <div className="text-2xl font-bold text-white">
            PostgreSQL
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 text-sm text-purple-300 rounded-full bg-purple-500/10">
              Redis
            </span>

            <span className="px-3 py-1 text-sm text-purple-300 rounded-full bg-purple-500/10">
              Vector DB
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
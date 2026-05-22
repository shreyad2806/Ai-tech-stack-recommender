import {
  Monitor,
  Server,
  Brain,
  Database,
  Cloud,
  Shield,
} from "lucide-react";

const layers = [
  {
    title: "Frontend Layer",
    icon: Monitor,
    items: ["Next.js", "Tailwind", "Dashboard UI"],
  },
  {
    title: "API Layer",
    icon: Server,
    items: ["FastAPI", "REST APIs", "Auth"],
  },
  {
    title: "AI Orchestration",
    icon: Brain,
    items: ["OpenAI", "Prompt Engine", "RAG Pipeline"],
  },
  {
    title: "Data Layer",
    icon: Database,
    items: ["PostgreSQL", "Vector DB", "Redis Cache"],
  },
  {
    title: "Cloud & DevOps",
    icon: Cloud,
    items: ["Docker", "AWS", "Monitoring"],
  },
];

export default function ArchitectureDiagram() {
  return (
    <div className="py-10 space-y-10">

      {layers.map((layer, index) => {
        const Icon = layer.icon;

        return (
          <div
            key={index}
            className="relative"
          >
            {index !== layers.length - 1 && (
              <div className="absolute left-1/2 top-full w-[2px] h-10 bg-emerald-500/30 -translate-x-1/2" />
            )}

            <div className="bg-[#07111f] border border-white/10 rounded-[32px] p-10 shadow-[0_0_50px_rgba(0,255,170,0.05)]">

              <div className="flex items-center gap-5 mb-8">

                <div className="flex items-center justify-center w-16 h-16 border rounded-2xl bg-emerald-500/10 border-emerald-500/30">

                  <Icon className="w-8 h-8 text-emerald-400" />

                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white">
                    {layer.title}
                  </h2>

                  <p className="mt-1 text-gray-400">
                    Scalable infrastructure layer
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">

                {layer.items.map((item) => (
                  <div
                    key={item}
                    className="px-5 py-3 text-lg border rounded-2xl bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                  >
                    {item}
                  </div>
                ))}

              </div>
            </div>
          </div>
        );
      })}

      <div className="bg-[#07111f] border border-white/10 rounded-3xl p-8 flex items-center gap-5">

        <Shield className="w-10 h-10 text-emerald-400" />

        <div>
          <h3 className="text-2xl font-bold text-white">
            Security & Monitoring
          </h3>

          <p className="mt-2 text-gray-400">
            Sentry, Grafana, RBAC, observability, audit logs, and AI validation guardrails.
          </p>
        </div>
      </div>
    </div>
  );
}
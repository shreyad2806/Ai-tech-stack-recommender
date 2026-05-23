import React from "react";

const modes = [
  {
    title: "MVP",
    desc: "Fastest way to validate the idea.",
  },
  {
    title: "Production",
    desc: "Scalable production-ready infrastructure.",
  },
  {
    title: "Enterprise",
    desc: "Multi-tenant enterprise AI architecture.",
  },
];

export default function BuildModes() {
  return (
    <div className="grid grid-cols-3 gap-6">
      {modes.map((mode, index) => (
        <div
          key={index}
          className="rounded-3xl border border-zinc-800 bg-[#020617] p-8"
        >
          <h2 className="mb-4 text-3xl font-bold text-white">
            {mode.title}
          </h2>

          <p className="text-zinc-400">
            {mode.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
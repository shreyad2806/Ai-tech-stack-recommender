import React from "react";

const modeStyles = {
  mvp: "border-emerald-500/30 bg-emerald-500/5",
  production: "border-cyan-500/30 bg-cyan-500/5",
  enterprise: "border-purple-500/30 bg-purple-500/5",
};

export default function BuildModes({ modes }) {
  if (!modes) return null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

      {Object.entries(modes).map(([key, items]) => (
        <div
          key={key}
          className={`rounded-3xl border p-7 ${modeStyles[key]}`}
        >
          <h2 className="mb-6 text-3xl font-bold text-white capitalize">
            {key}
          </h2>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="px-4 py-3 text-gray-300 border bg-black/40 border-white/10 rounded-xl"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}

    </div>
  );
}
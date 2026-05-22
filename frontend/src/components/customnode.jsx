import { Handle, Position } from "reactflow";

export default function CustomNode({ data }) {
  return (
    <div className="min-w-[220px] rounded-3xl border border-emerald-500/20 bg-[#07111f] p-5 shadow-[0_0_40px_rgba(16,185,129,0.15)]">

      <Handle type="target" position={Position.Top} />

      <div className="text-emerald-400 text-xs uppercase tracking-[0.25em] mb-2">
        {data.type}
      </div>

      <h3 className="mb-3 text-xl font-bold text-white">
        {data.label}
      </h3>

      <div className="flex flex-wrap gap-2">
        {data.items?.map((item) => (
          <span
            key={item}
            className="px-3 py-1 text-sm border rounded-xl bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
          >
            {item}
          </span>
        ))}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
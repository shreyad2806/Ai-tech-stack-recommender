import React from 'react';
import { Handle, Position } from 'reactflow';
import {
  SiNextdotjs,
  SiFastapi,
  SiOpenai,
  SiPostgresql,
  SiDocker,
  SiRedis,
  SiAmazonaws,
} from 'react-icons/si';

const iconMap = {
  nextjs: SiNextdotjs,
  fastapi: SiFastapi,
  openai: SiOpenai,
  postgresql: SiPostgresql,
  docker: SiDocker,
  redis: SiRedis,
  aws: SiAmazonaws,
};

function TechPills({ tech = [] }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {tech.map((t, i) => (
        <div key={i} className="px-2 py-1 text-xs rounded-full bg-white/6 border border-white/6 text-gray-100">
          {t}
        </div>
      ))}
    </div>
  );
}

export default function CustomNode({ data }) {
  const { title, description, tech = [] } = data || {};

  const primaryTech = (tech[0] || '').toLowerCase().replace(/\s+/g, '').replace(/\./g, '');
  const Icon = iconMap[primaryTech] || null;

  return (
    <div className="min-w-[220px] max-w-[320px] p-4 rounded-2xl bg-gradient-to-br from-[#021012] to-[#07111f] border border-white/6 shadow-lg" style={{boxShadow: '0 6px 30px rgba(16,185,129,0.06)'}}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400/10 to-emerald-400/6 border border-emerald-500/10">
          {Icon ? <Icon className="w-6 h-6 text-emerald-400" /> : <div className="w-6 h-6 rounded bg-white/5" />}
        </div>

        <div>
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="text-xs text-zinc-400">{description}</div>
        </div>
      </div>

      <TechPills tech={tech} />

      <Handle type="target" position={Position.Top} style={{ background: '#10B981' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#10B981' }} />
    </div>
  );
}

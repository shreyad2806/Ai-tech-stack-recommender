import ReactFlow, {
  Background,
  Controls,
  MarkerType,
} from "reactflow";

import "reactflow/dist/style.css";

import CustomNode from "./CustomNode";

const nodeTypes = {
  custom: CustomNode,
};

const nodes = [
  {
    id: "1",
    type: "custom",
    position: { x: 400, y: 0 },
    data: {
      type: "Frontend",
      label: "Next.js Dashboard",
      items: ["Tailwind", "Auth", "Realtime UI"],
    },
  },

  {
    id: "2",
    type: "custom",
    position: { x: 400, y: 220 },
    data: {
      type: "API Layer",
      label: "FastAPI Gateway",
      items: ["REST APIs", "JWT", "Rate Limiting"],
    },
  },

  {
    id: "3",
    type: "custom",
    position: { x: 100, y: 470 },
    data: {
      type: "AI Layer",
      label: "LLM Orchestrator",
      items: ["OpenAI", "Prompt Engine", "RAG"],
    },
  },

  {
    id: "4",
    type: "custom",
    position: { x: 700, y: 470 },
    data: {
      type: "Database",
      label: "Data Layer",
      items: ["PostgreSQL", "Redis", "Vector DB"],
    },
  },

  {
    id: "5",
    type: "custom",
    position: { x: 400, y: 760 },
    data: {
      type: "Infrastructure",
      label: "Cloud & Deployment",
      items: ["Docker", "AWS", "Monitoring"],
    },
  },
];

const edges = [
  {
    id: "e1",
    source: "1",
    target: "2",
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    style: {
      stroke: "#10b981",
      strokeWidth: 2,
    },
  },

  {
    id: "e2",
    source: "2",
    target: "3",
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    style: {
      stroke: "#10b981",
      strokeWidth: 2,
    },
  },

  {
    id: "e3",
    source: "2",
    target: "4",
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    style: {
      stroke: "#10b981",
      strokeWidth: 2,
    },
  },

  {
    id: "e4",
    source: "3",
    target: "5",
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    style: {
      stroke: "#10b981",
      strokeWidth: 2,
    },
  },

  {
    id: "e5",
    source: "4",
    target: "5",
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    style: {
      stroke: "#10b981",
      strokeWidth: 2,
    },
  },
];

export default function ArchitectureCanvas() {
  return (
    <div className="h-[900px] rounded-[32px] overflow-hidden border border-white/10">

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#0f172a" gap={20} />
        <Controls />
      </ReactFlow>

    </div>
  );
}
import React, { useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Code2, Database, Server, Cpu, Globe, Layers, Zap } from 'lucide-react';

// System Design Node Style
const SystemDesignNode = ({ data, selected }) => {
  const Icon = data.icon || Server;
  
  const typeStyles = {
    user: { bg: '#1e293b', border: '#475569', text: '#94a3b8' },
    frontend: { bg: '#172554', border: '#3b82f6', text: '#93c5fd' },
    backend: { bg: '#064e3b', border: '#22c55e', text: '#86efac' },
    ai: { bg: '#4c1d95', border: '#a855f7', text: '#d8b4fe' },
    database: { bg: '#7c2d12', border: '#f97316', text: '#fdba74' },
    cache: { bg: '#9a3412', border: '#fb923c', text: '#fdba74' }
  };
  
  const style = typeStyles[data.type] || typeStyles.backend;
  
  return (
    <div
      className="relative"
      style={{
        padding: '10px 14px',
        borderRadius: '12px',
        backgroundColor: style.bg,
        border: `2px solid ${style.border}`,
        boxShadow: selected ? `0 0 20px ${style.border}60` : '0 4px 6px rgba(0,0,0,0.3)',
        minWidth: '120px',
        transition: 'all 0.2s ease'
      }}
    >
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ background: style.border, width: 6, height: 6 }} 
      />
      
      <div className="flex items-center justify-center gap-2">
        <Icon style={{ width: 16, height: 16, color: style.text }} />
        <span style={{ 
          fontWeight: 600, 
          fontSize: '12px', 
          color: '#ffffff', 
          whiteSpace: 'nowrap'
        }}>
          {data.label}
        </span>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ background: style.border, width: 6, height: 6 }} 
      />
    </div>
  );
};

const nodeTypes = { custom: SystemDesignNode };

// Icon mapping
const getNodeIcon = (type) => {
  const icons = {
    user: Globe,
    frontend: Code2,
    backend: Server,
    ai: Cpu,
    database: Database,
    cache: Zap
  };
  return icons[type] || Server;
};

// Layer Group Box Component
const LayerBox = ({ title, x, y, width, height, color }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: width,
      height: height,
      border: `2px dashed ${color}`,
      borderRadius: '16px',
      backgroundColor: `${color}10`,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      padding: '8px 12px',
      pointerEvents: 'none',
      zIndex: 0
    }}
  >
    <span style={{ 
      fontSize: '10px', 
      color: color, 
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '1px'
    }}>
      {title}
    </span>
  </div>
);

const ArchitectureDiagram = ({ diagram }) => {
  // FAANG-style system design nodes
  const defaultNodes = [
    { 
      id: "user", 
      position: { x: 50, y: 180 }, 
      data: { label: "User", type: "user" },
      type: "custom"
    },
    { 
      id: "frontend", 
      position: { x: 250, y: 180 }, 
      data: { label: "Frontend (React)", type: "frontend" },
      type: "custom"
    },
    { 
      id: "backend", 
      position: { x: 500, y: 180 }, 
      data: { label: "Backend API", type: "backend" },
      type: "custom"
    },
    { 
      id: "ai", 
      position: { x: 750, y: 100 }, 
      data: { label: "AI Core (LLM)", type: "ai" },
      type: "custom"
    },
    { 
      id: "db", 
      position: { x: 750, y: 260 }, 
      data: { label: "Database", type: "database" },
      type: "custom"
    },
    { 
      id: "cache", 
      position: { x: 600, y: 320 }, 
      data: { label: "Cache / Redis", type: "cache" },
      type: "custom"
    }
  ];

  // System design flow edges
  const defaultEdges = [
    { 
      id: "e1", 
      source: "user", 
      target: "frontend", 
      animated: true,
      type: "smoothstep",
      style: { stroke: '#475569', strokeWidth: 2 }
    },
    { 
      id: "e2", 
      source: "frontend", 
      target: "backend", 
      animated: true,
      type: "smoothstep",
      style: { stroke: '#3b82f6', strokeWidth: 2 }
    },
    { 
      id: "e3", 
      source: "backend", 
      target: "ai", 
      animated: true,
      type: "smoothstep",
      style: { stroke: '#a855f7', strokeWidth: 2 }
    },
    { 
      id: "e4", 
      source: "backend", 
      target: "db", 
      animated: false,
      type: "smoothstep",
      style: { stroke: '#f97316', strokeWidth: 2 }
    },
    { 
      id: "e5", 
      source: "backend", 
      target: "cache", 
      animated: false,
      type: "smoothstep",
      style: { stroke: '#fb923c', strokeWidth: 2 }
    }
  ];

  const initialNodes = useMemo(() => {
    if (!diagram?.nodes || !Array.isArray(diagram.nodes) || diagram.nodes.length === 0) {
      return defaultNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          icon: getNodeIcon(node.data.type)
        }
      }));
    }
    
    return diagram.nodes.map((node, index) => ({
      id: node.id || defaultNodes[index]?.id || String(index),
      type: 'custom',
      position: node.position || defaultNodes[index]?.position || { x: 100 + index * 150, y: 150 },
      data: {
        label: node.label || node.data?.label || defaultNodes[index]?.data?.label || `Node ${index}`,
        type: node.type || defaultNodes[index]?.data?.type || 'backend',
        icon: getNodeIcon(node.type || defaultNodes[index]?.data?.type)
      }
    }));
  }, [diagram?.nodes]);

  const initialEdges = useMemo(() => {
    if (!diagram?.edges || !Array.isArray(diagram.edges) || diagram.edges.length === 0) {
      return defaultEdges;
    }
    
    return diagram.edges.map((edge, index) => ({
      id: edge.id || `e${index + 1}`,
      source: edge.source || edge.from || defaultEdges[index]?.source,
      target: edge.target || edge.to || defaultEdges[index]?.target,
      animated: edge.animated !== undefined ? edge.animated : (defaultEdges[index]?.animated || false),
      type: 'smoothstep',
      style: { stroke: '#475569', strokeWidth: 2 }
    }));
  }, [diagram?.edges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [diagram, initialNodes, initialEdges, setNodes, setEdges]);

  const legendItems = [
    { icon: Globe, label: "User", color: "#94a3b8" },
    { icon: Code2, label: "Frontend", color: "#93c5fd" },
    { icon: Server, label: "Backend", color: "#86efac" },
    { icon: Cpu, label: "AI", color: "#d8b4fe" },
    { icon: Database, label: "Database", color: "#fdba74" }
  ];

  return (
    <div className="space-y-4">
      <div className="relative h-[500px] w-full bg-[#0B0F19] rounded-xl overflow-hidden border border-gray-800">
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <LayerBox title="Client Layer" x={20} y={140} width={380} height={100} color="#3b82f6" />
          <LayerBox title="API Layer" x={420} y={140} width={180} height={100} color="#22c55e" />
          <LayerBox title="Data Layer" x={620} y={60} width={240} height={300} color="#f97316" />
        </div>

        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.15, maxZoom: 1 }}
            attributionPosition="bottom-left"
            minZoom={0.4}
            maxZoom={1.2}
          >
            <MiniMap 
              nodeStrokeWidth={3}
              zoomable
              pannable
              className="!bg-[#1f2937] !border-gray-700"
              nodeColor={(node) => {
                switch (node.data?.type) {
                  case 'frontend': return '#3b82f6';
                  case 'backend': return '#22c55e';
                  case 'database': return '#f97316';
                  case 'ai': return '#a855f7';
                  case 'cache': return '#fb923c';
                  case 'user': return '#475569';
                  default: return '#6b7280';
                }
              }}
            />
            <Controls className="!bg-[#1f2937] !border-gray-700 !text-gray-300" />
            <Background 
              variant="dots" 
              gap={24} 
              size={1}
              className="!bg-[#0B0F19]"
              color="#1e293b"
            />
          </ReactFlow>
        </div>
      </div>

      <div className="bg-[#111827] rounded-lg p-4 border border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-semibold text-gray-300">Architecture Legend</span>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {legendItems.map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon style={{ width: 14, height: 14, color }} />
              <span className="text-xs text-gray-400">{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            Data Flow: User → Frontend → Backend → (AI | Database | Cache)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;

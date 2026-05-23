import dagre from 'dagre';

export function layoutGraph(nodes = [], edges = [], direction = 'TB') {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: direction, nodesep: 60, ranksep: 80, marginx: 20, marginy: 20 });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((n) => {
    // estimate width based on title length
    const width = Math.max(180, (n.title?.length || 16) * 8 + 60);
    const height = 90;
    g.setNode(n.id, { width, height });
  });

  edges.forEach((e, i) => {
    g.setEdge(e.source, e.target, { id: e.id || `e${i}` });
  });

  dagre.layout(g);

  const positionedNodes = nodes.map((n) => {
    const nodeWithPos = g.node(n.id);
    return {
      ...n,
      position: { x: nodeWithPos.x - nodeWithPos.width / 2, y: nodeWithPos.y - nodeWithPos.height / 2 },
      width: nodeWithPos.width,
      height: nodeWithPos.height,
    };
  });

  const positionedEdges = edges.map((e, i) => ({ ...e, id: e.id || `e${i}` }));

  return { nodes: positionedNodes, edges: positionedEdges };
}

export default layoutGraph;

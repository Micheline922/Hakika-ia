import { GraphNode, GraphEdge, KnowledgeGraph } from '../types';

export interface LayoutNode extends GraphNode {
  x: number;
  y: number;
  color: string;
  iconName: string;
}

export function computeGraphLayout(graph: KnowledgeGraph, width: number = 600, height: number = 400): { nodes: LayoutNode[]; edges: GraphEdge[] } {
  const nodes = graph.nodes || [];
  const count = nodes.length;

  if (count === 0) return { nodes: [], edges: [] };

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.35;

  const layoutNodes: LayoutNode[] = nodes.map((node, index) => {
    // Determine category / type colors and icon assignments
    let color = '#3B82F6'; // Default blue
    let iconName = 'Box';

    switch (node.type?.toLowerCase()) {
      case 'spatial':
      case 'location':
        color = '#10B981'; // Emerald Green
        iconName = 'MapPin';
        break;
      case 'causal':
      case 'event':
        color = '#F59E0B'; // Amber
        iconName = 'GitMerge';
        break;
      case 'sensory':
        color = '#EC4899'; // Pink/Purple
        iconName = 'Eye';
        break;
      case 'temporal':
        color = '#8B5CF6'; // Violet
        iconName = 'Clock';
        break;
      case 'entity':
        color = '#06B6D4'; // Cyan
        iconName = 'UserCheck';
        break;
      case 'anchor':
        color = '#3B82F6';
        iconName = 'Anchor';
        break;
    }

    // Place in circular orbit with minor jitter
    const angle = (index / count) * 2 * Math.PI - Math.PI / 2;
    const currentRadius = radius + (index % 2 === 0 ? 15 : -15);
    const x = centerX + currentRadius * Math.cos(angle);
    const y = centerY + currentRadius * Math.sin(angle);

    return {
      ...node,
      x: Math.max(40, Math.min(width - 40, x)),
      y: Math.max(40, Math.min(height - 40, y)),
      color,
      iconName,
    };
  });

  return { nodes: layoutNodes, edges: graph.edges || [] };
}

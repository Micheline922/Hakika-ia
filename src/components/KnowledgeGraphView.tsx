import React, { useState } from 'react';
import { KnowledgeGraph, Language } from '../types';
import { computeGraphLayout, LayoutNode } from '../lib/graphUtils';
import { getTranslation } from '../data/translations';
import { MapPin, GitMerge, Eye, Clock, ShieldCheck, ArrowRight, Zap, Filter } from 'lucide-react';

interface KnowledgeGraphViewProps {
  graph: KnowledgeGraph;
  onProceedToChallenge: () => void;
  isLoadingChallenge: boolean;
  language?: Language;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  graph,
  onProceedToChallenge,
  isLoadingChallenge,
  language = 'fr' as Language,
}) => {
  const [selectedAnchorType, setSelectedAnchorType] = useState<string>('all');
  const [selectedNode, setSelectedNode] = useState<LayoutNode | null>(null);

  const t = getTranslation(language);
  const { nodes, edges } = computeGraphLayout(graph, 650, 420);

  const filteredAnchors = (graph.anchors || []).filter((anchor) => {
    if (selectedAnchorType === 'all') return true;
    return anchor.type === selectedAnchorType;
  });

  const getAnchorBadge = (type: string) => {
    switch (type) {
      case 'spatial':
        return { label: 'Spatial', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: MapPin };
      case 'causal':
        return { label: 'Causal', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: GitMerge };
      case 'sensory':
        return { label: 'Sensoriel', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30', icon: Eye };
      case 'temporal':
        return { label: 'Temporel', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: Clock };
      default:
        return { label: type, color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: ShieldCheck };
    }
  };

  return (
    <div className="space-y-8">
      {/* Knowledge Graph Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs mb-1">
              <Zap className="w-4 h-4" />
              <span>{t.kgHeaderTag}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 font-serif">
              {t.kgHeaderTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.kgHeaderDesc}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              {nodes.length} {t.nodesCount}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              {edges.length} {t.edgesCount}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
              {(graph.anchors || []).length} {t.anchorsCount}
            </span>
          </div>
        </div>

        {/* SVG Interactive Canvas */}
        <div className="relative bg-slate-950 border border-slate-800/80 rounded-xl mt-4 overflow-hidden min-h-[380px] flex items-center justify-center p-2">
          <svg className="w-full h-[400px] select-none" viewBox="0 0 650 420">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="18"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#475569" />
              </marker>
            </defs>

            {/* Render Edges */}
            {edges.map((edge) => {
              const sourceNode = nodes.find((n) => n.id === edge.source);
              const targetNode = nodes.find((n) => n.id === edge.target);

              if (!sourceNode || !targetNode) return null;

              const isHighlighted =
                selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);

              return (
                <g key={edge.id}>
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={isHighlighted ? '#F59E0B' : '#334155'}
                    strokeWidth={isHighlighted ? 2.5 : 1.2}
                    strokeDasharray={edge.relationship?.includes('causal') ? '4' : 'none'}
                    markerEnd="url(#arrowhead)"
                    className="transition-all duration-300"
                  />
                  {/* Relationship Label */}
                  <text
                    x={(sourceNode.x + targetNode.x) / 2}
                    y={(sourceNode.y + targetNode.y) / 2 - 4}
                    fill="#94A3B8"
                    fontSize="9"
                    textAnchor="middle"
                    className="pointer-events-none font-mono"
                  >
                    {edge.relationship}
                  </text>
                </g>
              );
            })}

            {/* Render Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer group"
                  transform={`translate(${node.x}, ${node.y})`}
                >
                  <circle
                    r={isSelected ? 22 : 18}
                    fill="#0F172A"
                    stroke={node.color}
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all duration-200 group-hover:scale-110"
                  />
                  <circle
                    r={isSelected ? 6 : 4}
                    fill={node.color}
                    className="animate-pulse"
                  />
                  <text
                    y={32}
                    fill={isSelected ? '#F8FAFC' : '#CBD5E1'}
                    fontSize="11"
                    fontWeight={isSelected ? '700' : '500'}
                    textAnchor="middle"
                    className="pointer-events-none drop-shadow-md font-sans"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Node Inspector Overlay */}
          {selectedNode && (
            <div className="absolute top-4 right-4 bg-slate-900/95 border border-slate-700/80 rounded-xl p-4 max-w-xs backdrop-blur-md shadow-2xl text-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-slate-100 flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedNode.color }} />
                  <span>{selectedNode.label}</span>
                </span>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-slate-400 hover:text-white font-bold"
                >
                  ✕
                </button>
              </div>
              <p className="text-slate-300">
                <strong>Type:</strong> <span className="uppercase text-amber-400">{selectedNode.type}</span>
              </p>
              {selectedNode.category && (
                <p className="text-slate-400">
                  <strong>Catégorie:</strong> {selectedNode.category}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Logical Anchors Cards Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
          <h3 className="font-bold text-slate-100 text-lg font-serif">
            {t.kgAnchorsTitle}
          </h3>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500 mr-1" />
            {['all', 'spatial', 'causal', 'sensory', 'temporal'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedAnchorType(type)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                  selectedAnchorType === type
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {type === 'all' ? t.kgAll : type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAnchors.map((anchor) => {
            const badge = getAnchorBadge(anchor.type);
            const Icon = badge.icon;

            return (
              <div
                key={anchor.id}
                className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.color}`}>
                      <Icon className="w-3 h-3 mr-1" />
                      <span>{badge.label}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {t.kgConfidence}: {anchor.confidence}%
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed font-serif">
                    "{anchor.description}"
                  </p>
                </div>

                {anchor.entities && anchor.entities.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/60 flex flex-wrap gap-1 text-[11px] text-slate-400">
                    <span className="text-slate-500 mr-1">{t.kgRelatedElements}:</span>
                    {anchor.entities.map((e, idx) => (
                      <span key={idx} className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        {e}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Proceed to Phase 2 Button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onProceedToChallenge}
            disabled={isLoadingChallenge}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            <span>{t.proceedToPhase2Btn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

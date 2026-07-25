export type Language = 'fr' | 'sw' | 'ln' | 'lu' | 'kg';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export type AnchorType = 'spatial' | 'causal' | 'sensory' | 'temporal';

export interface LogicalAnchor {
  id: string;
  type: AnchorType;
  description: string;
  confidence: number; // 0 - 100
  entities: string[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'entity' | 'anchor' | 'event' | 'location' | 'sensory';
  category?: string;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
}

export interface KnowledgeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  anchors: LogicalAnchor[];
}

export interface Challenge {
  id: string;
  prompt: string;
  targetAnchors: string[];
  expectedAspects: string[];
  language: Language;
  translatedPrompt?: Record<Language, string>;
}

export interface AuditFracture {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'critical';
  contextNote: string;
}

export interface AuditResult {
  confidenceScore: number; // 0-100
  status: 'VALIDATED' | 'INCONCLUSIVE' | 'REJECTED';
  verifiedAnchors: string[];
  fractures: AuditFracture[];
  reasoning: string;
  culturalContextNotes: string;
  socialDnaHash: string;
  timestamp: string;
  auditId: string;
}

export interface IdentityCase {
  id: string;
  createdAt: string;
  title: string;
  region: string;
  language: Language;
  originalNarrative: string;
  graph: KnowledgeGraph;
  challenge?: Challenge;
  userChallengeResponse?: string;
  auditResult?: AuditResult;
}

export interface DemoPreset {
  id: string;
  title: string;
  region: string;
  language: Language;
  narrative: string;
  summary: string;
  presetCorrectResponse: string;
  presetFracturedResponse: string;
}

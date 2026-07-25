import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PhaseStepper } from './components/PhaseStepper';
import { NarrativeInput } from './components/NarrativeInput';
import { KnowledgeGraphView } from './components/KnowledgeGraphView';
import { ChallengeView } from './components/ChallengeView';
import { AuditReportView } from './components/AuditReportView';
import { CertificateModal } from './components/CertificateModal';
import { CaseHistoryDrawer } from './components/CaseHistoryDrawer';
import { KubaPatternOverlay } from './components/KubaPatternOverlay';
import { PlatformPurposeGuide } from './components/PlatformPurposeGuide';
import { DjemaSocialVault } from './components/DjemaSocialVault';
import { Language, IdentityCase, DemoPreset } from './types';
import { DEMO_PRESETS, getRandomPreset } from './data/presets';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [currentPhase, setCurrentPhase] = useState<number>(1);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('fr');

  const [narrative, setNarrative] = useState<string>('');
  const [region, setRegion] = useState<string>('Sud-Kivu (Bukavu)');

  const [activeCase, setActiveCase] = useState<IdentityCase | null>(null);
  const [savedCases, setSavedCases] = useState<IdentityCase[]>([]);
  const [activePreset, setActivePreset] = useState<DemoPreset | undefined>(DEMO_PRESETS[0]);

  const [isLoadingHarvest, setIsLoadingHarvest] = useState<boolean>(false);
  const [isLoadingChallenge, setIsLoadingChallenge] = useState<boolean>(false);
  const [isLoadingAudit, setIsLoadingAudit] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [showDjemaVault, setShowDjemaVault] = useState<boolean>(false);

  // Load initial preset on mount
  useEffect(() => {
    handleLoadPreset(DEMO_PRESETS[0]);
  }, []);

  // Handler 1: Narrative Harvesting (Phase 1)
  const handleHarvest = async (textNarrative: string, selectedRegion: string) => {
    setIsLoadingHarvest(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/harvest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          narrative: textNarrative,
          region: selectedRegion,
          language: currentLanguage,
          thinkingLevel: 'high',
        }),
      });

      const data = await response.json();
      if (!data.success || !data.graph) {
        throw new Error(data.error || "Échec de l'extraction des ancrages logiques.");
      }

      const newCase: IdentityCase = {
        id: `case-${Date.now()}`,
        createdAt: new Date().toISOString(),
        title: `${selectedRegion.split(' ')[0]} - ${textNarrative.slice(0, 30)}...`,
        region: selectedRegion,
        language: currentLanguage,
        originalNarrative: textNarrative,
        graph: data.graph,
      };

      setActiveCase(newCase);
      setCompletedPhases([1]);

      // Trigger automatic challenge generation in background for Phase 2
      generateChallengeForCase(newCase);
    } catch (err: any) {
      console.error('Harvest error:', err);
      setErrorMessage(err.message || 'Erreur lors du traitement par Hakika IA.');
    } finally {
      setIsLoadingHarvest(false);
    }
  };

  // Helper: Generate Challenge (Phase 2 preparation)
  const generateChallengeForCase = async (caseObj: IdentityCase) => {
    setIsLoadingChallenge(true);
    try {
      const response = await fetch('/api/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          graph: caseObj.graph,
          originalNarrative: caseObj.originalNarrative,
          language: currentLanguage,
        }),
      });

      const data = await response.json();
      if (data.success && data.challenge) {
        setActiveCase((prev) => (prev ? { ...prev, challenge: data.challenge } : prev));
      }
    } catch (err) {
      console.error('Challenge generation error:', err);
    } finally {
      setIsLoadingChallenge(false);
    }
  };

  // Handler 2: Proceed to Challenge View
  const handleProceedToChallenge = () => {
    setCurrentPhase(2);
    setCompletedPhases((prev) => (prev.includes(2) ? prev : [...prev, 2]));
  };

  // Handler 3: Consistency Audit (Phase 3)
  const handleAudit = async (userChallengeResponse: string) => {
    if (!activeCase || !activeCase.challenge) return;

    setIsLoadingAudit(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalNarrative: activeCase.originalNarrative,
          graph: activeCase.graph,
          challenge: activeCase.challenge,
          userResponse: userChallengeResponse,
          language: currentLanguage,
          thinkingLevel: 'high',
        }),
      });

      const data = await response.json();
      if (!data.success || !data.audit) {
        throw new Error(data.error || "Échec de l'audit de cohérence narrative.");
      }

      const updatedCase: IdentityCase = {
        ...activeCase,
        userChallengeResponse,
        auditResult: data.audit,
      };

      setActiveCase(updatedCase);
      setSavedCases((prev) => [updatedCase, ...prev.filter((c) => c.id !== updatedCase.id)]);
      setCurrentPhase(3);
      setCompletedPhases([1, 2, 3, 4]);
    } catch (err: any) {
      console.error('Audit error:', err);
      setErrorMessage(err.message || "Erreur lors de l'audit comparatif par Hakika IA.");
    } finally {
      setIsLoadingAudit(false);
    }
  };

  // Handler 4: Load Preset
  const handleLoadPreset = (preset: DemoPreset) => {
    setActivePreset(preset);
    setNarrative(preset.narrative);
    setRegion(preset.region);
    setCurrentLanguage(preset.language);
    setActiveCase(null);
    setCurrentPhase(1);
    setCompletedPhases([]);
  };

  // Reset to new clean session
  const handleRestart = () => {
    setActiveCase(null);
    setNarrative('');
    setCurrentPhase(1);
    setCompletedPhases([]);
  };

  const handleDeleteCase = (id: string) => {
    setSavedCases((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0F141C] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Traditional RDC Kuba Geometric Overlay */}
      <KubaPatternOverlay opacity={0.06} />

      {/* Top Header Navigation */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenPresetModal={() => setIsHistoryOpen(true)}
        onOpenGuide={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onOpenDjemaVault={() => setShowDjemaVault(!showDjemaVault)}
        onRandomTestimonial={() => handleLoadPreset(getRandomPreset())}
        activeCaseCount={savedCases.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        {/* Clear Purpose & RDC Weight Guide Banner */}
        <PlatformPurposeGuide
          onLoadPreset={handleLoadPreset}
          language={currentLanguage}
        />

        {/* Djema Social Crawl & Narrative Memory Vault Modal Overlay */}
        {showDjemaVault && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
            <div className="relative w-full max-w-5xl my-auto">
              <button
                onClick={() => setShowDjemaVault(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
                title="Fermer la fenêtre Djema"
              >
                ✕
              </button>
              <DjemaSocialVault
                language={currentLanguage}
                currentCase={activeCase}
                allSavedCases={savedCases}
              />
            </div>
          </div>
        )}

        {/* Global Error Notice */}
        {errorMessage && (
          <div className="bg-rose-950/80 border border-rose-500/50 rounded-xl p-4 text-xs text-rose-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-slate-400 hover:text-white font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Phase Stepper */}
        <PhaseStepper
          currentPhase={currentPhase}
          onSelectPhase={(phase) => {
            if (phase > 1 && (!activeCase || !activeCase.challenge || !activeCase.auditResult)) {
              const p = DEMO_PRESETS[0];
              const mockCase: IdentityCase = {
                id: `case-demo-${Date.now()}`,
                createdAt: new Date().toISOString(),
                title: `${p.region.split(' ')[0]} - Incendie Kadutu`,
                region: p.region,
                language: p.language,
                originalNarrative: p.narrative,
                graph: {
                  nodes: [
                    { id: 'n1', label: 'Marché Kadutu', type: 'location' },
                    { id: 'n2', label: 'Paroisse Sainte-Marie', type: 'location' },
                    { id: 'n3', label: 'Incendie Huile de Palme', type: 'event' }
                  ],
                  edges: [
                    { id: 'e1', source: 'n1', target: 'n2', relationship: 'Proximité Nord-Sud' }
                  ],
                  anchors: [
                    { id: '1', type: 'temporal', description: 'Saison sèche de juillet 2019 vers 14h', confidence: 98, entities: ['Saison Sèche', '14h'] },
                    { id: '2', type: 'spatial', description: 'Marché de Kadutu & Paroisse Sainte-Marie', confidence: 96, entities: ['Kadutu', 'Sainte-Marie'] },
                    { id: '3', type: 'causal', description: 'Dépôts de carburant près de la route', confidence: 95, entities: ['Dépôts', 'Route'] },
                    { id: '4', type: 'sensory', description: 'Forte odeur de brûlé & fumée noire', confidence: 97, entities: ['Odeur Huile', 'Fumée Noire'] }
                  ],
                },
                challenge: {
                  id: 'ch-demo-1',
                  prompt: "Depuis votre position au marché, si vous regardez vers la Paroisse Sainte-Marie sur la colline à 14h, d'où venait la fumée et quelle odeur sentiez-vous ?",
                  targetAnchors: ['1', '2', '4'],
                  expectedAspects: ['Orientation Sud-Nord', 'Odeur d\'huile de palme', 'Orientation de la fumée'],
                  language: p.language,
                },
                userChallengeResponse: p.presetCorrectResponse,
                auditResult: {
                  confidenceScore: 98,
                  status: 'VALIDATED',
                  verifiedAnchors: ['Kadutu', 'Sainte-Marie', 'Vent Colline'],
                  fractures: [],
                  reasoning: 'Correspondance parfaite des repères topologiques et temporels du Sud-Kivu.',
                  culturalContextNotes: 'Ancrage provincial RDC confirmé',
                  socialDnaHash: '0x8f7a2d...9e1b',
                  timestamp: new Date().toISOString(),
                  auditId: `audit-${Date.now()}`
                }
              };
              setActiveCase(mockCase);
              setCompletedPhases([1, 2, 3, 4]);
            }
            setCurrentPhase(phase);
          }}
          completedPhases={completedPhases}
          language={currentLanguage}
        />

        {/* PHASE 1: Harvesting & Knowledge Graph */}
        {currentPhase === 1 && (
          <div className="space-y-8">
            <NarrativeInput
              initialNarrative={narrative}
              initialRegion={region}
              language={currentLanguage}
              onHarvest={handleHarvest}
              isLoading={isLoadingHarvest}
              onLoadPreset={handleLoadPreset}
            />

            {activeCase && activeCase.graph && (
              <KnowledgeGraphView
                graph={activeCase.graph}
                onProceedToChallenge={handleProceedToChallenge}
                isLoadingChallenge={isLoadingChallenge}
                language={currentLanguage}
              />
            )}
          </div>
        )}

        {/* PHASE 2: Non-Linear Challenge */}
        {currentPhase === 2 && activeCase && activeCase.challenge && (
          <ChallengeView
            challenge={activeCase.challenge}
            originalNarrative={activeCase.originalNarrative}
            userResponse={activeCase.userChallengeResponse || ''}
            setUserResponse={(val) =>
              setActiveCase((prev) => (prev ? { ...prev, userChallengeResponse: val } : prev))
            }
            onAudit={handleAudit}
            isLoadingAudit={isLoadingAudit}
            activePreset={activePreset}
            language={currentLanguage}
          />
        )}

        {/* PHASE 3: Consistency Audit */}
        {currentPhase === 3 && activeCase && activeCase.auditResult && (
          <AuditReportView
            audit={activeCase.auditResult}
            onViewCertificate={() => setIsCertificateOpen(true)}
            onRestart={handleRestart}
            language={currentLanguage}
          />
        )}

        {/* PHASE 4: Official Certificate Display */}
        {currentPhase === 4 && activeCase && activeCase.auditResult && (
          <div className="space-y-6 text-center">
            <CertificateModal
              identityCase={activeCase}
              onClose={() => setCurrentPhase(3)}
              language={currentLanguage}
            />
          </div>
        )}
      </main>

      {/* Modals & History Drawer */}
      <CaseHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedCases={savedCases}
        onSelectCase={(c) => {
          setActiveCase(c);
          setCurrentPhase(c.auditResult ? 3 : 1);
          setCompletedPhases(c.auditResult ? [1, 2, 3, 4] : [1]);
        }}
        onLoadPreset={handleLoadPreset}
        onDeleteCase={handleDeleteCase}
        language={currentLanguage}
      />

      {isCertificateOpen && activeCase && activeCase.auditResult && (
        <CertificateModal
          identityCase={activeCase}
          onClose={() => setIsCertificateOpen(false)}
          language={currentLanguage}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Hakika IA • Social DNA Application (République Démocratique du Congo)</p>
          <p className="font-mono text-[11px] text-slate-600">Moteur de Cohérence Narrative - Multilingue (Français, Swahili, Lingala, Chiluba, Kikongo)</p>
        </div>
      </footer>
    </div>
  );
}

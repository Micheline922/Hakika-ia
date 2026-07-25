import React, { useState, useEffect } from 'react';
import { Database, Globe2, Sparkles, RefreshCw, ShieldCheck, Search, Filter, Cpu, CheckCircle2, MessageSquare, Radio, Zap } from 'lucide-react';
import { Language, IdentityCase } from '../types';
import { getTranslation } from '../data/translations';
import { ALL_26_PROVINCES_RDC } from '../data/provinces';

interface DjemaStoryRecord {
  id: string;
  province: string;
  source: 'Social Network Crawl' | 'Citizen Submission' | 'Radio Okapi Archive' | 'Local Community WhatsApp';
  timestamp: string;
  rawStory: string;
  invariantAnchors: string[]; // Verbs stripped, pure spatial/temporal invariants
  verificationScore: number;
}

interface DjemaSocialVaultProps {
  language: Language;
  currentCase?: IdentityCase | null;
  allSavedCases?: IdentityCase[];
}

export const DjemaSocialVault: React.FC<DjemaSocialVaultProps> = ({
  language,
  currentCase,
}) => {
  const t = getTranslation(language);
  const [selectedProvince, setSelectedProvince] = useState<string>('Toutes');
  const [isCrawling, setIsCrawling] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [crawlProgress, setCrawlProgress] = useState<number>(0);
  const [crawlStatusText, setCrawlStatusText] = useState<string>('');

  // Sample initial stories in Djema Database from various RDC social networks and archives
  const [djemaDatabase, setDjemaDatabase] = useState<DjemaStoryRecord[]>([
    {
      id: 'djema-rec-1',
      province: 'Sud-Kivu',
      source: 'Local Community WhatsApp',
      timestamp: '2026-07-24 14:20',
      rawStory: "Incendie du marché de Kadutu pendant la saison sèche. L'odeur d'huile de palme brûlée venait des dépôts près de la paroisse Sainte-Marie vers 14h. Le vent soufflait du lac Kivu vers la montagne.",
      invariantAnchors: ['Saison sèche', 'Marché Kadutu', 'Vent Lac Kivu -> Montagne', 'Dépôts huile palme / Paroisse St-Marie', 'Soleil de 14h'],
      verificationScore: 98,
    },
    {
      id: 'djema-rec-2',
      province: 'Nord-Kivu',
      source: 'Social Network Crawl',
      timestamp: '2026-07-23 09:15',
      rawStory: "Éruption du volcan Nyiragongo en mai. La lueur rouge éclairait les toits de Goma la nuit. Les gens ont fui vers Sake sur la route ouest au lieu de la frontière.",
      invariantAnchors: ['Éruption Mai', 'Lueur rouge nocturne', 'Axe d\'évacuation Ouest (Sake)', 'Cendres volcaniques sur lac Kivu'],
      verificationScore: 95,
    },
    {
      id: 'djema-rec-3',
      province: 'Haut-Katanga',
      source: 'Radio Okapi Archive',
      timestamp: '2026-07-22 18:40',
      rawStory: "Orage tropical de novembre près du terril de la Gécamines à Lubumbashi. La poussière rouge des camions s'est changée en boue rouge recouvrant les rails de train.",
      invariantAnchors: ['Orage Novembre', 'Terril Gécamines', 'Poussière rouge -> Boue malachite', 'Avenue Ruwe / Rails FBN'],
      verificationScore: 96,
    },
    {
      id: 'djema-rec-4',
      province: 'Kinshasa',
      source: 'Social Network Crawl',
      timestamp: '2026-07-21 11:05',
      rawStory: "Crue de la rivière N'djili au mois d'avril. L'eau a dépassé le pont de la chaussée. Les embarcations artisanales traversaient près du sous-statique électrique.",
      invariantAnchors: ['Crue Avril', 'Pont N\'djili submergé', 'Sens du courant Sud->Nord', 'Vapeur d\'eau sous-station CEET'],
      verificationScore: 94,
    }
  ]);

  // Sync current user case into Djema database whenever user submits
  useEffect(() => {
    if (currentCase && currentCase.originalNarrative) {
      const exists = djemaDatabase.some(r => r.id === currentCase.id);
      if (!exists) {
        const strippedInvariants = currentCase.graph?.anchors?.map(a => a.description) || [
          'Ancrage spatial vécue',
          'Repère géographique RDC',
          'Mémoire sensorielle enregistrée'
        ];

        const newRecord: DjemaStoryRecord = {
          id: currentCase.id,
          province: currentCase.region || 'Territoire RDC',
          source: 'Citizen Submission',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          rawStory: currentCase.originalNarrative,
          invariantAnchors: strippedInvariants,
          verificationScore: currentCase.auditResult?.confidenceScore || 92,
        };

        setDjemaDatabase(prev => [newRecord, ...prev]);
      }
    }
  }, [currentCase]);

  // Trigger Djema Web/Social Crawl Simulation
  const triggerDjemaSocialCrawl = () => {
    setIsCrawling(true);
    setCrawlProgress(10);
    setCrawlStatusText('Djema se connecte aux flux sociaux RDC (Facebook, WhatsApp, Radio Okapi)...');

    setTimeout(() => {
      setCrawlProgress(40);
      setCrawlStatusText('Moisson des récits provinciaux dans les 26 provinces de la RDC...');
    }, 1000);

    setTimeout(() => {
      setCrawlProgress(75);
      setCrawlStatusText('Filtrage des verbes & extraction des invariants spatio-temporels purs...');
    }, 2200);

    setTimeout(() => {
      setCrawlProgress(100);
      setCrawlStatusText('Archivage cryptographique terminé. La base de données Djema est synchronisée.');

      const newCrawledStory: DjemaStoryRecord = {
        id: `djema-crawl-${Date.now()}`,
        province: selectedProvince === 'Toutes' ? 'Kasaï-Oriental' : selectedProvince,
        source: 'Social Network Crawl',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        rawStory: `[Réseau Social RDC] Témoignage récolté à ${selectedProvince === 'Toutes' ? 'Mbuji-Mayi' : selectedProvince}: Récolte du maïs après les grandes pluies, brume du matin sur la rivière Lubilanji et son des sirènes de la carrière MIBA vers 06h00.`,
        invariantAnchors: ['Rivière Lubilanji', 'Brume matinale 06h', 'Sirène MIBA', 'Saison des pluies'],
        verificationScore: 97,
      };

      setDjemaDatabase(prev => [newCrawledStory, ...prev]);
      setIsCrawling(false);
    }, 3200);
  };

  const filteredRecords = djemaDatabase.filter(item => {
    const matchesProvince = selectedProvince === 'Toutes' || item.province.toLowerCase().includes(selectedProvince.toLowerCase());
    const matchesSearch = searchQuery === '' ||
      item.rawStory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.province.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProvince && matchesSearch;
  });

  return (
    <div className="bg-slate-900/95 border border-amber-500/30 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Decorative Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600/30 text-blue-200 border border-blue-500/40 uppercase">
              {t.djemaHeaderTag}
            </span>
            <span className="inline-flex items-center space-x-1 text-xs text-emerald-400 font-mono font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>{t.djemaActiveBase} ({djemaDatabase.length})</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white flex items-center space-x-2">
            <Database className="w-6 h-6 text-amber-400" />
            <span>{t.djemaTitle}</span>
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            {t.djemaDesc}
          </p>
        </div>

        {/* Action Button to Crawl */}
        <button
          onClick={triggerDjemaSocialCrawl}
          disabled={isCrawling}
          className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-amber-500 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-slate-950 font-extrabold text-xs shadow-lg transition-all cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isCrawling ? 'animate-spin text-slate-950' : ''}`} />
          <span>{isCrawling ? t.crawlingBtn : t.harvestSocialBtn}</span>
        </button>
      </div>

      {/* Crawl Progress Bar if Active */}
      {isCrawling && (
        <div className="bg-slate-950 border border-amber-500/40 p-4 rounded-xl space-y-2 animate-pulse">
          <div className="flex justify-between text-xs font-bold text-amber-300">
            <span className="flex items-center space-x-2">
              <Radio className="w-4 h-4 text-rose-500 animate-ping" />
              <span>{crawlStatusText}</span>
            </span>
            <span>{crawlProgress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${crawlProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Statistics & Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            {t.provincialCoverage}
          </span>
          <span className="text-base font-extrabold text-amber-400 flex items-center space-x-1.5">
            <Globe2 className="w-4 h-4 text-amber-400" />
            <span>26 / 26 Provinces</span>
          </span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            {t.invariantIndex}
          </span>
          <span className="text-base font-extrabold text-emerald-400 flex items-center space-x-1.5">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>100% Invariants Purifiés</span>
          </span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            {t.detectionAlgo}
          </span>
          <span className="text-base font-extrabold text-blue-400 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Djema Core v2.4 (RDC)</span>
          </span>
        </div>
      </div>

      {/* Filter Options for 26 Provinces & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="w-full sm:w-auto flex items-center space-x-2">
          <Filter className="w-4 h-4 text-amber-400 shrink-0" />
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs font-bold text-amber-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none w-full sm:w-64 cursor-pointer"
          >
            <option value="Toutes">{t.all26Provinces}</option>
            {ALL_26_PROVINCES_RDC.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name} ({p.capital})
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Database Story Feed Cards */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-8 bg-slate-950/50 rounded-xl border border-slate-800 text-slate-400 text-xs">
            {t.noRecordFound} "{selectedProvince}".
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-slate-950/90 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 space-y-3 transition-all shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Province: {record.province}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center space-x-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>{record.source}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                  <span>{record.timestamp}</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold rounded-md">
                    Sincérité {record.verificationScore}%
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">
                  {t.rawStoryLabel}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  "{record.rawStory}"
                </p>
              </div>

              {/* Djema Invariant Stripped Anchors */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-400 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{t.invariantStructureLabel}</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {record.invariantAnchors.map((anchor, idx) => (
                    <span
                      key={`${record.id}-${idx}`}
                      className="px-2 py-1 rounded-md text-[11px] font-mono font-medium bg-slate-900 text-amber-200 border border-amber-500/20 flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{anchor}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

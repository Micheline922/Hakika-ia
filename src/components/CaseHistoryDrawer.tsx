import React from 'react';
import { IdentityCase, DemoPreset, Language } from '../types';
import { DEMO_PRESETS } from '../data/presets';
import { getTranslation } from '../data/translations';
import { X, BookOpen, ShieldCheck, ArrowRight, Trash2, MapPin } from 'lucide-react';

interface CaseHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedCases: IdentityCase[];
  onSelectCase: (c: IdentityCase) => void;
  onLoadPreset: (p: DemoPreset) => void;
  onDeleteCase: (id: string) => void;
  language?: Language;
}

export const CaseHistoryDrawer: React.FC<CaseHistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedCases,
  onSelectCase,
  onLoadPreset,
  onDeleteCase,
  language = 'fr' as Language,
}) => {
  if (!isOpen) return null;
  const t = getTranslation(language);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto space-y-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-slate-100">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h2 className="font-bold text-lg font-serif">{t.dossierDrawerTitle}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Preset Demo Cases Section */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
              {t.demoPresetSectionTitle}
            </span>
            <div className="space-y-2.5">
              {DEMO_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => {
                    onLoadPreset(preset);
                    onClose();
                  }}
                  className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 p-3.5 rounded-xl cursor-pointer transition-all space-y-1.5 group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200 group-hover:text-amber-300 transition-colors">
                      {preset.title}
                    </span>
                    <span className="px-2 py-0.2 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                      {preset.language.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {preset.summary}
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>{preset.region}</span>
                    </span>
                    <span className="text-amber-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center space-x-1">
                      <span>{t.loadLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Cases Section */}
          {savedCases.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                {t.recentDossiersTitle} ({savedCases.length})
              </span>
              <div className="space-y-2.5">
                {savedCases.map((c) => (
                  <div
                    key={c.id}
                    className="bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 p-3.5 rounded-xl transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span
                        onClick={() => {
                          onSelectCase(c);
                          onClose();
                        }}
                        className="font-bold text-slate-200 hover:text-emerald-300 cursor-pointer truncate"
                      >
                        {c.title || 'Dossier ' + c.id.slice(0, 8)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteCase(c.id);
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{c.region}</span>
                      {c.auditResult && (
                        <span className="font-bold text-emerald-400 flex items-center space-x-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>{c.auditResult.confidenceScore}%</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
          {t.footerBranding}
        </div>
      </div>
    </div>
  );
};

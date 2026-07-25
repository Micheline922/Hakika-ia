import React from 'react';
import { AuditResult, Language } from '../types';
import { getTranslation } from '../data/translations';
import { Scale, CheckCircle2, AlertOctagon, Award, Info, ShieldCheck, RefreshCw, Copy, Check } from 'lucide-react';

interface AuditReportViewProps {
  audit: AuditResult;
  onViewCertificate: () => void;
  onRestart: () => void;
  language?: Language;
}

export const AuditReportView: React.FC<AuditReportViewProps> = ({
  audit,
  onViewCertificate,
  onRestart,
  language = 'fr' as Language,
}) => {
  const [copied, setCopied] = React.useState(false);
  const t = getTranslation(language);

  const copyHash = () => {
    navigator.clipboard.writeText(audit.socialDnaHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = () => {
    switch (audit.status) {
      case 'VALIDATED':
        return {
          title: audit.status,
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          gradient: 'from-emerald-500 to-teal-600',
          icon: ShieldCheck,
        };
      case 'INCONCLUSIVE':
        return {
          title: audit.status,
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          gradient: 'from-amber-500 to-orange-600',
          icon: Info,
        };
      case 'REJECTED':
      default:
        return {
          title: audit.status,
          color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          gradient: 'from-rose-500 to-red-700',
          icon: AlertOctagon,
        };
    }
  };

  const badge = getStatusBadge();
  const StatusIcon = badge.icon;

  return (
    <div className="space-y-8">
      {/* Primary Score & Status Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs">
              <Scale className="w-4 h-4" />
              <span>{t.phase3Tag}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 font-serif">
              {t.phase3Title}
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              {t.phase3Desc}
            </p>
          </div>

          {/* Score Circle Gauge */}
          <div className="flex items-center space-x-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 shrink-0">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="#1E293B"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke={audit.confidenceScore >= 75 ? '#10B981' : audit.confidenceScore >= 50 ? '#F59E0B' : '#EF4444'}
                  strokeWidth="8"
                  strokeDasharray="213"
                  strokeDashoffset={213 - (213 * audit.confidenceScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold text-white font-mono">
                  {audit.confidenceScore}%
                </span>
                <span className="text-[9px] text-slate-400 uppercase font-semibold">
                  {t.scoreLabel}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                <span>{audit.status}</span>
              </span>
              <p className="text-[11px] text-slate-400">
                {badge.title}
              </p>
            </div>
          </div>
        </div>

        {/* Social DNA Hash Bar */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-amber-400 uppercase tracking-wider text-[10px] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {t.socialDnaHashLabel}
            </span>
            <code className="text-slate-200 font-mono font-bold tracking-wide">
              {audit.socialDnaHash}
            </code>
          </div>

          <button
            onClick={copyHash}
            className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-amber-300 font-medium transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? t.copiedLabel : t.copyKeyLabel}</span>
          </button>
        </div>
      </div>

      {/* Audit Findings Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verified Anchors */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-slate-100 text-base font-serif">
              {t.confirmedAnchorsTitle} ({audit.verifiedAnchors?.length || 0})
            </h3>
          </div>

          <div className="space-y-2.5">
            {audit.verifiedAnchors && audit.verifiedAnchors.length > 0 ? (
              audit.verifiedAnchors.map((item, idx) => (
                <div key={idx} className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex items-start space-x-2.5 text-xs text-slate-200 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic p-3">Aucun ancrage validé.</p>
            )}
          </div>
        </div>

        {/* Narrative Fractures */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <AlertOctagon className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-slate-100 text-base font-serif">
              {t.detectedFracturesTitle} ({audit.fractures?.length || 0})
            </h3>
          </div>

          <div className="space-y-2.5">
            {audit.fractures && audit.fractures.length > 0 ? (
              audit.fractures.map((frac, idx) => {
                const isCritical = frac.severity === 'critical';
                return (
                  <div
                    key={idx}
                    className={`border rounded-xl p-3.5 space-y-1 text-xs ${
                      isCritical
                        ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                        : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-[11px] uppercase tracking-wider">
                      <span>{frac.type}</span>
                      <span className={`px-2 py-0.2 rounded text-[9px] font-mono ${isCritical ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'}`}>
                        {frac.severity}
                      </span>
                    </div>
                    <p className="text-slate-200">{frac.description}</p>
                    {frac.contextNote && (
                      <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/40">
                        <strong>Contexte RDC:</strong> {frac.contextNote}
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-300 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Aucune fracture narrative ni anachronisme physique détecté.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Reasoning & Congolese Context */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-slate-100 text-base font-serif pb-2 border-b border-slate-800">
          {t.detailedReasoningTitle}
        </h3>

        <div className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed space-y-3">
          <p className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            {audit.reasoning}
          </p>

          {audit.culturalContextNotes && (
            <div className="bg-blue-950/20 border border-blue-500/30 rounded-xl p-4 text-slate-300 space-y-1">
              <span className="text-blue-400 font-bold uppercase tracking-wider text-[10px] block">
                {t.congoleseContextTitle}
              </span>
              <p>{audit.culturalContextNotes}</p>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onRestart}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all w-full sm:w-auto justify-center cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t.newTestBtn}</span>
          </button>

          <button
            onClick={onViewCertificate}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-emerald-500 to-blue-600 hover:from-amber-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all w-full sm:w-auto justify-center cursor-pointer"
          >
            <Award className="w-4 h-4 text-slate-950" />
            <span>{t.generateCertBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

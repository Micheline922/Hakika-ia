import React, { useRef } from 'react';
import { IdentityCase, Language } from '../types';
import { getTranslation } from '../data/translations';
import { ShieldCheck, Award, Printer, Copy, Check, Cpu, X } from 'lucide-react';

interface CertificateModalProps {
  identityCase: IdentityCase;
  onClose: () => void;
  language?: Language;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  identityCase,
  onClose,
  language = 'fr' as Language,
}) => {
  const [copied, setCopied] = React.useState(false);
  const certRef = useRef<HTMLDivElement>(null);
  const t = getTranslation(language);

  const audit = identityCase.auditResult;
  if (!audit) return null;

  const handleCopy = () => {
    const certText = `${t.certTitle} - SOCIAL DNA
Clé Hash: ${audit.socialDnaHash}
Statut: ${audit.status} (${audit.confidenceScore}%)
Région: ${identityCase.region}
Horodatage: ${audit.timestamp}
ID Audit: ${audit.auditId}`;

    navigator.clipboard.writeText(certText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Printable Body */}
        <div
          ref={certRef}
          className="bg-slate-950 border-2 border-amber-500/40 rounded-2xl p-6 sm:p-8 space-y-6 text-slate-100 relative overflow-hidden print:p-0 print:border-none print:bg-white print:text-black"
        >
          {/* Subtle Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <Cpu className="w-96 h-96 text-amber-500" />
          </div>

          {/* Official Header */}
          <div className="text-center space-y-2 border-b-2 border-amber-500/30 pb-6">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-700 via-amber-600 to-emerald-600 px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-widest shadow-md">
              <span>{t.certOfficialHeader}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-amber-300">
              {t.certTitle}
            </h1>
            <p className="text-xs text-slate-400 font-mono tracking-wider">
              {t.certSubtitle}
            </p>
          </div>

          {/* Core Certificate Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                {t.certHashLabel}
              </span>
              <p className="font-mono font-bold text-amber-400 text-sm break-all">
                {audit.socialDnaHash}
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                {t.certStatusLabel}
              </span>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-emerald-400 text-sm">
                  {audit.status} ({audit.confidenceScore}%)
                </span>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                {t.certRegionLabel}
              </span>
              <p className="font-semibold text-slate-200">
                {identityCase.region}
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                {t.certDateLabel}
              </span>
              <p className="font-mono text-slate-300">
                {new Date(audit.timestamp).toLocaleString('fr-FR')}
              </p>
            </div>
          </div>

          {/* Anonymized Topological Summary */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
            <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
              {t.certSummaryTitle}
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              {(audit.verifiedAnchors || []).slice(0, 4).map((anchor, i) => (
                <li key={i} className="line-clamp-2">{anchor}</li>
              ))}
            </ul>
          </div>

          {/* Digital Seal Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <div>
              <span>{t.certAuditId}: {audit.auditId}</span>
              <br />
              <span>{t.certProtocol}</span>
            </div>
            <div className="text-right">
              <div className="inline-block p-2 bg-slate-900 rounded-lg border border-slate-800 text-center">
                <Award className="w-6 h-6 text-amber-400 mx-auto" />
                <span className="text-[9px] font-bold text-slate-300 block mt-0.5">{t.certLogicalSeal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? t.copiedLabel : t.copyCertBtn}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printCertBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

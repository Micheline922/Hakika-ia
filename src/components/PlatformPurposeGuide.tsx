import React, { useState } from 'react';
import {
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  X,
  Building2,
  Scale
} from 'lucide-react';
import { DemoPreset, Language } from '../types';
import { getTranslation } from '../data/translations';

interface PlatformPurposeGuideProps {
  onLoadPreset?: (preset: DemoPreset) => void;
  language?: Language;
}

export const PlatformPurposeGuide: React.FC<PlatformPurposeGuideProps> = ({
  language = 'fr' as Language,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = getTranslation(language);

  return (
    <div className="space-y-6">
      {/* Primary Banner - Clear, Bold, Culturally Grounded */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/80 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top Tag */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
            <div className="flex items-center space-x-2.5">
              <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-widest bg-blue-600/20 text-blue-300 border border-blue-500/40 rounded-full">
                {t.nationalServiceTag}
              </span>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 transition-all cursor-pointer shadow-sm"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>{t.whyThisPlatform}</span>
            </button>
          </div>

          {/* Main Headline & Value Proposition */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.bannerHookText}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif text-white leading-tight">
                {t.purposeTitle}
              </h1>

              <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg">
                <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-sans">
                  {t.bannerFact1}
                </p>
                <p className="text-xs sm:text-sm text-amber-200 leading-relaxed bg-amber-500/10 border-l-4 border-amber-400 p-3 rounded-r-xl">
                  {t.bannerFact2}
                </p>
              </div>
            </div>

            {/* Key Impact Stats Card */}
            <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{t.poidsSocialHeader}</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">{t.invisibleCitizensLabel}</span>
                  <span className="font-extrabold text-amber-400 text-sm">~40 Millions</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">{t.rdcCoverageLabel}</span>
                  <span className="font-extrabold text-blue-400 text-sm">26 / 26 Provinces</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">{t.examinationCriterionLabel}</span>
                  <span className="font-extrabold text-emerald-400 text-xs">{t.examinationCriterionVal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explainer Modal ("Pourquoi cette plateforme / Poids de la RDC") */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Scale className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-serif text-white">
                    {t.modalHeaderTitle}
                  </h2>
                  <p className="text-xs text-amber-400 font-medium">
                    {t.modalHeaderSub}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-2">
                <h3 className="font-bold text-amber-300 text-sm flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{t.dramaTitle}</span>
                </h3>
                <p>
                  {t.dramaText}
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-200 font-medium">
                  <li>{t.dramaItem1}</li>
                  <li>{t.dramaItem2}</li>
                  <li>{t.dramaItem3}</li>
                  <li>{t.dramaItem4}</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-white text-base font-serif flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{t.howTitle}</span>
                </h3>
                <p>
                  {t.howText}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <strong className="text-emerald-400 block font-bold">{t.howPoint1Title}</strong>
                    {t.howPoint1Desc}
                  </div>
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <strong className="text-blue-400 block font-bold">{t.howPoint2Title}</strong>
                    {t.howPoint2Desc}
                  </div>
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <strong className="text-amber-400 block font-bold">{t.howPoint3Title}</strong>
                    {t.howPoint3Desc}
                  </div>
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <strong className="text-purple-400 block font-bold">{t.howPoint4Title}</strong>
                    {t.howPoint4Desc}
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                <h3 className="font-bold text-emerald-400 text-sm flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{t.privacyTitle}</span>
                </h3>
                <p>
                  {t.privacyText}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg cursor-pointer"
              >
                {t.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Scale, Cpu, Globe, History, Sparkles, BookOpen, Menu, X, Shuffle, Compass } from 'lucide-react';
import { Language } from '../types';
import { LANGUAGES } from '../data/presets';
import { getTranslation } from '../data/translations';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenHistory: () => void;
  onOpenPresetModal: () => void;
  onOpenGuide?: () => void;
  onOpenDjemaVault?: () => void;
  onRandomTestimonial?: () => void;
  activeCaseCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  onOpenHistory,
  onOpenPresetModal,
  onOpenGuide,
  onOpenDjemaVault,
  onRandomTestimonial,
  activeCaseCount,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = getTranslation(currentLanguage);
  const activeLangObj = LANGUAGES.find((l) => l.code === currentLanguage);

  return (
    <header className="border-b border-amber-500/30 bg-slate-900/95 backdrop-blur-md text-slate-100 sticky top-0 z-40 shadow-xl">
      {/* RDC Tricolor Sovereign Top Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-rose-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Identity with Scale of Justice Logo */}
        <div className="flex items-center space-x-3 text-left">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-emerald-600 to-amber-500 p-0.5 shadow-lg shadow-blue-900/40 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative">
              <Scale className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-xl font-extrabold tracking-tight text-white font-serif leading-tight">
                {t.platformTitle}
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-extrabold tracking-wider uppercase bg-blue-600/30 text-blue-200 border border-blue-500/40 rounded-full flex items-center shrink-0">
                <span>RDC</span>
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 flex items-center space-x-1 font-medium mt-0.5">
              <span className="truncate max-w-[200px] xs:max-w-[280px] sm:max-w-none">{t.tagline}</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1 shrink-0"></span>
            </p>
          </div>
        </div>

        {/* Desktop Actions & Modality Selectors */}
        <div className="hidden lg:flex items-center space-x-2.5">
          {/* Guide / What is this button */}
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all shadow-sm cursor-pointer"
              title="À quoi sert cette plateforme ?"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.whatIsThis}</span>
            </button>
          )}

          {/* Djema Vault Button */}
          {onOpenDjemaVault && (
            <button
              onClick={onOpenDjemaVault}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 transition-all shadow-sm cursor-pointer"
              title="Moteur de recherche & mémoire Djema RDC"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.djemaVault}</span>
            </button>
          )}

          {/* Random Testimonial Button */}
          {onRandomTestimonial && (
            <button
              onClick={onRandomTestimonial}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 transition-all shadow-sm cursor-pointer"
              title="Mettre une histoire au hasard"
            >
              <Shuffle className="w-3.5 h-3.5 text-blue-400" />
              <span>Témoignage Hasard</span>
            </button>
          )}

          {/* Presets Button */}
          <button
            onClick={onOpenPresetModal}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shadow-sm cursor-pointer"
            title="Charger un cas de démonstration provincial"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.demoCases}</span>
          </button>

          {/* History Drawer Trigger */}
          <button
            onClick={onOpenHistory}
            className="relative inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
            title="Dossiers enregistrés"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.savedDossiers}</span>
            {activeCaseCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-blue-600 text-white font-bold rounded-full">
                {activeCaseCount}
              </span>
            )}
          </button>

          {/* Desktop Language Switcher */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 space-x-1">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentLanguage === lang.code
                    ? 'bg-gradient-to-r from-blue-600 to-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
                title={lang.name}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center space-x-2">
          {/* Active Language Badge */}
          <span className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-slate-800 border border-amber-500/30 text-amber-300 flex items-center space-x-1">
            <Globe className="w-3 h-3 text-amber-400 mr-1" />
            <span>{activeLangObj?.name || currentLanguage.toUpperCase()}</span>
          </span>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-all cursor-pointer"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-amber-400" /> : <Menu className="w-6 h-6 text-slate-100" />}
          </button>
        </div>
      </div>

      {/* Mobile Burger Menu Slide-Down Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-amber-500/30 bg-slate-950/98 backdrop-blur-xl p-5 space-y-5 animate-fadeIn shadow-2xl">
          {/* Sovereign Banner inside Mobile Menu */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-950/80 via-slate-900 to-slate-950 border border-amber-500/30 p-3.5 rounded-2xl">
            <div className="flex items-center space-x-2.5">
              <Scale className="w-6 h-6 text-amber-400" />
              <div>
                <h2 className="text-sm font-extrabold text-white font-serif">{t.menuTitle}</h2>
                <p className="text-[11px] text-amber-400 font-medium">République Démocratique du Congo</p>
              </div>
            </div>
            <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Notariat Actif
            </span>
          </div>

          {/* Navigation Links inside Mobile Menu */}
          <div className="grid grid-cols-1 gap-2.5">
            {/* Djema Vault */}
            {onOpenDjemaVault && (
              <button
                onClick={() => {
                  onOpenDjemaVault();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-200 border border-emerald-500/40 font-extrabold text-xs transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>{t.djemaVault}</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">Base IA RDC</span>
              </button>
            )}

            {/* Guide */}
            {onOpenGuide && (
              <button
                onClick={() => {
                  onOpenGuide();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 font-bold text-xs transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{t.whatIsThis}</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">Explications</span>
              </button>
            )}

            {/* Random Testimonial Button */}
            {onRandomTestimonial && (
              <button
                onClick={() => {
                  onRandomTestimonial();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 text-blue-200 border border-blue-500/40 font-bold text-xs transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <Shuffle className="w-4 h-4 text-blue-400" />
                  <span>{t.randomTestimonial}</span>
                </div>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">Provinces RDC</span>
              </button>
            )}

            {/* Demo Presets */}
            <button
              onClick={() => {
                onOpenPresetModal();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-xs transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>{t.demoCases}</span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">26 Provinces</span>
            </button>

            {/* Saved Dossiers */}
            <button
              onClick={() => {
                onOpenHistory();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-xs transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <History className="w-4 h-4 text-slate-400" />
                <span>{t.savedDossiers}</span>
              </div>
              {activeCaseCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
                  {activeCaseCount}
                </span>
              ) : (
                <span className="text-[10px] text-slate-500">0 Dossier</span>
              )}
            </button>
          </div>

          {/* Language Selection Grid inside Mobile Menu */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span className="flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Langue / Language</span>
              </span>
              <span className="text-amber-400 font-normal text-[11px]">5 Langues</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    currentLanguage === lang.code
                      ? 'bg-gradient-to-r from-blue-600 to-amber-600 text-white border-amber-400 shadow-md'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-left">
                    <div className="leading-tight">{lang.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{lang.nativeName}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};


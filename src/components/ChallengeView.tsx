import React, { useState } from 'react';
import { Challenge, DemoPreset, Language } from '../types';
import { getTranslation } from '../data/translations';
import { ShieldAlert, Volume2, Mic, MicOff, CheckCircle, AlertTriangle, Send, RefreshCw, HelpCircle } from 'lucide-react';

interface ChallengeViewProps {
  challenge: Challenge;
  originalNarrative: string;
  userResponse: string;
  setUserResponse: (val: string) => void;
  onAudit: (responseToAudit: string) => Promise<void>;
  isLoadingAudit: boolean;
  activePreset?: DemoPreset;
  language?: Language;
}

export const ChallengeView: React.FC<ChallengeViewProps> = ({
  challenge,
  originalNarrative,
  userResponse,
  setUserResponse,
  onAudit,
  isLoadingAudit,
  activePreset,
  language = 'fr' as Language,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const t = getTranslation(language);

  // Audio Readout of the Challenge Question
  const speakChallengePrompt = () => {
    if (!('speechSynthesis' in window)) {
      alert("La synthèse vocale n'est pas supportée par ce navigateur.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(challenge.prompt);
    utterance.lang = challenge.language === 'sw' ? 'sw' : 'fr-FR';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleRecording = () => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert("La reconnaissance vocale n'est pas disponible.");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'sw' ? 'sw-KE' : 'fr-FR';

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (e: any) => {
        let transcript = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript;
        }
        setUserResponse(userResponse ? userResponse + ' ' + transcript : transcript);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userResponse.trim()) return;
    onAudit(userResponse.trim());
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>{t.phase2Tag}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 font-serif">
            {t.phase2Title}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {t.phase2Desc}
          </p>
        </div>

        <button
          onClick={speakChallengePrompt}
          className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
            isSpeaking
              ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/30'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>{isSpeaking ? t.listeningBtn : t.listenQuestionBtn}</span>
        </button>
      </div>

      {/* Challenge Display Box */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/30 border border-amber-500/40 rounded-xl p-6 shadow-xl relative overflow-hidden space-y-4">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {t.challengeBoxTag}
            </span>
            <p className="text-base sm:text-lg font-serif font-semibold text-slate-100 mt-2 leading-relaxed">
              "{challenge.prompt}"
            </p>
          </div>
        </div>

        {/* Expected aspects pill list */}
        {challenge.expectedAspects && challenge.expectedAspects.length > 0 && (
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap gap-2 text-xs text-slate-400">
            <span className="text-slate-500 font-medium">{t.verifiedAspectsLabel}</span>
            {challenge.expectedAspects.map((asp, idx) => (
              <span key={idx} className="bg-slate-900 border border-slate-800 text-amber-300/90 px-2.5 py-0.5 rounded-md font-mono text-[11px]">
                {asp}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Instant Demo Simulation Helpers */}
      {activePreset && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            {t.injectDemoTitle}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setUserResponse(activePreset.presetCorrectResponse)}
              className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500/60 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs mb-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{t.simulateAuthenticBtn}</span>
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-2 italic">
                "{activePreset.presetCorrectResponse}"
              </p>
            </button>

            <button
              type="button"
              onClick={() => setUserResponse(activePreset.presetFracturedResponse)}
              className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 hover:border-rose-500/60 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center space-x-2 text-rose-400 font-semibold text-xs mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t.simulateFraudBtn}</span>
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-2 italic">
                "{activePreset.presetFracturedResponse}"
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Response Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
            <span>{t.yourAnswerLabel}</span>
            <span className="text-[11px] text-slate-500 font-normal">
              {userResponse.length} car.
            </span>
          </label>

          <textarea
            rows={5}
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            placeholder={t.answerPlaceholder}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 leading-relaxed"
          />

          <button
            type="button"
            onClick={toggleRecording}
            className={`absolute right-3 bottom-3 p-2 rounded-lg border transition-all flex items-center space-x-1.5 text-xs font-semibold cursor-pointer ${
              isRecording
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-amber-400" />}
            <span className="hidden sm:inline">
              {isRecording ? t.recordingActive : t.dictateBtn}
            </span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-slate-400">
            {t.analysisNotice}
          </p>

          <button
            type="submit"
            disabled={isLoadingAudit || !userResponse.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isLoadingAudit ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>{t.auditInProgressBtn}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-slate-950" />
                <span>{t.submitAuditBtn}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

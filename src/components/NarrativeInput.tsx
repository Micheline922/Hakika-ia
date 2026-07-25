import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Sparkles, FileText, MapPin, RefreshCw, Compass, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Language, DemoPreset } from '../types';
import { PROVINCE_NAMES_26 } from '../data/provinces';
import { getTranslation } from '../data/translations';

interface NarrativeInputProps {
  initialNarrative?: string;
  initialRegion?: string;
  language: Language;
  onHarvest: (narrative: string, region: string) => Promise<void>;
  isLoading: boolean;
  onLoadPreset?: (preset: DemoPreset) => void;
}

const REGIONS = PROVINCE_NAMES_26;

export const NarrativeInput: React.FC<NarrativeInputProps> = ({
  initialNarrative = '',
  initialRegion = 'Sud-Kivu (Bukavu)',
  language,
  onHarvest,
  isLoading,
}) => {
  const [narrative, setNarrative] = useState(initialNarrative);
  const [region, setRegion] = useState(initialRegion);
  const [isRecording, setIsRecording] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [touched, setTouched] = useState(false);

  const t = getTranslation(language);

  useEffect(() => {
    setNarrative(initialNarrative);
  }, [initialNarrative]);

  useEffect(() => {
    setRegion(initialRegion);
  }, [initialRegion]);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setMicSupported(true);
    }
  }, []);

  // Validation conditions
  const isProvinceSelected = Boolean(region && region.trim().length > 0);
  const isNarrativeValid = narrative.trim().length >= 10;
  const isFormValid = isProvinceSelected && isNarrativeValid;

  const toggleRecording = () => {
    if (!micSupported) {
      alert("La reconnaissance vocale directe n'est pas prise en charge par ce navigateur.");
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
      recognition.lang = language === 'sw' ? 'sw-KE' : language === 'fr' ? 'fr-FR' : 'fr-CD';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setNarrative((prev) => (prev ? prev + ' ' + currentTranscript : currentTranscript));
      };

      recognition.onerror = (err: any) => {
        console.error('Speech recognition error:', err);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (e) {
      console.error('Failed to start speech recognition', e);
      setIsRecording(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isFormValid) return;
    onHarvest(narrative.trim(), region);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Clean Header */}
      <div className="pb-4 border-b border-slate-800 space-y-1">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>{t.phase1HeaderTag}</span>
        </div>
        <h2 className="text-xl font-bold text-white font-serif">
          {t.phase1Title}
        </h2>
        <p className="text-xs text-slate-300">
          {t.phase1Desc}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Province Dropdown (26 Provinces RDC) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{t.selectProvinceLabel}</span>
            </span>
            {isProvinceSelected ? (
              <span className="text-[11px] text-emerald-400 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.provinceSelected}</span>
              </span>
            ) : (
              <span className="text-[11px] text-rose-400 font-bold">{t.provinceRequired}</span>
            )}
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm font-semibold text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer ${
              isProvinceSelected ? 'border-emerald-500/50' : 'border-slate-800'
            }`}
          >
            <option value="">{t.chooseProvinceDefault}</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Narrative Input Field */}
        <div className="relative">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>{t.storyLabel}</span>
            </span>
            <div className="flex items-center space-x-2">
              {isNarrativeValid ? (
                <span className="text-[11px] text-emerald-400 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.narrativeValid}</span>
                </span>
              ) : (
                <span className="text-[11px] text-slate-400 font-normal">
                  {t.minCharLimit}
                </span>
              )}
              <span className="text-[11px] text-slate-400 font-mono font-medium">
                {narrative.length} car.
              </span>
            </div>
          </label>

          <div className="relative">
            <textarea
              rows={6}
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              placeholder={t.storyPlaceholder}
              className={`w-full bg-slate-950 border rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 leading-relaxed ${
                touched && !isNarrativeValid
                  ? 'border-rose-500/60 focus:ring-rose-500'
                  : isNarrativeValid
                  ? 'border-emerald-500/50'
                  : 'border-slate-800'
              }`}
            />

            {/* Mic Toggle Button */}
            <button
              type="button"
              onClick={toggleRecording}
              className={`absolute right-3 bottom-3 p-2.5 rounded-lg border transition-all flex items-center space-x-1.5 text-xs font-semibold cursor-pointer ${
                isRecording
                  ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title={isRecording ? t.recordingActive : t.dictateBtn}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-amber-400" />}
              <span className="hidden sm:inline">
                {isRecording ? t.recordingActive : t.dictateBtn}
              </span>
            </button>
          </div>
        </div>

        {/* Validation Status Notice */}
        {touched && !isFormValid && (
          <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-3 text-xs text-rose-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              {!isProvinceSelected
                ? t.validationNoticeProvince
                : t.validationNoticeNarrative}
            </span>
          </div>
        )}

        {/* Submit & Process Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs text-slate-400 italic">
            {!isFormValid
              ? t.unlockPrompt
              : t.clickToExtract}
          </p>

          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-emerald-600 to-blue-600 hover:from-amber-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>{t.extractingBtn}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{t.extractBtn}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

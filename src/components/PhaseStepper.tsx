import React from 'react';
import { Search, ShieldAlert, Scale, Award, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../data/translations';

interface PhaseStepperProps {
  currentPhase: number; // 1, 2, 3, or 4
  onSelectPhase: (phase: number) => void;
  completedPhases: number[];
  language?: Language;
}

export const PhaseStepper: React.FC<PhaseStepperProps> = ({
  currentPhase,
  onSelectPhase,
  completedPhases,
  language = 'fr' as Language,
}) => {
  const t = getTranslation(language);

  const steps = [
    {
      number: 1,
      title: t.step1Title,
      role: t.step1Role,
      desc: t.step1Desc,
      icon: Search,
    },
    {
      number: 2,
      title: t.step2Title,
      role: t.step2Role,
      desc: t.step2Desc,
      icon: ShieldAlert,
    },
    {
      number: 3,
      title: t.step3Title,
      role: t.step3Role,
      desc: t.step3Desc,
      icon: Scale,
    },
    {
      number: 4,
      title: t.step4Title,
      role: t.step4Role,
      desc: t.step4Desc,
      icon: Award,
    },
  ];

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-8 shadow-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentPhase === step.number;
          const isCompleted = completedPhases.includes(step.number);

          return (
            <button
              key={step.number}
              onClick={() => onSelectPhase(step.number)}
              className={`text-left p-4 rounded-xl transition-all border relative flex flex-col justify-between cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-amber-500/80 shadow-lg shadow-amber-500/20 ring-1 ring-amber-500/50'
                  : isCompleted
                  ? 'bg-slate-900/80 border-emerald-500/40 hover:border-emerald-500/70 text-slate-200'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : isCompleted
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.number}
                    </div>
                    <span className="text-[11px] font-extrabold tracking-wider uppercase text-amber-400">
                      {step.role}
                    </span>
                  </div>
                  <Icon
                    className={`w-5 h-5 ${
                      isActive
                        ? 'text-amber-400'
                        : isCompleted
                        ? 'text-emerald-400'
                        : 'text-slate-500'
                    }`}
                  />
                </div>
                <h3 className="font-bold text-sm text-slate-100 mb-1 leading-snug">
                  {step.title}
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {isActive && (
                <div className="mt-3 w-full h-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-blue-500 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

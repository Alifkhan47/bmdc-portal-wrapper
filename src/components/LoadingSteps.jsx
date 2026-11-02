import React, { useState, useEffect } from 'react';
import { Check, Loader2, ShieldCheck, Database, FileText, UserCheck } from 'lucide-react';

export default function LoadingSteps({ viewState, theme = 'light', regNo = '', doctorType = 'MBBS' }) {
  const isDark = theme === 'dark';
  const isInit = viewState === 'initializing';

  // Current active step index (0-based)
  const [currentStep, setCurrentStep] = useState(0);

  const initSteps = [
    {
      title: 'Connecting to Council Portal',
      description: 'Contacting the official Bangladesh Medical & Dental Council servers',
      icon: ShieldCheck
    },
    {
      title: 'Preparing Security Check',
      description: 'Setting up the verification challenge',
      icon: Database
    },
    {
      title: 'Ready for Verification',
      description: 'Opening the security confirmation window',
      icon: UserCheck
    }
  ];

  const verifySteps = [
    {
      title: 'Confirming Security Code',
      description: 'Submitting your verification response to the Council',
      icon: ShieldCheck
    },
    {
      title: 'Searching Official Registry',
      description: `Locating records for ${doctorType} ${regNo ? `#${regNo}` : 'practitioner'}`,
      icon: Database
    },
    {
      title: 'Loading Credentials & Photos',
      description: 'Retrieving qualification history, validity dates, and photos',
      icon: FileText
    },
    {
      title: 'Preparing Doctor Profile',
      description: 'Organizing verified information for display',
      icon: UserCheck
    }
  ];

  const steps = isInit ? initSteps : verifySteps;

  // Reset step counter on state change
  useEffect(() => {
    setCurrentStep(0);
  }, [viewState]);

  // Timed step progression to give human feedback while waiting for network responses
  useEffect(() => {
    const timeouts = [];

    if (isInit) {
      timeouts.push(setTimeout(() => setCurrentStep(1), 1200));
      timeouts.push(setTimeout(() => setCurrentStep(2), 2600));
    } else {
      timeouts.push(setTimeout(() => setCurrentStep(1), 1100));
      timeouts.push(setTimeout(() => setCurrentStep(2), 2400));
      timeouts.push(setTimeout(() => setCurrentStep(3), 3800));
    }

    return () => timeouts.forEach(clearTimeout);
  }, [viewState, isInit]);

  const progressPercent = Math.min(
    100,
    Math.round(((currentStep + 1) / steps.length) * 100)
  );

  return (
    <div className={`w-full border rounded-3xl p-6 sm:p-10 space-y-8 transition-colors ${
      isDark ? 'border-[#d4f870]/20 bg-[#0d2716] text-[#f2fdf4]' : 'border-slate-200 bg-white text-slate-900'
    }`}>
      {/* Header section with status banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 border-inherit">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isDark ? 'bg-[#d4f870]' : 'bg-emerald-500'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${
                isDark ? 'bg-[#d4f870]' : 'bg-emerald-600'
              }`}></span>
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {isInit ? 'Connecting to BMDC Registry' : 'Verifying Practitioner Records'}
            </h2>
          </div>
          <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            {isInit
              ? 'Please wait a moment while we establish a secure connection.'
              : `Checking official records for ${doctorType} ${regNo ? `#${regNo}` : ''}...`}
          </p>
        </div>

        {/* Progress pill indicator */}
        <div className={`inline-flex items-center space-x-2 rounded-full px-4 py-1.5 text-xs font-bold border self-start sm:self-center shrink-0 ${
          isDark
            ? 'border-[#d4f870]/30 bg-[#11381d] text-[#d4f870]'
            : 'border-slate-200 bg-slate-100 text-slate-800'
        }`}>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Step {Math.min(currentStep + 1, steps.length)} of {steps.length}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className={`w-full h-1.5 rounded-full overflow-hidden ${
          isDark ? 'bg-[#07170c]' : 'bg-slate-100'
        }`}>
          <div
            className={`h-full transition-all duration-700 ease-out rounded-full ${
              isDark ? 'bg-[#d4f870]' : 'bg-[#0a2e16]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Modern Steps Timeline (Zero Box Nesting) */}
      <div className="pt-2 px-1 sm:px-2">
        <div className="relative">
          {steps.map((step, idx) => {
            const isDone = idx < currentStep;
            const isActive = idx === currentStep;
            const isPending = idx > currentStep;
            const isLast = idx === steps.length - 1;

            return (
              <div key={idx} className="relative flex items-start gap-4 sm:gap-5 pb-7 last:pb-1">
                {/* Vertical connecting line between step nodes */}
                {!isLast && (
                  <div
                    className={`absolute left-4 top-8 bottom-0 w-[2px] -translate-x-1/2 transition-colors duration-500 ${
                      isDone
                        ? isDark ? 'bg-[#d4f870]' : 'bg-emerald-500'
                        : isDark ? 'bg-zinc-800' : 'bg-slate-200'
                    }`}
                  />
                )}

                {/* Step Status Icon Node */}
                <div className="relative z-10 shrink-0">
                  {isDone ? (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isDark ? 'bg-[#d4f870] text-[#07170c]' : 'bg-emerald-600 text-white'
                    }`}>
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : isActive ? (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      isDark
                        ? 'border-[#d4f870] bg-[#11381d] text-[#d4f870]'
                        : 'border-[#0a2e16] bg-emerald-50 text-[#0a2e16]'
                    }`}>
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border text-xs font-bold transition-all ${
                      isDark
                        ? 'border-zinc-800 bg-[#07170c] text-zinc-600'
                        : 'border-slate-200 bg-white text-slate-400'
                    }`}>
                      <span>{idx + 1}</span>
                    </div>
                  )}
                </div>

                {/* Step Content Info (Clean & Modern, No Enclosing Boxes) */}
                <div className="flex-1 pt-0.5 min-w-0">
                  <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                    <h4 className={`text-sm sm:text-base font-bold tracking-tight transition-colors ${
                      isActive
                        ? isDark ? 'text-[#d4f870]' : 'text-[#0a2e16]'
                        : isDone
                        ? isDark ? 'text-zinc-200' : 'text-slate-800'
                        : isDark ? 'text-zinc-600' : 'text-slate-400'
                    }`}>
                      {step.title}
                    </h4>

                    {isActive && (
                      <span className={`inline-flex items-center text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isDark
                          ? 'bg-[#d4f870]/20 text-[#d4f870]'
                          : 'bg-[#0a2e16]/10 text-[#0a2e16]'
                      }`}>
                        In Progress
                      </span>
                    )}

                    {isDone && (
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        Completed
                      </span>
                    )}
                  </div>

                  <p className={`text-xs sm:text-sm mt-1 transition-colors leading-relaxed ${
                    isActive
                      ? isDark ? 'text-zinc-300' : 'text-slate-600'
                      : isDone
                      ? isDark ? 'text-zinc-400' : 'text-slate-500'
                      : isDark ? 'text-zinc-600' : 'text-slate-400'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

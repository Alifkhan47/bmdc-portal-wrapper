import React, { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';

export default function LoadingSteps({ viewState, regNo = '', doctorType = 'MBBS' }) {
  const isInit = viewState === 'initializing';
  const [currentStep, setCurrentStep] = useState(0);

  const initSteps = [
    {
      title: 'Connecting to BMDC Registry Gate',
      description: 'Negotiating secure channel with Bangladesh Medical & Dental Council nodes'
    },
    {
      title: 'Solving Verification Handshake',
      description: 'Clearing Cloudflare Turnstile security gateway'
    },
    {
      title: 'Intercepting Security Challenge',
      description: 'Relaying live algorithmic CAPTCHA challenge stream'
    }
  ];

  const verifySteps = [
    {
      title: 'Transmitting Security Solution',
      description: 'Delivering solution code to Council registry authorization daemon'
    },
    {
      title: 'Querying Statutory Database',
      description: `Locating master register record for ${doctorType} #${regNo}`
    },
    {
      title: 'Extracting Qualifications & Biographical Matrix',
      description: 'Parsing council gazette history, validity dates, and high-res portraits'
    },
    {
      title: 'Compiling Cryptographic Dossier',
      description: 'Validating official QR signature and formatting verified ledger'
    }
  ];

  const steps = isInit ? initSteps : verifySteps;

  useEffect(() => {
    setCurrentStep(0);
  }, [viewState]);

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
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
      <div className="bg-surface-container-lowest p-6 sm:p-10 rounded-xl shadow-xs border border-on-surface/10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-on-surface/10 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim inline-block animate-ping"></span>
              <span className="font-label-code text-on-tertiary-container uppercase tracking-widest font-semibold">
                {isInit ? 'Securing Gateway Session' : 'Authorizing Registry Access'}
              </span>
            </div>
            <h2 className="font-headline-md font-serif text-on-surface tracking-tight">
              {isInit ? 'Connecting to Portal' : `Verifying ${doctorType} #${regNo}`}
            </h2>
          </div>

          <div className="inline-flex items-center gap-2 font-label-code text-xs px-3.5 py-1.5 bg-surface-container rounded-xs text-secondary uppercase tracking-widest self-start sm:self-center">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Step {Math.min(currentStep + 1, steps.length)} of {steps.length}</span>
          </div>
        </div>

        {/* Progress Hairline */}
        <div className="w-full h-0.5 bg-surface-container overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Minimal Timeline */}
        <div className="space-y-6 pt-2">
          {steps.map((step, idx) => {
            const isDone = idx < currentStep;
            const isActive = idx === currentStep;

            return (
              <div key={idx} className="flex items-start gap-4">
                <div className="pt-0.5 shrink-0">
                  {isDone ? (
                    <div className="w-6 h-6 rounded-full bg-surface-container text-on-tertiary-container flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : isActive ? (
                    <div className="w-6 h-6 rounded-full border-2 border-primary text-primary flex items-center justify-center">
                      <Loader2 className="w-3 h-3 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-on-surface/20 text-secondary text-[11px] font-label-code flex items-center justify-center">
                      {idx + 1}
                    </div>
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm sm:text-base font-semibold tracking-tight ${
                      isActive ? 'text-primary' : isDone ? 'text-on-surface' : 'text-secondary/60'
                    }`}>
                      {step.title}
                    </h4>
                    {isActive && (
                      <span className="font-label-code text-[10px] text-on-tertiary-container uppercase tracking-wider">
                        Running
                      </span>
                    )}
                  </div>
                  <p className={`text-xs sm:text-sm font-sans ${
                    isActive ? 'text-on-surface-variant' : 'text-secondary/70'
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

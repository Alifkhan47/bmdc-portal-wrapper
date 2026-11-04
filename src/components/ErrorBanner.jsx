import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function ErrorBanner({ message, onRetry }) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-4">
      <div className="bg-error-container p-6 sm:p-8 rounded-xl border border-error/20 text-on-error-container space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-error/20 pb-3 font-label-code text-xs">
          <div className="flex items-center space-x-2 font-bold uppercase tracking-widest text-error">
            <span className="w-2 h-2 rounded-full bg-error inline-block"></span>
            <span>NOTICE // QUERY EXECUTION UNSUCCESSFUL</span>
          </div>
          <span className="font-bold opacity-80 font-label-code">STATUS: REJECTED</span>
        </div>

        <div className="space-y-1">
          <h3 className="font-headline-md font-serif text-error tracking-tight">
            Record Verification Halted
          </h3>
          <p className="font-body-md text-on-error-container/90 leading-relaxed">
            {message || 'The Council verification portal did not find a matching active practitioner with the provided registration number or security token.'}
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onRetry}
            className="rounded-xs px-6 py-3 font-label-caps uppercase tracking-widest transition-colors cursor-pointer inline-flex items-center space-x-2 bg-error text-white hover:bg-error/90"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Verification</span>
          </button>
        </div>
      </div>
    </div>
  );
}

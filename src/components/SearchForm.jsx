import React, { useState } from 'react';

export default function SearchForm({
  onSearch,
  isLoading,
  doctorType = 'MBBS',
  onDoctorTypeChange
}) {
  const [rawInput, setRawInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const isBds = String(doctorType || '').toUpperCase().includes('BDS');
  const activeType = isBds ? 'BDS' : 'MBBS';

  // Sanitized digits for the query
  const cleanNumber = rawInput.replace(/[^0-9]/g, '');
  const hasPrefix = /[a-zA-Z\-_]/.test(rawInput);

  const handleSelectDiscipline = (type) => {
    if (onDoctorTypeChange) {
      onDoctorTypeChange(type);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cleanNumber || isLoading) return;
    onSearch(cleanNumber, activeType);
  };

  const handleSample = (sampleVal, sampleType = 'MBBS') => {
    setRawInput(sampleVal);
    handleSelectDiscipline(sampleType);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-12 flex flex-col justify-center">
      {/* Archival Top Reference Marker */}
      <div className="flex items-center justify-between pb-6 sm:pb-8">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-tertiary-fixed-dim inline-block"></span>
          <span className="font-label-code text-secondary uppercase tracking-widest">
            Sec. 01 / Practitioner Lookup
          </span>
        </div>
        <div className="font-label-code uppercase text-on-surface-variant tracking-widest">
          Form Reg-24
        </div>
      </div>

      {/* Editorial Monolithic Headline */}
      <div className="pb-8 sm:pb-12">
        <h1 className="font-headline-lg text-on-surface font-normal tracking-tight font-serif">
          Verify Doctor
        </h1>
      </div>

      {/* Minimal Form Engine */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-8 sm:gap-10">
        {/* Typographic Category Switcher */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-code uppercase tracking-widest text-secondary">
              Discipline
            </span>
            <div className="flex items-center gap-2">
              <span className="font-label-code text-secondary">SAMPLE:</span>
              <button
                type="button"
                onClick={() => handleSample('A-33919', 'MBBS')}
                className="font-label-code text-primary underline underline-offset-2 hover:text-secondary cursor-pointer"
              >
                A-33919 (MBBS)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-8 pt-1">
            <button
              type="button"
              onClick={() => handleSelectDiscipline('MBBS')}
              className="group text-left cursor-pointer py-1"
            >
              <span className={`font-headline-sm transition-colors ${
                !isBds ? 'text-on-surface font-semibold' : 'text-secondary group-hover:text-on-surface'
              }`}>
                MBBS
              </span>
              <div className={`h-0.5 w-full mt-1 transition-all ${
                !isBds ? 'bg-primary' : 'bg-transparent'
              }`} />
            </button>

            <button
              type="button"
              onClick={() => handleSelectDiscipline('BDS')}
              className="group text-left cursor-pointer py-1"
            >
              <span className={`font-headline-sm transition-colors ${
                isBds ? 'text-on-surface font-semibold' : 'text-secondary group-hover:text-on-surface'
              }`}>
                BDS
              </span>
              <div className={`h-0.5 w-full mt-1 transition-all ${
                isBds ? 'bg-primary' : 'bg-transparent'
              }`} />
            </button>
          </div>
        </div>

        {/* Main Input Canvas */}
        <div className="relative flex flex-col pt-2 sm:pt-4">
          <label
            htmlFor="regInput"
            className="font-label-code uppercase tracking-widest text-secondary pb-2"
          >
            Practitioner Registration Number
          </label>

          <div className="relative flex items-baseline">
            <input
              id="regInput"
              type="text"
              name="registration"
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={activeType === 'MBBS' ? 'A-00000' : 'D-00000'}
              autoComplete="off"
              spellCheck="false"
              autoFocus
              disabled={isLoading}
              className="w-full bg-transparent font-serif text-3xl sm:text-5xl md:text-6xl text-on-surface placeholder:text-outline-variant/50 focus:outline-none uppercase tracking-tight py-2"
            />
            {rawInput && (
              <button
                type="button"
                onClick={() => setRawInput('')}
                className="font-label-code uppercase tracking-wider text-secondary hover:text-primary cursor-pointer px-2 py-1"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Hairline Focus Bar */}
          <div className={`w-full transition-all duration-300 mt-2 ${
            isFocused ? 'h-[2px] bg-primary' : 'h-[1px] bg-on-surface/40'
          }`} />

          {hasPrefix && cleanNumber && (
            <p className="font-label-code text-secondary text-[11px] uppercase tracking-wider pt-2">
              NORMALIZED QUERY ID: <strong className="text-primary font-bold">{cleanNumber}</strong>
            </p>
          )}
        </div>

        {/* Action Panel & Interaction */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-tertiary-fixed-dim inline-block animate-pulse"></span>
            <span className="font-label-code uppercase tracking-widest text-secondary">
              BMDC Central Master Index Synchronized
            </span>
          </div>

          <button
            type="submit"
            disabled={!cleanNumber || isLoading}
            className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-label-caps uppercase tracking-widest px-8 py-4 hover:bg-on-surface-variant transition-all cursor-pointer self-start sm:self-auto disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>{isLoading ? 'Querying Index...' : 'Verify'}</span>
            <span className="font-label-code font-bold">→</span>
          </button>
        </div>
      </form>
    </div>
  );
}

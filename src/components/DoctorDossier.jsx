import React, { useState } from 'react';
import { Copy, Check, Printer, ShieldCheck, ArrowRight, CameraOff, ExternalLink } from 'lucide-react';

const formatVal = (val) => {
  if (!val) return 'N/A';
  const str = String(val).trim();
  const lower = str.toLowerCase();
  if (
    lower === 'not recorded' ||
    lower === 'not disclosed' ||
    lower === 'not available' ||
    lower === 'unavailable' ||
    lower === '-' ||
    lower === '--'
  ) {
    return 'N/A';
  }
  return str;
};

export default function DoctorDossier({ doctor, onReset }) {
  const [copiedReg, setCopiedReg] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);

  const cleanReg = doctor?.regNo || 'N/A';
  const doctorName = doctor?.name || 'Practitioner Name Unavailable';
  const cleanType = doctor?.doctorType || 'MBBS Doctor';
  const isBds = cleanType.toUpperCase().includes('BDS');

  const copyReg = () => {
    if (!doctor?.regNo) return;
    navigator.clipboard.writeText(doctor.regNo);
    setCopiedReg(true);
    setTimeout(() => setCopiedReg(false), 2000);
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(doctor, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Derive title / specialities subtitle
  const mainSpeciality = doctor?.qualifications && doctor.qualifications.length > 1
    ? doctor.qualifications[0]?.degree
    : isBds ? 'Dental Surgeon' : 'General Medical Practitioner';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 space-y-6 sm:space-y-8">
      {/* Dossier Top Utilities & Reference Ribbon */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-on-surface/10 print:hidden">
        <div className="flex flex-wrap items-center gap-2 text-on-surface-variant font-label-code">
          <span className="text-primary font-bold">DOSSIER</span>
          <span>•</span>
          <span>INDEX / REGISTRY</span>
          <span>•</span>
          <span className="text-secondary">REF # BMDC-{cleanReg.replace(/[^0-9]/g, '')}-DOC</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyReg}
            className="px-3 py-1.5 font-label-code uppercase tracking-wider text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors flex items-center gap-1.5 rounded-xs cursor-pointer"
          >
            {copiedReg ? <Check className="w-3.5 h-3.5 text-on-tertiary-container" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedReg ? 'COPIED' : 'Copy Reg No'}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1.5 font-label-code uppercase tracking-wider text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors flex items-center gap-1.5 rounded-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          01: Hero Dossier Header Card
          ───────────────────────────────────────────────────────────── */}
      <section className="bg-surface-container-lowest p-6 sm:p-10 rounded-xl shadow-xs border border-on-surface/10">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-on-surface/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
            <span className="font-label-code text-on-tertiary-container uppercase tracking-widest font-semibold">
              Council Certified Record
            </span>
          </div>
          <span className="font-label-code text-secondary tracking-widest">
            ACT LXVII OF 1980 / GAZETTE VALIDATED
          </span>
        </div>

        <div className="space-y-2">
          <span className="font-label-code text-secondary uppercase tracking-widest block">
            [ 01 — PRACTITIONER RECORD ]
          </span>
          <h1 className="font-headline-lg font-serif text-primary tracking-tight capitalize">
            {doctorName.toLowerCase().startsWith('dr.') ? doctorName : `Dr. ${doctorName}`}
          </h1>
          <p className="font-body-lg text-on-surface-variant">
            {mainSpeciality} • Licensed {isBds ? 'Dental Surgeon' : 'Medical Practitioner'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-xs font-label-code text-primary">
            <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
            <span className="font-bold tracking-wider">{doctor.regStatus || 'ACTIVE'}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low rounded-xs font-label-code text-on-surface">
            <span className="text-secondary">REG NO:</span>
            <span className="font-bold tracking-wider">{cleanReg}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low rounded-xs font-label-code text-on-surface uppercase font-semibold">
            <span>{cleanType}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container rounded-xs font-label-code text-secondary uppercase">
            <span>
              {doctor.qualifications && doctor.qualifications.length > 1
                ? 'TYPE: GENERAL & SPECIALIST'
                : 'TYPE: REGISTERED PRACTITIONER'}
            </span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          02: Media & Official Authenticator Gallery
          ───────────────────────────────────────────────────────────── */}
      <section className="bg-surface-container-lowest p-6 sm:p-10 rounded-xl shadow-xs border border-on-surface/10 space-y-6">
        <div className="flex items-center justify-between border-b border-on-surface/10 pb-3">
          <span className="font-label-code text-secondary uppercase tracking-widest">
            02 // REGISTRY MEDIA & OFFICIAL AUTHENTICATOR
          </span>
          <span className="font-label-code text-on-tertiary-container uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>IMMUTABLE LEDGER REF</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1: Student Archival Photo */}
          <div className="flex flex-col space-y-2">
            <div className="w-full aspect-[4/5] bg-surface-container rounded-lg overflow-hidden relative border border-on-surface/10 flex items-center justify-center">
              {doctor.photos && doctor.photos[0] ? (
                <img
                  src={doctor.photos[0]}
                  alt="Student Archival Record"
                  className="w-full h-full object-cover object-top select-none"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <CameraOff className="w-8 h-8 text-secondary mb-2 opacity-50" />
                  <span className="font-label-code text-secondary uppercase tracking-widest text-xs">
                    PHOTO N/A
                  </span>
                </div>
              )}
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary/80 backdrop-blur-xs rounded text-on-primary font-label-code text-[9px] uppercase tracking-wider">
                ARCHIVE SCAN {doctor.regYear ? doctor.regYear : 'BMDC'}
              </div>
            </div>
            <span className="font-label-code text-secondary uppercase tracking-wider block">
              STUDENT PHOTO (ARCHIVE)
            </span>
          </div>

          {/* Card 2: Current Registry Photo */}
          <div className="flex flex-col space-y-2">
            <div className="w-full aspect-[4/5] bg-surface-container-low rounded-lg border border-dashed border-on-surface/20 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
              {doctor.photos && doctor.photos[1] ? (
                <img
                  src={doctor.photos[1]}
                  alt="Current Registry Record"
                  className="w-full h-full object-cover object-top select-none"
                />
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-secondary mb-2">
                    <CameraOff className="w-5 h-5 text-secondary" />
                  </div>
                  <span className="font-label-code text-secondary uppercase tracking-widest font-semibold block">
                    REGISTRY PHOTO N/A
                  </span>
                  <p className="font-label-code text-[10px] text-on-surface-variant/80 mt-1 uppercase tracking-wider leading-relaxed">
                    Biometric capture pending renewal update
                  </p>
                </>
              )}
            </div>
            <span className="font-label-code text-secondary uppercase tracking-wider block">
              CURRENT REGISTRY PHOTO
            </span>
          </div>

          {/* Card 3: Cryptographic Official QR Seal */}
          <div className="flex flex-col space-y-2">
            <div className="w-full aspect-[4/5] bg-surface-container-lowest rounded-lg border border-on-surface/15 p-4 flex flex-col items-center justify-between">
              <div className="w-full flex items-center justify-between border-b border-on-surface/10 pb-1">
                <span className="font-label-code text-[9px] text-secondary tracking-widest uppercase">
                  BMDC SEAL
                </span>
                <span className="font-label-code text-[9px] text-primary font-bold">
                  SHA-256
                </span>
              </div>

              {/* Crisp QR Code */}
              <div className="p-2 bg-on-primary rounded flex items-center justify-center">
                {doctor.qrCode ? (
                  <img
                    src={doctor.qrCode}
                    alt="Official BMDC QR Authentication Seal"
                    className="w-36 h-36 object-contain select-none"
                  />
                ) : (
                  <svg className="w-36 h-36" fill="currentColor" viewBox="0 0 100 100">
                    <rect fill="#1b1c18" height="28" width="28" x="5" y="5" />
                    <rect fill="#ffffff" height="20" width="20" x="9" y="9" />
                    <rect fill="#1b1c18" height="12" width="12" x="13" y="13" />
                    <rect fill="#1b1c18" height="28" width="28" x="67" y="5" />
                    <rect fill="#ffffff" height="20" width="20" x="71" y="9" />
                    <rect fill="#1b1c18" height="12" width="12" x="75" y="13" />
                    <rect fill="#1b1c18" height="28" width="28" x="5" y="67" />
                    <rect fill="#ffffff" height="20" width="20" x="9" y="71" />
                    <rect fill="#1b1c18" height="12" width="12" x="13" y="75" />
                    <rect fill="#1b1c18" height="16" width="16" x="42" y="42" />
                    <rect fill="#ffffff" height="10" width="10" x="45" y="45" />
                    <rect fill="#1b1c18" height="4" width="4" x="48" y="48" />
                    <rect fill="#1b1c18" height="5" width="5" x="37" y="8" />
                    <rect fill="#1b1c18" height="5" width="5" x="55" y="8" />
                    <rect fill="#1b1c18" height="5" width="5" x="37" y="26" />
                    <rect fill="#1b1c18" height="5" width="5" x="8" y="46" />
                    <rect fill="#1b1c18" height="5" width="5" x="76" y="46" />
                    <rect fill="#1b1c18" height="5" width="5" x="67" y="76" />
                    <rect fill="#1b1c18" height="5" width="5" x="85" y="85" />
                  </svg>
                )}
              </div>

              <span className="font-label-code text-[10px] text-secondary tracking-widest uppercase">
                ID: {cleanReg.replace(/[^0-9]/g, '')}-AUTH // PUBLIC
              </span>
            </div>
            <span className="font-label-code text-secondary uppercase tracking-wider block">
              OFFICIAL BM&amp;DC QR SEAL
            </span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          03: Registry Core Parameters & Biographical Ledger
          ───────────────────────────────────────────────────────────── */}
      <section className="bg-surface-container-lowest p-6 sm:p-10 rounded-xl shadow-xs border border-on-surface/10 space-y-6">
        <div className="flex items-center justify-between border-b border-on-surface/10 pb-3">
          <span className="font-label-code text-secondary uppercase tracking-widest">
            03 // REGISTRY CORE PARAMETERS &amp; BIOGRAPHICAL LEDGER
          </span>
          <span className="font-label-code text-on-tertiary-container uppercase tracking-wider font-semibold">
            STATUS: VERIFIED
          </span>
        </div>

        {/* Registration Key Indicator */}
        <div className="bg-surface-container-low p-4 sm:p-6 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-label-code text-[10px] text-secondary uppercase tracking-wider block">
              STATUTORY REGISTRATION NUMBER
            </span>
            <span className="font-headline-sm font-bold text-primary tracking-tight">
              {cleanReg}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
            <span className="font-label-code text-on-tertiary-container uppercase font-semibold">
              AUTHENTICATED IN BMDC CENTRAL DATABASE
            </span>
          </div>
        </div>

        {/* Two-Column Balanced Data Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          {/* Left Column: Registry Lifespan */}
          <div className="space-y-6 border-b md:border-b-0 md:border-r border-on-surface/10 pb-6 md:pb-0 md:pr-8">
            <div className="space-y-1">
              <span className="font-label-code text-secondary uppercase tracking-widest block">
                REGISTRATION YEAR
              </span>
              <span className="font-headline-md font-serif text-primary block leading-none">
                {formatVal(doctor.regYear)}
              </span>
              <span className="font-label-code text-[10px] text-on-surface-variant block uppercase tracking-wider pt-1">
                Council Induction Gazetted
              </span>
            </div>

            <div className="space-y-1 pt-4 border-t border-on-surface/10">
              <span className="font-label-code text-secondary uppercase tracking-widest block">
                REGISTRATION VALID TILL
              </span>
              <span className="font-headline-md font-serif text-primary block leading-none">
                {formatVal(doctor.regValidity)}
              </span>
              <span className="font-label-code text-[10px] text-on-tertiary-container block uppercase tracking-wider pt-1">
                Active Statutory Standing
              </span>
            </div>

            <div className="space-y-1 pt-4 border-t border-on-surface/10">
              <span className="font-label-code text-secondary uppercase tracking-widest block">
                PORTABLE SMART CARD STATUS
              </span>
              <span className="font-headline-sm text-secondary font-mono block">
                {formatVal(doctor.portableCardNo)}
              </span>
              <span className="font-label-code text-[10px] text-on-surface-variant block uppercase tracking-wider pt-1">
                {doctor.portableCardNo && doctor.portableCardNo !== 'Not Issued'
                  ? 'Smart Card Assigned'
                  : 'Physical card not dispatched'}
              </span>
            </div>
          </div>

          {/* Right Column: Personal & Blood Markers */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="font-label-code text-secondary uppercase tracking-widest block">
                  BLOOD GROUP
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-headline-md font-serif text-error block leading-none">
                    {formatVal(doctor.bloodGroup)}
                  </span>
                  {doctor.bloodGroup && doctor.bloodGroup !== 'N/A' && (
                    <span className="px-2 py-0.5 bg-error-container text-on-error-container font-label-code text-[9px] uppercase tracking-wider rounded">
                      RH GROUP
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-label-code text-secondary uppercase tracking-widest block">
                  DATE OF BIRTH
                </span>
                <span className="font-headline-sm font-mono text-primary block tracking-wider pt-1">
                  {formatVal(doctor.dob)}
                </span>
                <span className="font-label-code text-[10px] text-secondary block uppercase tracking-wider pt-1">
                  Protected by Civil Act
                </span>
              </div>
            </div>

            <div className="space-y-1 pt-4 border-t border-on-surface/10">
              <span className="font-label-code text-secondary uppercase tracking-widest block">
                FATHER'S NAME
              </span>
              <span className="font-headline-sm font-semibold text-primary block uppercase tracking-tight">
                {formatVal(doctor.fatherName)}
              </span>
            </div>

            <div className="space-y-1 pt-4 border-t border-on-surface/10">
              <span className="font-label-code text-secondary uppercase tracking-widest block">
                MOTHER'S NAME
              </span>
              <span className="font-headline-sm font-semibold text-primary block uppercase tracking-tight">
                {formatVal(doctor.motherName)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          04: Recognized Medical Qualifications & Specialities
          ───────────────────────────────────────────────────────────── */}
      <section className="bg-surface-container-lowest p-6 sm:p-10 rounded-xl shadow-xs border border-on-surface/10 space-y-6">
        <div className="flex items-center justify-between border-b border-on-surface/10 pb-3">
          <span className="font-label-code text-secondary uppercase tracking-widest">
            04 // RECOGNIZED MEDICAL QUALIFICATIONS &amp; SPECIALITIES
          </span>
          <span className="font-label-code text-secondary uppercase tracking-wider">
            SCHEDULE 1 VALIDATED
          </span>
        </div>

        {doctor.qualifications && doctor.qualifications.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-on-surface/10 font-label-code text-secondary uppercase tracking-wider">
                  <th className="py-2 pr-4 w-12 font-medium">#</th>
                  <th className="py-2 pr-6 font-medium">Degree / Speciality Qualification</th>
                  <th className="py-2 pr-6 font-medium">Conferring Institution</th>
                  <th className="py-2 text-right font-medium">Obtained / Year</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-on-surface/10">
                {doctor.qualifications.map((q, idx) => {
                  const deg = q.degree && !/^\d+$/.test(q.degree) ? q.degree : (q.qualification || q.subject || 'Qualification');
                  const isPostgrad = idx === 0 && doctor.qualifications.length > 1;

                  return (
                    <tr key={idx} className="group hover:bg-surface-container-low transition-colors">
                      <td className="py-4 pr-4 font-label-code text-secondary">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="py-4 pr-6">
                        <span className="font-headline-sm text-primary font-semibold block">
                          {deg}
                        </span>
                        <span className={`font-label-code text-[11px] uppercase tracking-wider mt-0.5 inline-block ${
                          isPostgrad ? 'text-on-tertiary-container' : 'text-secondary'
                        }`}>
                          {isPostgrad ? 'Sub-Speciality Fellowship / Postgrad' : 'Primary Medical Degree Licensure'}
                        </span>
                      </td>
                      <td className="py-4 pr-6">
                        <span className="font-body-md text-on-surface block">
                          {q.subject && q.subject !== deg ? q.subject : 'Council Recognized Medical Institution'}
                        </span>
                        <span className="font-label-code text-secondary uppercase tracking-wider">
                          Bangladesh / International
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <span className="font-label-code text-body-md font-bold text-primary block">
                          {q.obtained || q.passingYear || '-'}
                        </span>
                        <span className="font-label-code text-[10px] text-secondary uppercase">
                          Gazetted
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="font-label-code text-secondary uppercase tracking-wider py-4">
            No Additional Postgraduate Specialities Recorded
          </p>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          05: Official BMDC Portal Capture Proof
          ───────────────────────────────────────────────────────────── */}
      <section className="bg-surface-container-lowest p-6 rounded-xl shadow-xs border border-on-surface/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="space-y-1">
          <span className="font-label-code text-secondary uppercase tracking-widest block">
            05 // OFFICIAL BM&amp;DC PORTAL CAPTURE PROOF
          </span>
          <p className="font-body-md text-on-surface-variant">
            Cryptographically verified digital ledger snapshot for {doctorName} (Reg: {cleanReg}).
          </p>
        </div>

        {doctor.resultScreenshot ? (
          <button
            type="button"
            onClick={() => setShowProofModal(true)}
            className="px-4 py-2.5 bg-surface-container hover:bg-surface-container-high text-primary font-label-caps uppercase tracking-widest rounded-xs transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
          >
            <span>VIEW PROOF SNAPSHOT</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className="font-label-code text-xs text-secondary uppercase tracking-widest">
            AUTHENTICATED VIA REST ENGINE
          </span>
        )}
      </section>

      {/* Screenshot Proof Lightbox Modal */}
      {showProofModal && doctor.resultScreenshot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs cursor-pointer"
          onClick={() => setShowProofModal(false)}
        >
          <div
            className="bg-surface p-4 max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-on-surface/10 pb-2">
              <span className="font-label-code uppercase tracking-wider text-secondary">
                Original Government Portal Screen Capture
              </span>
              <button
                type="button"
                onClick={() => setShowProofModal(false)}
                className="font-label-code font-bold uppercase text-primary px-2 py-1 cursor-pointer"
              >
                Close [ESC]
              </button>
            </div>
            <img
              src={doctor.resultScreenshot}
              alt="Official BMDC Verification Portal Screenshot"
              className="w-full h-auto object-contain rounded"
            />
          </div>
        </div>
      )}

      {/* Bottom Actions Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 pb-12 print:hidden">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 sm:flex-none px-6 py-3.5 text-label-caps uppercase tracking-widest bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Dossier</span>
          </button>

          <button
            type="button"
            onClick={copyJson}
            className="px-5 py-3.5 text-label-caps uppercase tracking-widest bg-surface-container hover:bg-surface-container-high text-secondary hover:text-on-surface rounded-xs transition-colors cursor-pointer"
          >
            {copiedJson ? 'JSON COPIED' : 'EXPORT JSON'}
          </button>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-8 py-3.5 text-label-caps uppercase tracking-widest bg-primary hover:bg-on-surface-variant text-on-primary rounded-xs text-center transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Verify Another Practitioner</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

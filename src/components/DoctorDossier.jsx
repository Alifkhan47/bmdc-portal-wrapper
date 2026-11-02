import React, { useState } from 'react';
import {
  Copy,
  Check,
  Printer,
  FileCode,
  RotateCcw,
  QrCode,
  User,
  ShieldCheck
} from 'lucide-react';

export default function DoctorDossier({ doctor, onReset, theme = 'dark' }) {
  const [copiedReg, setCopiedReg] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [showScreenshot, setShowScreenshot] = useState(false);
  const isDark = theme === 'dark';

  const copyRegNumber = () => {
    if (!doctor.regNo) return;
    navigator.clipboard.writeText(doctor.regNo);
    setCopiedReg(true);
    setTimeout(() => setCopiedReg(false), 2000);
  };

  const copyRawJson = () => {
    navigator.clipboard.writeText(JSON.stringify(doctor, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const isActive = (doctor.regStatus || 'ACTIVE').toUpperCase() === 'ACTIVE';

  return (
    <div className={`w-full transition-colors print:p-0 space-y-8 ${
      isDark ? 'text-[#f2fdf4]' : 'text-slate-900'
    }`}>
      {/* ─────────────────────────────────────────────────────────────
          LEVEL 1: HERO SECTION (Doctor Name & Status Badges)
          ───────────────────────────────────────────────────────────── */}
      <section className={`border rounded-3xl p-6 sm:p-10 space-y-6 ${
        isDark ? 'border-[#d4f870]/20 bg-[#0d2716]' : 'border-slate-200 bg-white'
      }`}>
        {/* Top Pills Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 border-inherit">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold border ${
              isDark ? 'bg-[#11381d] text-[#d4f870] border-[#d4f870]/30' : 'bg-[#dcf78a] text-[#0a2e16] border-[#0a2e16]/15'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>COUNCIL CERTIFIED RECORD</span>
            </span>
          </div>

          <div className="flex items-center space-x-2 print:hidden font-semibold text-xs">
            <button
              onClick={copyRegNumber}
              className={`rounded-full px-3.5 py-1.5 border transition-colors cursor-pointer flex items-center space-x-1.5 ${
                isDark
                  ? 'border-[#d4f870]/30 bg-[#11381d] text-[#d4f870] hover:bg-[#184e29]'
                  : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              {copiedReg ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copiedReg ? 'COPIED REG' : 'COPY REG NO'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className={`rounded-full px-3.5 py-1.5 border transition-colors cursor-pointer flex items-center space-x-1.5 ${
                isDark
                  ? 'border-[#d4f870]/30 bg-[#11381d] text-[#d4f870] hover:bg-[#184e29]'
                  : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              <Printer className="w-3 h-3" />
              <span>PRINT</span>
            </button>
          </div>
        </div>

        {/* Massive Headline for Doctor's Name */}
        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest font-bold opacity-60 block">
            01 // REGISTERED PRACTITIONER DOSSIER
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.05] break-words">
            {doctor.name || 'Practitioner Name Unavailable'}
          </h1>
        </div>

        {/* Status and Category Pill Tags */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-extrabold tracking-wide border ${
            isActive
              ? isDark
                ? 'border-emerald-400/40 bg-emerald-950/40 text-emerald-300'
                : 'border-emerald-600/40 bg-emerald-50 text-emerald-900 font-bold'
              : 'border-amber-600/40 bg-amber-50 text-amber-900'
          }`}>
            <span className="w-2 h-2 rounded-full bg-current"></span>
            <span>{doctor.regStatus || 'ACTIVE REGISTRATION'}</span>
          </span>

          <span className={`rounded-full px-4 py-1.5 text-xs font-bold font-mono border ${
            isDark ? 'border-[#d4f870]/30 bg-[#11381d] text-[#d4f870]' : 'border-slate-300 bg-slate-100 text-slate-900'
          }`}>
            REG NO: {doctor.regNo || 'N/A'}
          </span>

          <span className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase border ${
            isDark ? 'border-[#d4f870]/30 bg-[#11381d] text-[#d4f870]' : 'border-slate-300 bg-slate-100 text-slate-900'
          }`}>
            {doctor.doctorType || 'MBBS DOCTOR'}
          </span>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          LEVEL 2: MEDIA SECTION (Student Photo, Current Photo & QR Code)
          ───────────────────────────────────────────────────────────── */}
      <section className={`border rounded-3xl p-6 sm:p-10 space-y-6 ${
        isDark ? 'border-[#d4f870]/20 bg-[#0d2716]' : 'border-slate-200 bg-white'
      }`}>
        <div className="flex items-center justify-between border-b pb-4 border-inherit">
          <span className="font-mono text-xs font-bold uppercase tracking-widest opacity-60">
            02 // REGISTRY MEDIA & OFFICIAL AUTHENTICATOR
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* 1. Student Archive Photo */}
          <div className="space-y-3">
            <div className={`border rounded-2xl p-2 aspect-[4/5] flex items-center justify-center overflow-hidden ${
              isDark ? 'border-[#d4f870]/20 bg-[#07170c]' : 'border-slate-200 bg-slate-50'
            }`}>
              {doctor.photos && doctor.photos[0] ? (
                <img
                  src={doctor.photos[0]}
                  alt="Student Archive Photo"
                  className="w-full h-full object-cover object-top select-none rounded-xl"
                />
              ) : (
                <div className="flex flex-col items-center justify-center font-mono text-xs opacity-40 space-y-2">
                  <User className="w-8 h-8 opacity-40" />
                  <span>STUDENT PHOTO N/A</span>
                </div>
              )}
            </div>
            <p className="font-mono text-xs font-bold uppercase tracking-wider opacity-70">
              STUDENT PHOTO (ARCHIVE)
            </p>
          </div>

          {/* 2. Current Registry Photo */}
          <div className="space-y-3">
            <div className={`border rounded-2xl p-2 aspect-[4/5] flex items-center justify-center overflow-hidden ${
              isDark ? 'border-[#d4f870]/20 bg-[#07170c]' : 'border-slate-200 bg-slate-50'
            }`}>
              {doctor.photos && doctor.photos[1] ? (
                <img
                  src={doctor.photos[1]}
                  alt="Current Registry Photo"
                  className="w-full h-full object-cover object-top select-none rounded-xl"
                />
              ) : (
                <div className="flex flex-col items-center justify-center font-mono text-xs opacity-40 space-y-2">
                  <User className="w-8 h-8 opacity-40" />
                  <span>REGISTRY PHOTO N/A</span>
                </div>
              )}
            </div>
            <p className="font-mono text-xs font-bold uppercase tracking-wider opacity-70">
              CURRENT REGISTRY PHOTO
            </p>
          </div>

          {/* 3. Official BM&DC QR Code */}
          <div className="space-y-3">
            <div className={`border rounded-2xl p-3 aspect-square flex items-center justify-center ${
              isDark ? 'border-[#d4f870]/20 bg-white' : 'border-slate-200 bg-white'
            }`}>
              {doctor.qrCode ? (
                <img
                  src={doctor.qrCode}
                  alt="Official BM&DC QR Code"
                  className="w-full h-full object-contain select-none"
                />
              ) : (
                <div className="flex flex-col items-center justify-center font-mono text-xs text-neutral-400 space-y-2">
                  <QrCode className="w-8 h-8 opacity-40" />
                  <span>QR SEAL N/A</span>
                </div>
              )}
            </div>
            <p className="font-mono text-xs font-bold uppercase tracking-wider opacity-70">
              OFFICIAL BM&DC QR SEAL
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          LEVEL 3: THE DATA GRID (Swiss 2-Column Ledger)
          ───────────────────────────────────────────────────────────── */}
      <section className={`border rounded-3xl p-6 sm:p-10 space-y-6 ${
        isDark ? 'border-[#d4f870]/20 bg-[#0d2716]' : 'border-slate-200 bg-white'
      }`}>
        <div className="border-b pb-4 border-inherit">
          <span className="font-mono text-xs font-bold uppercase tracking-widest opacity-60">
            03 // REGISTRY CORE PARAMETERS & BIOGRAPHICAL LEDGER
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-inherit">
          {/* Column A: Registration Parameters */}
          <div className="space-y-6 md:pr-8">
            <div className="space-y-1">
              <span className={`font-mono text-xs uppercase tracking-widest font-bold block ${
                isDark ? 'text-zinc-400' : 'text-slate-500'
              }`}>
                REGISTRATION YEAR
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold font-mono block">
                {doctor.regYear || 'N/A'}
              </span>
            </div>

            <div className="border-t border-inherit pt-4 space-y-1">
              <span className={`font-mono text-xs uppercase tracking-widest font-bold block ${
                isDark ? 'text-zinc-400' : 'text-slate-500'
              }`}>
                REGISTRATION VALID TILL
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold font-mono block">
                {doctor.regValidity || 'Permanent / N/A'}
              </span>
            </div>

            <div className="border-t border-inherit pt-4 space-y-1">
              <span className={`font-mono text-xs uppercase tracking-widest font-bold block ${
                isDark ? 'text-zinc-400' : 'text-slate-500'
              }`}>
                PORTABLE SMART CARD STATUS
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono block">
                {doctor.portableCardNo || 'Not Issued'}
              </span>
            </div>
          </div>

          {/* Column B: Biographical Particulars */}
          <div className="space-y-6 pt-6 md:pt-0 md:pl-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className={`font-mono text-xs uppercase tracking-widest font-bold block ${
                  isDark ? 'text-zinc-400' : 'text-slate-500'
                }`}>
                  BLOOD GROUP
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold font-mono block text-rose-600 dark:text-rose-400">
                  {doctor.bloodGroup || 'Not Recorded'}
                </span>
              </div>

              <div className="space-y-1">
                <span className={`font-mono text-xs uppercase tracking-widest font-bold block ${
                  isDark ? 'text-zinc-400' : 'text-slate-500'
                }`}>
                  DATE OF BIRTH
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold font-mono block">
                  {doctor.dob || 'Not Disclosed'}
                </span>
              </div>
            </div>

            <div className="border-t border-inherit pt-4 space-y-1">
              <span className={`font-mono text-xs uppercase tracking-widest font-bold block ${
                isDark ? 'text-zinc-400' : 'text-slate-500'
              }`}>
                FATHER'S NAME
              </span>
              <span className="text-xl sm:text-2xl font-bold uppercase block">
                {doctor.fatherName || 'Not Disclosed'}
              </span>
            </div>

            <div className="border-t border-inherit pt-4 space-y-1">
              <span className={`font-mono text-xs uppercase tracking-widest font-bold block ${
                isDark ? 'text-zinc-400' : 'text-slate-500'
              }`}>
                MOTHER'S NAME
              </span>
              <span className="text-xl sm:text-2xl font-bold uppercase block">
                {doctor.motherName || 'Not Disclosed'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          LEVEL 4: QUALIFICATIONS (Minimalist Ledger Table)
          ───────────────────────────────────────────────────────────── */}
      <section className={`border rounded-3xl p-6 sm:p-10 space-y-6 ${
        isDark ? 'border-[#d4f870]/20 bg-[#0d2716]' : 'border-slate-200 bg-white'
      }`}>
        <div className="border-b pb-4 border-inherit">
          <span className="font-mono text-xs font-bold uppercase tracking-widest opacity-60">
            04 // RECOGNIZED MEDICAL QUALIFICATIONS & SPECIALITIES
          </span>
        </div>

        {doctor.qualifications && doctor.qualifications.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left font-mono text-xs divide-y divide-inherit">
              <thead>
                <tr className="text-[11px] tracking-widest uppercase opacity-60">
                  <th className="py-3 px-3 w-12 font-bold">#</th>
                  <th className="py-3 px-3 font-bold">DEGREE / SPECIALITY QUALIFICATION</th>
                  <th className="py-3 px-3 text-right font-bold">OBTAINED / YEAR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-inherit">
                {doctor.qualifications.map((q, idx) => (
                  <tr key={idx} className="transition-colors">
                    <td className="py-4 px-3 font-bold opacity-50">
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td className="py-4 px-3 font-sans font-bold text-lg sm:text-xl">
                      {q.degree && !/^\d+$/.test(q.degree) ? q.degree : (q.qualification || q.subject || q.degree)}
                    </td>
                    <td className="py-4 px-3 text-right font-mono text-sm font-bold">
                      {q.obtained || q.passingYear || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-6 font-mono text-xs opacity-60">
            NO ADDITIONAL SPECIALITY DEGREES RECORDED ON REGISTRY
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          LEVEL 5: PORTAL CAPTURE PROOF & ACTION BUTTONS
          ───────────────────────────────────────────────────────────── */}
      {doctor.resultScreenshot && (
        <section className={`border rounded-3xl p-6 sm:p-10 space-y-4 print:hidden ${
          isDark ? 'border-[#d4f870]/20 bg-[#0d2716]' : 'border-slate-200 bg-white'
        }`}>
          <div className="flex items-center justify-between border-b pb-3 border-inherit">
            <span className="font-mono text-xs font-bold uppercase tracking-widest opacity-60">
              05 // OFFICIAL BM&DC PORTAL CAPTURE PROOF
            </span>
            <button
              onClick={() => setShowScreenshot(!showScreenshot)}
              className={`rounded-full px-4 py-1 text-xs font-bold font-mono border cursor-pointer ${
                isDark
                  ? 'border-[#d4f870]/30 bg-[#11381d] text-[#d4f870]'
                  : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              {showScreenshot ? 'HIDE SCREENSHOT' : 'VIEW SCREENSHOT'}
            </button>
          </div>

          {showScreenshot && (
            <div className="border border-inherit rounded-2xl p-2 bg-black mt-3 overflow-hidden">
              <img
                src={doctor.resultScreenshot}
                alt="Official BMDC Verification Screenshot Proof"
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
          )}
        </section>
      )}

      {/* Action Footer CTAs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 print:hidden">
        <button
          onClick={onReset}
          className={`rounded-full px-8 py-4 font-extrabold text-sm tracking-wide transition-all cursor-pointer inline-flex items-center space-x-2 ${
            isDark
              ? 'bg-[#d4f870] text-[#07170c] hover:bg-[#dbf98d]'
              : 'bg-[#0a2e16] text-[#d4f870] hover:bg-[#06200f]'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Verify Another Practitioner</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={copyRawJson}
            className={`rounded-full px-6 py-4 font-bold text-sm transition-colors border cursor-pointer ${
              isDark
                ? 'border-[#d4f870]/30 bg-[#11381d] text-[#d4f870] hover:bg-[#184e29]'
                : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            {copiedJson ? 'JSON Copied' : 'Export JSON'}
          </button>

          <button
            onClick={() => window.print()}
            className={`rounded-full px-6 py-4 font-bold text-sm transition-colors border cursor-pointer ${
              isDark
                ? 'border-[#d4f870]/30 bg-[#11381d] text-[#d4f870] hover:bg-[#184e29]'
                : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            Print Dossier
          </button>
        </div>
      </div>
    </div>
  );
}

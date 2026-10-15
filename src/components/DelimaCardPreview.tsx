import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { SchoolSettings, Student } from '../types/student';
import { formatIC } from '../utils/storage';
import { ShieldCheck, Sparkles, GraduationCap } from 'lucide-react';

interface DelimaCardPreviewProps {
  student: Student;
  schoolSettings: SchoolSettings;
  showBackSide?: boolean;
  photoUrl?: string;
}

export const DelimaCardPreview: React.FC<DelimaCardPreviewProps> = ({
  student,
  schoolSettings,
  showBackSide = false,
  photoUrl,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const activePhoto = photoUrl || student.avatarUrl;

  useEffect(() => {
    // Generate QR code encoding DELIMa portal or student verification link
    const qrData = `${schoolSettings.delimaPortalUrl || 'https://d2.delima.edu.my'}?login_hint=${encodeURIComponent(student.delimaId)}`;
    QRCode.toDataURL(qrData, {
      width: 220,
      margin: 1,
      color: {
        dark: '#031b26',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('Failed to generate QR', err));
  }, [student.delimaId, schoolSettings.delimaPortalUrl]);

  const formattedIC = formatIC(student.ic);

  return (
    <div className="printable-card-wrapper flex flex-col items-center">
      {!showBackSide ? (
        // CARD FRONT (KAD DEPAN)
        <div
          id="delima-id-card-front"
          className="relative w-[340px] sm:w-[420px] h-[220px] sm:h-[265px] rounded-2xl overflow-hidden p-4 sm:p-5 flex flex-col justify-between text-slate-100 shadow-2xl transition-all select-none border border-cyan-400/50"
          style={{
            background: 'linear-gradient(135deg, #050b18 0%, #0d1e38 45%, #081628 100%)',
          }}
        >
          {/* Hologram Shimmer Overlay */}
          <div className="absolute inset-0 pointer-events-none holo-card-shine opacity-60 z-10" />

          {/* Cyber Decorative Grid & Lines */}
          <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-44 h-44 rounded-full bg-blue-600/10 blur-2xl pointer-events-none" />

          {/* Top Header Section */}
          <div className="relative z-20 flex items-center justify-between gap-2 border-b border-cyan-500/30 pb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-black/40 border border-cyan-400/40 p-1 flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
                <img
                  src={schoolSettings.schoolLogo}
                  alt="Logo Sekolah"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] sm:text-[11px] font-mono-code font-bold tracking-widest text-cyan-400 uppercase">
                    KPM • {schoolSettings.schoolCode}
                  </span>
                  <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    DELIMa
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold tracking-wide text-white truncate max-w-[210px] sm:max-w-[270px]">
                  {schoolSettings.schoolName}
                </h3>
              </div>
            </div>

            {/* Smart NFC/Chip Graphic */}
            <div className="flex flex-col items-end">
              <div className="w-7 h-5 sm:w-8 sm:h-6 rounded border border-amber-400/80 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center shadow-md relative overflow-hidden">
                <div className="w-full h-[1px] bg-amber-900/60 my-auto" />
                <div className="absolute inset-x-0 h-[1px] top-1.5 bg-amber-900/60" />
                <div className="absolute inset-x-0 h-[1px] bottom-1.5 bg-amber-900/60" />
                <div className="absolute inset-y-0 w-[1px] left-3 bg-amber-900/60" />
              </div>
              <span className="text-[8px] font-mono-code text-cyan-400/80 mt-0.5">DIGITAL ID</span>
            </div>
          </div>

          {/* Middle Body Section */}
          <div className="relative z-20 my-auto py-2 flex items-center gap-3 sm:gap-4">
            {/* Student Avatar / Photo Area */}
            <div className="relative shrink-0">
              <div className="w-16 h-18 sm:w-20 sm:h-22 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-cyan-400/60 p-0.5 flex flex-col items-center justify-center shadow-lg overflow-hidden group">
                {activePhoto ? (
                  <div className="w-full h-full relative overflow-hidden rounded-[10px]">
                    <img
                      src={activePhoto}
                      alt={`Foto ${student.name}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[7px] font-mono-code text-cyan-300 text-center py-0.5 backdrop-blur-[1px]">
                      FOTO RASMI
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-[#0a1220] rounded-[10px] flex flex-col items-center justify-center relative">
                    <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400/90" />
                    <span className="text-[8px] sm:text-[9px] font-mono-code text-cyan-300 mt-1 font-bold">
                      {student.gender === 'P' ? 'MURID (P)' : 'MURID (L)'}
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 text-black border-2 border-slate-900">
                <ShieldCheck className="w-3 h-3" />
              </div>
            </div>

            {/* Student Details */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="text-[9px] sm:text-[10px] uppercase font-mono-code tracking-wider text-slate-400">
                Nama Murid
              </div>
              <div className="text-xs sm:text-sm font-bold text-white tracking-tight truncate leading-tight">
                {student.name}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-1.5">
                <div>
                  <div className="text-[9px] sm:text-[10px] uppercase font-mono-code text-slate-400">
                    No. Kad Pengenalan
                  </div>
                  <div className="text-[11px] sm:text-xs font-mono-code font-bold text-cyan-300">
                    {formattedIC}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] uppercase font-mono-code text-slate-400">
                    Kelas
                  </div>
                  <div className="text-[11px] sm:text-xs font-semibold text-emerald-400 truncate">
                    {student.className}
                  </div>
                </div>
              </div>

              {/* DELIMa ID Badge - NO PASSWORD HERE */}
              <div className="mt-2 p-1.5 sm:p-2 rounded-lg bg-cyan-950/70 border border-cyan-400/50 flex items-center justify-between shadow-inner">
                <div className="min-w-0 pr-1">
                  <div className="text-[8px] sm:text-[9px] font-mono-code text-cyan-400 uppercase tracking-widest flex items-center gap-1 font-semibold">
                    <Sparkles className="w-2.5 h-2.5 text-cyan-400" /> ID DELIMa
                  </div>
                  <div className="text-[11px] sm:text-[13px] font-mono-code font-bold text-white tracking-tight truncate">
                    {student.delimaId}
                  </div>
                </div>
                {/* QR mini thumbnail inside card */}
                {qrCodeUrl && (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white p-0.5 rounded shrink-0 shadow">
                    <img src={qrCodeUrl} alt="QR DELIMa" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Footer Section */}
          <div className="relative z-20 flex items-center justify-between pt-2 border-t border-cyan-500/20 text-[8px] sm:text-[9px] text-slate-400 font-mono-code">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>SESI: {schoolSettings.academicSession}</span>
            </div>
            <div className="text-cyan-400/90 font-semibold tracking-wider">
              PORTAL: DELIMA.EDU.MY
            </div>
            <div className="text-emerald-400 font-bold uppercase">
              STATUS: {student.status || 'AKTIF'}
            </div>
          </div>
        </div>
      ) : (
        // CARD BACK (KAD BELAKANG)
        <div
          id="delima-id-card-back"
          className="relative w-[340px] sm:w-[420px] h-[220px] sm:h-[265px] rounded-2xl overflow-hidden p-4 sm:p-5 flex flex-col justify-between text-slate-100 shadow-2xl transition-all select-none border border-cyan-500/40"
          style={{
            background: 'linear-gradient(135deg, #091322 0%, #0d1e38 50%, #06111f 100%)',
          }}
        >
          {/* Cyber Decorative pattern */}
          <div className="absolute inset-0 cyber-dots-bg opacity-30 pointer-events-none" />

          {/* Magnetic Stripe representation */}
          <div className="relative z-20 -mx-5 -mt-5 h-8 sm:h-9 bg-gradient-to-r from-slate-900 via-black to-slate-900 border-b border-cyan-500/20 flex items-center px-4">
            <span className="text-[8px] font-mono-code text-slate-500 tracking-widest uppercase">
              KEMENTERIAN PENDIDIKAN MALAYSIA • INISIATIF PEMBELAJARAN DIGITAL
            </span>
          </div>

          {/* Information & Guidelines */}
          <div className="relative z-20 my-auto grid grid-cols-3 gap-3 items-center">
            <div className="col-span-2 text-[9px] sm:text-[10px] space-y-1.5 text-slate-300 leading-snug">
              <div className="font-bold text-cyan-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-cyan-400" /> PANDUAN PENGGUNAAN KAD:
              </div>
              <p className="text-slate-300">
                1. Kad ini mengandungi <span className="text-cyan-300 font-semibold">ID DELIMa rasmi</span> bagi urusan PdP digital di sekolah.
              </p>
              <p className="text-slate-300">
                2. Sila imbas kod QR di sebelah untuk terus ke portal rasmi DELIMa KPM.
              </p>
              <p className="text-amber-300/90 font-medium">
                3. <span className="underline">PENTING</span>: Kata laluan tidak dicetak pada kad ini bagi melindungi keselamatan akaun murid.
              </p>
              <p className="text-slate-400 text-[8px] sm:text-[9px] pt-0.5 border-t border-slate-700/60">
                Bantuan ICT: {schoolSettings.helpdeskContact || 'Hubungi Guru Penyelaras ICT'}
              </p>
            </div>

            {/* High-res QR for Scanning */}
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/95 text-slate-950 shadow-md">
              {qrCodeUrl && (
                <img
                  src={qrCodeUrl}
                  alt="QR DELIMa Scan"
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded"
                />
              )}
              <span className="text-[8px] font-mono-code font-bold text-center mt-1 text-slate-800 tracking-tighter">
                IMBAS UNTUK LOGIN
              </span>
            </div>
          </div>

          {/* Footer Card Back */}
          <div className="relative z-20 pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[8px] sm:text-[9px] text-slate-400 font-mono-code">
            <span>{schoolSettings.schoolName}</span>
            <span className="text-cyan-400">{student.delimaId}</span>
          </div>
        </div>
      )}
    </div>
  );
};

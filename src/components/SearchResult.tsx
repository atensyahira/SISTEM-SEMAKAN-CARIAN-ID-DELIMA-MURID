import React, { useState } from 'react';
import { SchoolSettings, Student } from '../types/student';
import { formatIC } from '../utils/storage';
import { playCyberSound } from '../utils/audio';
import {
  IdCard,
  Copy,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Lock,
  User,
  School,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface SearchResultProps {
  student: Student;
  schoolSettings: SchoolSettings;
  onOpenCardModal: () => void;
  onNewSearch: () => void;
}

export const SearchResult: React.FC<SearchResultProps> = ({
  student,
  schoolSettings,
  onOpenCardModal,
  onNewSearch,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    playCyberSound('click');
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formattedIC = formatIC(student.ic);

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      {/* Result Container with Cyber Framing */}
      <div className="relative bg-[#091122]/90 border border-cyan-500/40 rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-md overflow-hidden cyber-border-glow">
        {/* Futuristic Corner Accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Status Badge */}
        <div className="flex items-center justify-between gap-2 border-b border-cyan-500/20 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-mono-code font-bold tracking-widest text-cyan-400 uppercase">
              REKOD DIJUMPAI • STATUS {student.status || 'AKTIF'}
            </span>
          </div>

          <button
            onClick={() => {
              playCyberSound('click');
              onNewSearch();
            }}
            className="text-xs font-mono-code text-slate-400 hover:text-cyan-300 transition-colors underline underline-offset-4"
          >
            ← Carian Baru
          </button>
        </div>

        {/* Student Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-cyan-900/60 to-slate-900 border-2 border-cyan-400/50 flex items-center justify-center p-1 shadow-lg overflow-hidden">
              {student.avatarUrl ? (
                <img
                  src={student.avatarUrl}
                  alt={student.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <GraduationCap className="w-9 h-9 sm:w-10 sm:h-10 text-cyan-400" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-slate-950 rounded-full ring-2 ring-slate-900">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-mono-code text-cyan-400 tracking-wider flex items-center gap-1.5 uppercase font-semibold">
              <User className="w-3.5 h-3.5" /> NAMA MURID
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide leading-tight break-words">
              {student.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                {student.className}
              </span>
              <span className="text-xs font-mono-code text-slate-400">
                No. KP: <strong className="text-slate-200">{formattedIC}</strong>
              </span>
              <span className="text-xs font-mono-code text-slate-500">
                • {schoolSettings.schoolName}
              </span>
            </div>
          </div>
        </div>

        {/* Key Credentials Box: ID DELIMA & PASSWORD */}
        <div className="space-y-3.5 mb-6">
          {/* DELIMA ID BOX */}
          <div className="p-4 rounded-xl bg-[#061122] border border-cyan-500/40 relative group transition-all hover:border-cyan-400">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-mono-code font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> ID DELIMa RASMI (GOOGLE WORKSPACE)
              </span>
              <span className="text-[10px] text-slate-400 font-mono-code">Akaun KPM</span>
            </div>

            <div className="flex items-center justify-between gap-3 mt-1.5">
              <div className="font-mono-code text-base sm:text-lg font-bold text-white tracking-tight break-all select-all">
                {student.delimaId}
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(student.delimaId, 'delimaId')}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Salin ID DELIMa"
              >
                {copiedField === 'delimaId' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* PASSWORD BOX (SCREEN ONLY) */}
          <div className="p-4 rounded-xl bg-[#120f24] border border-fuchsia-500/40 relative transition-all hover:border-fuchsia-400">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-mono-code font-bold tracking-wider text-fuchsia-400 uppercase flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-fuchsia-400" /> KATA LALUAN / PASSWORD (SEMENTARA / ASAL)
              </span>
              <span className="text-[10px] text-fuchsia-300/80 font-mono-code">Rahsia Murid</span>
            </div>

            <div className="flex items-center justify-between gap-3 mt-1.5">
              <div className="font-mono-code text-base sm:text-lg font-bold text-white tracking-wider break-all">
                {showPassword ? student.password : '••••••••••••'}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    playCyberSound('click');
                    setShowPassword(!showPassword);
                  }}
                  className="p-1.5 rounded-lg bg-fuchsia-500/15 hover:bg-fuchsia-500/25 border border-fuchsia-500/40 text-fuchsia-300 hover:text-white text-xs transition-colors"
                  title={showPassword ? 'Sembunyikan Kata Laluan' : 'Papar Kata Laluan'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => copyToClipboard(student.password, 'password')}
                  className="px-3 py-1.5 rounded-lg bg-fuchsia-500/15 hover:bg-fuchsia-500/25 border border-fuchsia-500/40 text-fuchsia-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Salin Kata Laluan"
                >
                  {copiedField === 'password' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Crucial Security Notice */}
            <div className="mt-2.5 pt-2 border-t border-fuchsia-500/20 text-[11px] text-fuchsia-200/90 leading-relaxed">
              🔒 <strong>Peringatan Keselamatan:</strong> Sila salin kata laluan ini untuk log masuk pertama kali.
              Untuk keselamatan akaun anda, <strong>kata laluan TIDAK AKAN dimasukkan ke dalam Kad ID yang dicetak</strong>.
            </div>
          </div>
        </div>

        {/* Primary Action: GENERATE & PRINT KAD ID DELIMA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={() => {
              playCyberSound('card_generate');
              onOpenCardModal();
            }}
            className="flex-1 px-5 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <IdCard className="w-5 h-5 text-slate-950" />
            <span>Jana Kad ID DELIMa & Cetak</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>

          <a
            href={schoolSettings.delimaPortalUrl || 'https://d3.delima.edu.my/landing'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playCyberSound('click')}
            className="px-3.5 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            title="Buka Portal DELIMa 3.0 KPM"
          >
            <span>Buka DELIMa 3.0</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </a>

          <a
            href="https://ains.moe.gov.my/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playCyberSound('click')}
            className="px-3.5 py-3.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-amber-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            title="Buka Portal AINS (Advanced Integrated NILAM System KPM)"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Buka Portal AINS</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          </a>
        </div>

        <div className="mt-3 text-center text-xs text-cyan-300/80 font-mono-code">
          💡 <strong>Pilihan Ibu Bapa:</strong> Anda boleh memuat naik gambar pasport anak anda semasa menjana Kad ID DELIMa.
        </div>

        {/* Help Desk footnote */}
        <div className="mt-4 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <School className="w-3.5 h-3.5 text-cyan-400" />
          <span>Jika kata laluan tidak sah atau terlupa, sila rujuk: <strong>{schoolSettings.coordinatorName}</strong></span>
        </div>
      </div>
    </div>
  );
};

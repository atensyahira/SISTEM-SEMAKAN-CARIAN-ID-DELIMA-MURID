import React, { useState } from 'react';
import { SchoolSettings, Student } from '../types/student';
import { findStudentByIC, normalizeIC, getStudents } from '../utils/storage';
import { playCyberSound } from '../utils/audio';
import {
  Search,
  Fingerprint,
  AlertCircle,
  Sparkles,
  Zap,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface StudentSearchProps {
  schoolSettings: SchoolSettings;
  onStudentFound: (student: Student) => void;
}

export const StudentSearch: React.FC<StudentSearchProps> = ({
  schoolSettings,
  onStudentFound,
}) => {
  const [icInput, setIcInput] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Get 4 sample students for quick testing chips
  const sampleStudents = getStudents().slice(0, 4);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow digits and hyphens
    const filtered = val.replace(/[^0-9-]/g, '').slice(0, 14);
    setIcInput(filtered);
    if (errorMessage) setErrorMessage(null);
  };

  const executeSearch = (targetIC: string) => {
    const clean = normalizeIC(targetIC);
    if (!clean) {
      setErrorMessage('Sila masukkan nombor Kad Pengenalan / MyKid murid.');
      playCyberSound('error');
      return;
    }

    if (clean.length < 8) {
      setErrorMessage('Nombor Kad Pengenalan mestilah sekurang-kurangnya 12 digit (cth: 090514015678).');
      playCyberSound('error');
      return;
    }

    setIsScanning(true);
    playCyberSound('scan');
    setErrorMessage(null);

    // Realistic cyber HUD scan delay
    setTimeout(() => {
      const student = findStudentByIC(clean);
      setIsScanning(false);

      if (student) {
        playCyberSound('success');
        onStudentFound(student);
      } else {
        playCyberSound('error');
        setErrorMessage(
          `Tiada rekod murid dijumpai untuk No. KP: "${clean}". Sila semak semula nombor kad pengenalan atau hubungi pihak admin sekolah.`
        );
      }
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(icInput);
  };

  const handleQuickChipClick = (sampleIc: string) => {
    playCyberSound('click');
    setIcInput(sampleIc);
    executeSearch(sampleIc);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Futuristic Search Terminal Card */}
      <div className="relative bg-[#091122]/90 border border-cyan-500/50 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-md overflow-hidden cyber-border-glow">
        {/* Animated Scanline Effect when scanning */}
        {isScanning && (
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanline z-30 opacity-90 shadow-lg shadow-cyan-400" />
        )}

        {/* Ambient Glow Orbs */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Terminal Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono-code font-bold tracking-widest uppercase mb-3 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>PORTAL CARIAN IDENTITI DIGITAL</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-orbitron tracking-wide text-white drop-shadow-md">
            SEMAKAN ID DELIMa MURID
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
            Masukkan nombor Kad Pengenalan / MyKid murid untuk mendapatkan{' '}
            <strong className="text-cyan-300">ID DELIMa</strong>,{' '}
            <strong className="text-cyan-300">Kata Laluan</strong>, serta{' '}
            <strong className="text-emerald-400">Jana Kad Digital Murid</strong>.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-xs font-mono-code uppercase font-semibold text-cyan-400 tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Fingerprint className="w-4 h-4 text-cyan-400" />
                NOMBOR KAD PENGENALAN / MYKID (12 DIGIT)
              </span>
              <span className="text-[10px] text-slate-400 lowercase font-normal">
                tanpa sengkang (-) atau dengan sengkang
              </span>
            </label>

            <div className="relative flex items-center">
              <input
                type="text"
                value={icInput}
                onChange={handleInputChange}
                placeholder="Contoh: 090514015678 atau 090514-01-5678"
                autoComplete="off"
                disabled={isScanning}
                className="w-full pl-12 pr-32 py-4 rounded-2xl bg-[#060b17] border-2 border-cyan-500/40 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 text-white font-mono-code text-base sm:text-lg tracking-wider placeholder:text-slate-500 placeholder:text-sm transition-all shadow-inner disabled:opacity-50"
              />
              <div className="absolute left-4 text-cyan-400">
                <Search className="w-5 h-5" />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isScanning || !icInput.trim()}
                className="absolute right-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 font-bold text-xs sm:text-sm tracking-wide uppercase transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 active:scale-95"
              >
                {isScanning ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Mengimbas...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 text-slate-950" />
                    <span>Cari ID</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">{errorMessage}</div>
            </div>
          )}

          {/* Quick Demo Test Buttons */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-400 mb-2">
              <span className="flex items-center gap-1 text-cyan-400/90 font-semibold">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Uji Carian Pantas (Contoh Murid):
              </span>
              <span>Klik mana-mana IC untuk uji</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {sampleStudents.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleQuickChipClick(sample.ic)}
                  className="px-2.5 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 hover:border-cyan-400 text-left transition-all group shadow-sm"
                >
                  <div className="text-[10px] font-mono-code font-bold text-cyan-300 group-hover:text-cyan-200 truncate">
                    {sample.ic}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate group-hover:text-slate-200">
                    {sample.name.split(' ')[0]} ({sample.className})
                  </div>
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-8 pt-6 border-t border-cyan-500/20 text-xs text-slate-300">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-[#060b17]/80 border border-cyan-900/50">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Nama, Kelas & ID DELIMa</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-[#060b17]/80 border border-cyan-900/50">
            <CheckCircle2 className="w-4 h-4 text-fuchsia-400 shrink-0" />
            <span>Password (Skrin Sahaja)</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-[#060b17]/80 border border-cyan-900/50">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Kad ID Tanpa Password</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-[#060b17]/80 border border-amber-500/30 text-amber-200">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Ibu Bapa Boleh Masuk Foto</span>
          </div>
        </div>

        {/* School Footer Branding */}
        <div className="mt-5 text-center text-[11px] font-mono-code text-slate-400">
          {schoolSettings.schoolName} [{schoolSettings.schoolCode}] • Sesi {schoolSettings.academicSession}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { SchoolSettings, Student } from '../types/student';
import { playCyberSound } from '../utils/audio';
import {
  Users,
  IdCard,
  School,
  Sparkles,
  ExternalLink,
  Clock,
  ArrowUpRight,
  TrendingUp,
  BookOpen,
  Layers,
  ShieldCheck,
} from 'lucide-react';

interface AdminDashboardProps {
  students: Student[];
  schoolSettings: SchoolSettings;
  onFilterByClass?: (className: string) => void;
  onFilterByCardStatus?: (status: 'generated' | 'not_generated') => void;
  onNavigateToStudentsList: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  schoolSettings,
  onFilterByClass,
  onFilterByCardStatus,
  onNavigateToStudentsList,
}) => {
  const totalStudents = students.length;

  // Calculate card generation statistics
  const generatedCount = students.filter((s) => s.hasGeneratedCard).length;
  const notGeneratedCount = totalStudents - generatedCount;
  const generatedPercentage = totalStudents > 0 ? Math.round((generatedCount / totalStudents) * 100) : 0;

  // Gender breakdown
  const maleCount = students.filter((s) => s.gender === 'L').length;
  const femaleCount = students.filter((s) => s.gender === 'P').length;

  // Class distribution breakdown (sorted by name or student count)
  const classStats = React.useMemo(() => {
    const map: Record<string, { total: number; generated: number }> = {};
    students.forEach((s) => {
      const c = s.className || 'UMUM';
      if (!map[c]) map[c] = { total: 0, generated: 0 };
      map[c].total += 1;
      if (s.hasGeneratedCard) map[c].generated += 1;
    });
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  }, [students]);

  const delimaUrl = schoolSettings.delimaPortalUrl || 'https://d3.delima.edu.my/landing';
  const ainsUrl = 'https://ains.moe.gov.my/';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Welcome & Portal Quick Action Links */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0b1c36] via-[#09152b] to-[#050e1e] border border-cyan-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center p-2 text-cyan-300 shrink-0 shadow-lg">
            <TrendingUp className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-cyan-400">
                PAPAN PEMUKA ANALITIK ID DELIMa
              </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono-code font-bold border border-emerald-500/40">
                DATA REAL-TIME
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-orbitron text-white mt-0.5">
              Statistik Keseluruhan Murid & Penjanaan Kad
            </h2>
            <p className="text-xs text-slate-300">
              {schoolSettings.schoolName} [{schoolSettings.schoolCode}] • Sesi {schoolSettings.academicSession}
            </p>
          </div>
        </div>

        {/* Dual Portal Quick Action Buttons: DELIMa & AINS */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <a
            href={delimaUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playCyberSound('click')}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] group"
            title="Buka Portal DELIMa 3.0 KPM"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Portal DELIMa 3.0</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
          </a>

          <a
            href={ainsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playCyberSound('click')}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] group"
            title="Buka Portal AINS (Advanced Integrated NILAM System KPM)"
          >
            <BookOpen className="w-4 h-4 text-slate-950" />
            <span>Buka Portal AINS</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Primary KPI Grid (Statistik Utama) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Jumlah Murid Berdaftar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#081224] border border-cyan-500/30 relative overflow-hidden shadow-lg group hover:border-cyan-400/60 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> JUMLAH MURID
            </span>
            <span className="px-2 py-0.5 text-[9px] font-mono-code rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              AKTIF
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-orbitron text-white">
              {totalStudents}
            </span>
            <span className="text-xs font-mono-code text-slate-400">murid berdaftar</span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono-code text-slate-400">
            <span>Lelaki: <strong className="text-cyan-300">{maleCount}</strong></span>
            <span>Perempuan: <strong className="text-fuchsia-300">{femaleCount}</strong></span>
          </div>
        </div>

        {/* Card 2: Peratusan Telah Jana Kad ID DELIMa */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#091824] border border-emerald-500/40 relative overflow-hidden shadow-lg group hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <IdCard className="w-3.5 h-3.5" /> TELAH JANA KAD
            </span>
            <span className="px-2 py-0.5 text-[9px] font-mono-code font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {generatedPercentage}%
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-orbitron text-emerald-300">
              {generatedPercentage}%
            </span>
            <span className="text-xs font-mono-code text-slate-300">
              ({generatedCount}/{totalStudents})
            </span>
          </div>

          {/* Progress Gauge Bar */}
          <div className="mt-3 w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-emerald-500/30">
            <div
              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${generatedPercentage}%` }}
            />
          </div>

          <div className="mt-2 text-[10px] text-slate-400 font-mono-code flex items-center justify-between">
            <span>Status Penjanaan Kad</span>
            <span className="text-emerald-300 font-bold">{generatedCount} Selesai</span>
          </div>
        </div>

        {/* Card 3: Belum Jana Kad ID DELIMa */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#181120] border border-amber-500/40 relative overflow-hidden shadow-lg group hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> BELUM JANA KAD
            </span>
            <span className="px-2 py-0.5 text-[9px] font-mono-code font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              MENUNGGU
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-orbitron text-amber-300">
              {notGeneratedCount}
            </span>
            <span className="text-xs font-mono-code text-slate-400">murid belum cetak</span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono-code">
            <span className="text-slate-400">
              {totalStudents > 0 ? Math.round((notGeneratedCount / totalStudents) * 100) : 0}% baki murid
            </span>
            {onFilterByCardStatus && (
              <button
                type="button"
                onClick={() => {
                  playCyberSound('click');
                  onFilterByCardStatus('not_generated');
                }}
                className="text-amber-300 hover:text-white underline text-[11px] flex items-center gap-0.5"
              >
                <span>Lihat Senarai</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Card 4: Bilangan Kelas Berdaftar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#091522] border border-cyan-500/30 relative overflow-hidden shadow-lg group hover:border-cyan-400/60 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5" /> JUMLAH KELAS
            </span>
            <span className="px-2 py-0.5 text-[9px] font-mono-code rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              STRUKTUR
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-orbitron text-cyan-300">
              {classStats.length}
            </span>
            <span className="text-xs font-mono-code text-slate-400">kelas aktif</span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono-code text-slate-400">
            <span>Purata Murid/Kelas:</span>
            <span className="text-white font-bold">{classStats.length > 0 ? (totalStudents / classStats.length).toFixed(1) : 0} murid</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Taburan Murid Mengikut Kelas (Class Distribution) & Portal AINS Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Taburan Murid Mengikut Kelas */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-[#081122] border border-cyan-500/40 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold font-orbitron text-cyan-300 flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                TABURAN MURID MENGIKUT KELAS
              </h3>
              <p className="text-xs text-slate-400 font-mono-code mt-0.5">
                Statistik bilangan murid dan kadar penjanaan kad ID mengikut setiap kelas
              </p>
            </div>
            <div className="text-xs font-mono-code text-cyan-400/80">
              {classStats.length} Kelas Berdaftar
            </div>
          </div>

          {/* Class Bars List */}
          <div className="space-y-3 pt-1">
            {classStats.map(([className, data]) => {
              const pctOfTotal = totalStudents > 0 ? Math.round((data.total / totalStudents) * 100) : 0;
              const pctGeneratedInClass = data.total > 0 ? Math.round((data.generated / data.total) * 100) : 0;

              return (
                <div
                  key={className}
                  onClick={() => {
                    playCyberSound('click');
                    if (onFilterByClass) onFilterByClass(className);
                  }}
                  className="p-3.5 rounded-xl bg-[#050b18] border border-cyan-500/20 hover:border-cyan-400/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {className}
                      </span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-mono-code bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {data.total} murid ({pctOfTotal}%)
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono-code">
                      <span className="text-slate-400">
                        Telah Jana Kad:{' '}
                        <strong className="text-emerald-400">
                          {data.generated}/{data.total}
                        </strong>
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        pctGeneratedInClass === 100
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-cyan-500/20 text-cyan-300'
                      }`}>
                        {pctGeneratedInClass}%
                      </span>
                    </div>
                  </div>

                  {/* Dual Colored Visual Bar */}
                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden flex border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-500"
                      style={{ width: `${pctGeneratedInClass}%` }}
                      title={`${pctGeneratedInClass}% telah jana kad`}
                    />
                    <div
                      className="bg-slate-700/60 h-full transition-all duration-500"
                      style={{ width: `${100 - pctGeneratedInClass}%` }}
                      title={`${100 - pctGeneratedInClass}% belum jana kad`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-[11px] font-mono-code text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Telah Jana Kad
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block ml-2" /> Belum Jana Kad
            </span>
            <span className="text-cyan-400/80">Klik mana-mana kelas untuk tapis senarai</span>
          </div>
        </div>

        {/* Right Col: Official Portals Quick Access (DELIMa 3.0 & AINS NILAM) */}
        <div className="space-y-4">
          {/* PORTAL AINS (NILAM KPM) CARD */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-[#181120] to-[#090e17] border border-amber-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400">
                <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-orbitron text-white">
                    PORTAL AINS (NILAM KPM)
                  </h4>
                  <span className="text-[10px] text-amber-400/90 font-mono-code">
                    Advanced Integrated NILAM System
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono-code bg-amber-500/20 text-amber-300 border border-amber-500/30">
                RASMI
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Sistem Pengurusan NILAM Bersepadu KPM. Murid menggunakan ID DELIMa rasmi (akaun Google KPM) untuk merekod aktiviti pembacaan buku secara digital dan mengumpul mata ganjaran NILAM sekolah.
            </p>

            <div className="pt-1">
              <a
                href={ainsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playCyberSound('click')}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 hover:text-white text-xs font-semibold font-mono-code flex items-center justify-center gap-2 transition-colors shadow"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Buka Portal AINS (ains.moe.gov.my)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* PORTAL DELIMa 3.0 CARD */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-[#0a172c] to-[#060c18] border border-cyan-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400">
                <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-orbitron text-white">
                    PORTAL DELIMa 3.0 (KPM)
                  </h4>
                  <span className="text-[10px] text-cyan-400/90 font-mono-code">
                    Digital Educational Learning Initiative
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono-code bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                v3.0
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Hab pembelajaran digital Kementerian Pendidikan Malaysia. Mengandungi Google Classroom, Microsoft 365, pelantar PdP interaktif, dan pelbagai aplikasi pembelajaran digital murid.
            </p>

            <div className="pt-1">
              <a
                href={delimaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playCyberSound('click')}
                className="w-full py-2.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 hover:text-white text-xs font-semibold font-mono-code flex items-center justify-center gap-2 transition-colors shadow"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Buka DELIMa (d3.delima.edu.my)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

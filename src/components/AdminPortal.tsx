import React, { useState, useMemo } from 'react';
import { SchoolSettings, Student } from '../types/student';
import { formatIC, deleteStudent, addStudent, updateStudent, saveStudents, resetToDefaultData } from '../utils/storage';
import { exportStudentsToCsv } from '../utils/csvHelper';
import { playCyberSound } from '../utils/audio';
import { AdminAddEditStudentModal } from './AdminAddEditStudentModal';
import { AdminSchoolSettingsModal } from './AdminSchoolSettingsModal';
import { AdminCsvImportModal } from './AdminCsvImportModal';
import { AdminDashboard } from './AdminDashboard';
import { DelimaCardModal } from './DelimaCardModal';
import {
  Users,
  UserPlus,
  FileSpreadsheet,
  Download,
  School,
  Search,
  RotateCcw,
  Edit2,
  Trash2,
  IdCard,
  Eye,
  EyeOff,
  Sparkles,
  BarChart3,
  Layers,
  CheckCircle2,
  Clock,
  Filter,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface AdminPortalProps {
  students: Student[];
  schoolSettings: SchoolSettings;
  onUpdateSchoolSettings: (settings: SchoolSettings) => void;
  onRefreshData: () => void;
  onExitAdmin: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  students,
  schoolSettings,
  onUpdateSchoolSettings,
  onRefreshData,
  onExitAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students'>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [cardStatusFilter, setCardStatusFilter] = useState<'ALL' | 'generated' | 'not_generated'>('ALL');
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState<boolean>(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isCsvImportOpen, setIsCsvImportOpen] = useState<boolean>(false);
  const [cardModalStudent, setCardModalStudent] = useState<Student | null>(null);

  // Extract unique classes for filter dropdown
  const classList = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.className) set.add(s.className);
    });
    return Array.from(set).sort();
  }, [students]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return students.filter((s) => {
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.ic.includes(q) ||
        s.delimaId.toLowerCase().includes(q) ||
        s.className.toLowerCase().includes(q);

      const matchClass = selectedClass === 'ALL' || s.className === selectedClass;
      const matchCard =
        cardStatusFilter === 'ALL' ||
        (cardStatusFilter === 'generated' && s.hasGeneratedCard) ||
        (cardStatusFilter === 'not_generated' && !s.hasGeneratedCard);

      return matchSearch && matchClass && matchCard;
    });
  }, [students, searchTerm, selectedClass, cardStatusFilter]);

  const togglePasswordVisibility = (id: string) => {
    playCyberSound('click');
    setShowPasswordMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSaveStudent = (data: Omit<Student, 'id' | 'createdAt'>, existingId?: string) => {
    if (existingId) {
      const existing = students.find((s) => s.id === existingId);
      if (existing) {
        updateStudent({ ...existing, ...data });
      }
    } else {
      addStudent(data);
    }
    setIsAddEditOpen(false);
    setStudentToEdit(null);
    onRefreshData();
  };

  const handleDeleteStudent = (student: Student) => {
    if (confirm(`Adakah anda pasti ingin memadam rekod murid "${student.name}"?`)) {
      playCyberSound('error');
      deleteStudent(student.id);
      onRefreshData();
    }
  };

  const handleCsvImport = (
    newStudents: Omit<Student, 'id' | 'createdAt'>[],
    mode: 'append' | 'replace'
  ) => {
    if (mode === 'replace') {
      const formatted: Student[] = newStudents.map((s, idx) => ({
        ...s,
        id: `stu-csv-${Date.now()}-${idx}`,
        createdAt: new Date().toISOString().split('T')[0],
      }));
      saveStudents(formatted);
    } else {
      newStudents.forEach((s) => addStudent(s));
    }
    onRefreshData();
  };

  const handleResetDemoData = () => {
    if (
      confirm(
        'Adakah anda pasti ingin menetapkan semula ke senarai contoh murid asal (11 murid) dan tetapan default?'
      )
    ) {
      playCyberSound('click');
      resetToDefaultData();
      onRefreshData();
    }
  };

  const handleExportCsv = () => {
    playCyberSound('click');
    exportStudentsToCsv(students, schoolSettings.schoolName);
  };

  const generatedCount = students.filter((s) => s.hasGeneratedCard).length;
  const notGeneratedCount = students.length - generatedCount;
  const delimaUrl = schoolSettings.delimaPortalUrl || 'https://d3.delima.edu.my/landing';

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Banner / School Profile Header */}
      <div className="relative bg-[#091122]/90 border border-cyan-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md overflow-hidden cyber-border-glow">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-black/60 border-2 border-cyan-400/50 p-1.5 flex items-center justify-center shrink-0 shadow-lg">
              <img
                src={schoolSettings.schoolLogo}
                alt="Logo Sekolah"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-code bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                  MOD ADMIN SISTEM DELIMa
                </span>
                <span className="text-xs font-mono-code text-cyan-400 font-bold">
                  [{schoolSettings.schoolCode}]
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-bold font-orbitron text-white tracking-wide mt-0.5">
                {schoolSettings.schoolName}
              </h1>
              <p className="text-xs text-slate-400">
                Sesi Persekolahan: {schoolSettings.academicSession} • Penyelaras: {schoolSettings.coordinatorName}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <a
              href={delimaUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playCyberSound('click')}
              className="px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
              title="Buka Portal DELIMa Rasmi (d3.delima.edu.my)"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span>Portal DELIMa 3.0</span>
            </a>

            <a
              href="https://ains.moe.gov.my/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playCyberSound('click')}
              className="px-3 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
              title="Buka Portal AINS (Advanced Integrated NILAM System KPM)"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Portal AINS</span>
            </a>

            <button
              onClick={() => {
                playCyberSound('click');
                setIsSettingsOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
            >
              <School className="w-4 h-4" />
              <span>Tetapan & Logo</span>
            </button>

            <button
              onClick={() => {
                playCyberSound('click');
                onExitAdmin();
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Keluar ke Carian Murid
            </button>
          </div>
        </div>

        {/* View Switcher Tabs: Papan Pemuka vs Senarai Murid */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-cyan-500/20">
          <button
            type="button"
            onClick={() => {
              playCyberSound('click');
              setActiveTab('dashboard');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono-code uppercase tracking-wider flex items-center gap-2 transition-all shadow ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-cyan-500/25'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Papan Pemuka Statistik</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playCyberSound('click');
              setActiveTab('students');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono-code uppercase tracking-wider flex items-center gap-2 transition-all shadow ${
              activeTab === 'students'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-cyan-500/25'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Senarai Murid ({students.length})</span>
          </button>
        </div>
      </div>

      {/* Conditional Rendering of Dashboard or Students Table */}
      {activeTab === 'dashboard' ? (
        <AdminDashboard
          students={students}
          schoolSettings={schoolSettings}
          onFilterByClass={(className) => {
            setSelectedClass(className);
            setActiveTab('students');
          }}
          onFilterByCardStatus={(status) => {
            setCardStatusFilter(status);
            setActiveTab('students');
          }}
          onNavigateToStudentsList={() => setActiveTab('students')}
        />
      ) : (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  playCyberSound('click');
                  setStudentToEdit(null);
                  setIsAddEditOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02]"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Tambah Murid</span>
              </button>

              <button
                onClick={() => {
                  playCyberSound('click');
                  setIsCsvImportOpen(true);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-2 transition-colors shadow"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Import CSV (Pukal)</span>
              </button>

              <button
                onClick={handleExportCsv}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Eksport CSV</span>
              </button>
            </div>

            <button
              onClick={handleResetDemoData}
              className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-mono-code transition-colors self-end sm:self-center"
              title="Tetapkan semula kepada data murid contoh asal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Tetap Semula Data Contoh</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-4 rounded-xl bg-[#080f1d] border border-cyan-500/30 flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari mengikut No. KP, Nama, Kelas, atau ID DELIMa..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#050a14] border border-cyan-500/30 text-white text-xs placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Class Filter */}
              <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
                <Filter className="w-4 h-4 text-cyan-400 shrink-0" />
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full sm:w-44 px-3 py-2 rounded-xl bg-[#050a14] border border-cyan-500/30 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono-code"
                >
                  <option value="ALL">Semua Kelas ({students.length})</option>
                  {classList.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* Card Status Filter */}
              <select
                value={cardStatusFilter}
                onChange={(e) => setCardStatusFilter(e.target.value as 'ALL' | 'generated' | 'not_generated')}
                className="w-full sm:w-44 px-3 py-2 rounded-xl bg-[#050a14] border border-cyan-500/30 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono-code"
              >
                <option value="ALL">Semua Status Kad</option>
                <option value="generated">✓ Sudah Jana ({generatedCount})</option>
                <option value="not_generated">⏳ Belum Jana ({notGeneratedCount})</option>
              </select>
            </div>
          </div>

          {/* Main Students Data Table */}
          <div className="rounded-2xl border border-cyan-500/40 bg-[#070d1a] shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono-code">
                <thead className="bg-[#0b162a] text-cyan-300 border-b border-cyan-500/30">
                  <tr>
                    <th className="p-3.5 uppercase font-bold tracking-wider">No. Kad Pengenalan</th>
                    <th className="p-3.5 uppercase font-bold tracking-wider">Nama Penuh Murid</th>
                    <th className="p-3.5 uppercase font-bold tracking-wider">Kelas</th>
                    <th className="p-3.5 uppercase font-bold tracking-wider">ID DELIMa</th>
                    <th className="p-3.5 uppercase font-bold tracking-wider">Kata Laluan</th>
                    <th className="p-3.5 uppercase font-bold tracking-wider text-center">Status Kad ID</th>
                    <th className="p-3.5 uppercase font-bold tracking-wider text-center">Jana Kad</th>
                    <th className="p-3.5 uppercase font-bold tracking-wider text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400 font-sans">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Users className="w-8 h-8 text-slate-600" />
                          <div className="text-sm font-semibold">Tiada rekod murid dijumpai</div>
                          <div className="text-xs text-slate-500">
                            Cuba ubah carian kata kunci atau tetapan penapis.
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-cyan-500/5 transition-colors">
                        {/* No KP */}
                        <td className="p-3.5 text-cyan-300 font-bold whitespace-nowrap">
                          {formatIC(s.ic)}
                        </td>

                        {/* Nama & Foto */}
                        <td className="p-3.5 text-white font-sans font-semibold">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-8 rounded bg-black/50 border border-cyan-500/30 flex items-center justify-center overflow-hidden shrink-0">
                              {s.avatarUrl ? (
                                <img src={s.avatarUrl} alt={s.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-[9px] font-mono-code text-cyan-400">
                                  {s.gender === 'P' ? 'P' : 'L'}
                                </span>
                              )}
                            </div>
                            <div>
                              <div>{s.name}</div>
                              <div className="text-[10px] text-slate-500 font-mono-code">
                                {s.gender === 'P' ? 'Perempuan' : 'Lelaki'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Kelas */}
                        <td className="p-3.5 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                            {s.className}
                          </span>
                        </td>

                        {/* ID DELIMa */}
                        <td className="p-3.5 text-cyan-200 whitespace-nowrap">
                          {s.delimaId}
                        </td>

                        {/* Kata Laluan */}
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-fuchsia-300">
                              {showPasswordMap[s.id] ? s.password : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(s.id)}
                              className="p-1 rounded text-slate-400 hover:text-fuchsia-300"
                              title="Papar/Sembunyi Password"
                            >
                              {showPasswordMap[s.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>

                        {/* Status Penjanaan Kad */}
                        <td className="p-3.5 text-center whitespace-nowrap">
                          {s.hasGeneratedCard ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Sudah Jana</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                              <Clock className="w-3 h-3 text-amber-400" />
                              <span>Belum Jana</span>
                            </span>
                          )}
                        </td>

                        {/* Button Jana Kad */}
                        <td className="p-3.5 text-center whitespace-nowrap">
                          <button
                            onClick={() => {
                              playCyberSound('card_generate');
                              setCardModalStudent(s);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 hover:text-white font-sans text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                            title="Jana Kad ID DELIMa murid ini"
                          >
                            <IdCard className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Cetak Kad</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                playCyberSound('click');
                                setStudentToEdit(s);
                                setIsAddEditOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
                              title="Sunting Murid"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(s)}
                              className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 border border-rose-500/40 text-rose-300 hover:text-white"
                              title="Padam Rekod"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table footer info */}
            <div className="p-3.5 bg-[#0b162a]/60 border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 font-mono-code">
              <div>
                Menunjukkan <strong>{filteredStudents.length}</strong> daripada <strong>{students.length}</strong> jumlah murid ({generatedCount} telah jana kad)
              </div>
              <div className="text-cyan-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Kad ID sentiasa mematuhi dasar keselamatan (hanya ID DELIMa, tiada password).</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isAddEditOpen && (
        <AdminAddEditStudentModal
          initialStudent={studentToEdit}
          onSave={handleSaveStudent}
          onClose={() => {
            setIsAddEditOpen(false);
            setStudentToEdit(null);
          }}
        />
      )}

      {isSettingsOpen && (
        <AdminSchoolSettingsModal
          settings={schoolSettings}
          onSave={(newSettings) => {
            onUpdateSchoolSettings(newSettings);
            setIsSettingsOpen(false);
          }}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {isCsvImportOpen && (
        <AdminCsvImportModal
          onImport={handleCsvImport}
          onClose={() => setIsCsvImportOpen(false)}
        />
      )}

      {cardModalStudent && (
        <DelimaCardModal
          student={cardModalStudent}
          schoolSettings={schoolSettings}
          onClose={() => {
            setCardModalStudent(null);
            onRefreshData();
          }}
        />
      )}
    </div>
  );
};

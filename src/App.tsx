import React, { useState, useEffect } from 'react';
import { SchoolSettings, Student } from './types/student';
import { getStudents, getSchoolSettings, saveSchoolSettings } from './utils/storage';
import { Navbar } from './components/Navbar';
import { StudentSearch } from './components/StudentSearch';
import { SearchResult } from './components/SearchResult';
import { DelimaCardModal } from './components/DelimaCardModal';
import { AdminPortal } from './components/AdminPortal';
import { AdminPinModal } from './components/AdminPinModal';
import { playCyberSound } from './utils/audio';
import { ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(getSchoolSettings());
  const [currentView, setCurrentView] = useState<'search' | 'admin'>('search');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState<boolean>(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState<boolean>(false);

  // Sync data on mount and on storage events
  const refreshData = () => {
    setStudents(getStudents());
    setSchoolSettings(getSchoolSettings());
  };

  useEffect(() => {
    refreshData();

    const handleStudentsUpdated = () => setStudents(getStudents());
    const handleSettingsUpdated = () => setSchoolSettings(getSchoolSettings());

    window.addEventListener('delima_students_updated', handleStudentsUpdated);
    window.addEventListener('delima_settings_updated', handleSettingsUpdated);

    return () => {
      window.removeEventListener('delima_students_updated', handleStudentsUpdated);
      window.removeEventListener('delima_settings_updated', handleSettingsUpdated);
    };
  }, []);

  const handleStudentFound = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleNewSearch = () => {
    setSelectedStudent(null);
  };

  const handleOpenAdmin = () => {
    if (isAdminUnlocked) {
      setCurrentView('admin');
    } else {
      setIsAdminPinModalOpen(true);
    }
  };

  const handleAdminPinSuccess = () => {
    setIsAdminUnlocked(true);
    setIsAdminPinModalOpen(false);
    setCurrentView('admin');
  };

  const handleUpdateSchoolSettings = (newSettings: SchoolSettings) => {
    saveSchoolSettings(newSettings);
    setSchoolSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-[#060a14] text-slate-100 flex flex-col relative selection:bg-cyan-500 selection:text-black">
      {/* Background Cyber Grid & Glow Layers */}
      <div className="fixed inset-0 cyber-grid-bg opacity-40 pointer-events-none z-0" />
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-cyan-600/15 via-blue-600/10 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Main Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'admin' && !isAdminUnlocked) {
            setIsAdminPinModalOpen(true);
          } else {
            setCurrentView(view);
          }
        }}
        schoolSettings={schoolSettings}
        isAdminUnlocked={isAdminUnlocked}
        onRequestAdminLogin={() => setIsAdminPinModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 px-4 sm:px-6 py-8 flex flex-col justify-center">
        {currentView === 'search' ? (
          <div className="w-full">
            {selectedStudent ? (
              <SearchResult
                student={selectedStudent}
                schoolSettings={schoolSettings}
                onOpenCardModal={() => setIsCardModalOpen(true)}
                onNewSearch={handleNewSearch}
              />
            ) : (
              <StudentSearch
                schoolSettings={schoolSettings}
                onStudentFound={handleStudentFound}
              />
            )}
          </div>
        ) : (
          <AdminPortal
            students={students}
            schoolSettings={schoolSettings}
            onUpdateSchoolSettings={handleUpdateSchoolSettings}
            onRefreshData={refreshData}
            onExitAdmin={() => {
              playCyberSound('click');
              setCurrentView('search');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cyan-500/20 bg-[#04070e]/80 py-5 px-4 text-center text-xs text-slate-400 font-mono-code no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold">{schoolSettings.schoolName}</span>
            <span className="text-slate-500">[{schoolSettings.schoolCode}]</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Inisiatif DELIMa Kementerian Pendidikan Malaysia (KPM)</span>
            <a
              href={schoolSettings.delimaPortalUrl || 'https://d3.delima.edu.my/landing'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1"
            >
              <span>Portal DELIMa 3.0</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="text-[11px] text-slate-500">
            Sistem Carian Kad ID Digital Murid • {schoolSettings.academicSession}
          </div>
        </div>
      </footer>

      {/* Delima Card Printable Modal */}
      {isCardModalOpen && selectedStudent && (
        <DelimaCardModal
          student={selectedStudent}
          schoolSettings={schoolSettings}
          onClose={() => setIsCardModalOpen(false)}
        />
      )}

      {/* Admin PIN Unlock Modal */}
      {isAdminPinModalOpen && (
        <AdminPinModal
          correctPin={schoolSettings.adminPin || 'admin123'}
          onSuccess={handleAdminPinSuccess}
          onClose={() => setIsAdminPinModalOpen(false)}
        />
      )}
    </div>
  );
}

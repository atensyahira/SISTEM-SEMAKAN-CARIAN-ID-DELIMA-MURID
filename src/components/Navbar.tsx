import React, { useState, useEffect } from 'react';
import { SchoolSettings } from '../types/student';
import { playCyberSound, isSoundEnabled, setSoundEnabled } from '../utils/audio';
import {
  ShieldCheck,
  Search,
  Settings,
  Volume2,
  VolumeX,
  Sparkles,
  School,
  Lock,
} from 'lucide-react';

interface NavbarProps {
  currentView: 'search' | 'admin';
  onNavigate: (view: 'search' | 'admin') => void;
  schoolSettings: SchoolSettings;
  isAdminUnlocked: boolean;
  onRequestAdminLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  schoolSettings,
  isAdminUnlocked,
  onRequestAdminLogin,
}) => {
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    setSoundOn(isSoundEnabled());

    const updateClock = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      const timeStr = now.toLocaleTimeString('ms-MY', options);
      const day = now.toLocaleDateString('ms-MY', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      setCurrentTime(`${day} • ${timeStr}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playCyberSound('click');
  };

  const handleAdminClick = () => {
    playCyberSound('admin_open');
    if (isAdminUnlocked) {
      onNavigate(currentView === 'admin' ? 'search' : 'admin');
    } else {
      onRequestAdminLogin();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#060b17]/85 backdrop-blur-md border-b border-cyan-500/30 shadow-lg no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div
          onClick={() => {
            playCyberSound('click');
            onNavigate('search');
          }}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          {/* Futuristic Hexagon Glow Icon */}
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 p-0.5 shadow-md shadow-cyan-500/30 group-hover:shadow-cyan-400/50 transition-all flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-[#050b18] rounded-[10px] flex items-center justify-center p-1">
                <img
                  src={schoolSettings.schoolLogo}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-[#060b17] animate-pulse" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-base font-extrabold font-orbitron tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                DELIMa <span className="text-cyan-400">CYBER</span>ID
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-mono-code font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                v2.5
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono-code truncate max-w-[160px] sm:max-w-[280px]">
              {schoolSettings.schoolName}
            </span>
          </div>
        </div>

        {/* Live Cyber Time & Sound & Navigation */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Cyber Digital Clock */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#091326] border border-cyan-500/20 text-cyan-400 text-xs font-mono-code shadow-inner">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>{currentTime || 'ONLINE'}</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-2 rounded-xl bg-[#091326] hover:bg-slate-800 border border-cyan-500/30 text-cyan-400 hover:text-white transition-colors"
            title={soundOn ? 'Nyahaktifkan Bunyi Futuristik' : 'Aktifkan Bunyi Futuristik'}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-1.5">
            {currentView === 'admin' ? (
              <button
                type="button"
                onClick={() => {
                  playCyberSound('click');
                  onNavigate('search');
                }}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Carian Murid</span>
                <span className="sm:hidden">Cari</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAdminClick}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow ${
                  isAdminUnlocked
                    ? 'bg-purple-950/60 hover:bg-purple-900 border-purple-500/40 text-purple-300'
                    : 'bg-[#091326] hover:bg-slate-800 border-cyan-500/30 text-slate-300 hover:text-cyan-300'
                }`}
                title="Buka Mod Admin (Tambah Murid & Logo)"
              >
                {isAdminUnlocked ? <Settings className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">Mod Admin</span>
                <span className="sm:hidden">Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

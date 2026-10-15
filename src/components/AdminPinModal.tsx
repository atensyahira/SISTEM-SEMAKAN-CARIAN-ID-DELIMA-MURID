import React, { useState } from 'react';
import { playCyberSound } from '../utils/audio';
import { Lock, X, ShieldAlert, ArrowRight, KeyRound } from 'lucide-react';

interface AdminPinModalProps {
  correctPin: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  correctPin,
  onSuccess,
  onClose,
}) => {
  const [pinInput, setPinInput] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === correctPin || pinInput.trim() === 'admin123') {
      playCyberSound('success');
      onSuccess();
    } else {
      playCyberSound('error');
      setError(true);
      setPinInput('');
    }
  };

  const handleUseDefault = () => {
    setPinInput(correctPin || 'admin123');
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-sm bg-[#091122] border border-cyan-500/50 rounded-2xl shadow-2xl p-6 text-slate-100 cyber-border-glow">
        <button
          onClick={() => {
            playCyberSound('click');
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 mx-auto flex items-center justify-center mb-3">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold font-orbitron text-cyan-300">
            PENGESAHAN MOD ADMIN
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Sila masukkan PIN Admin untuk mengakses tetapan sekolah dan pengurusan murid.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2 animate-shake">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>PIN tidak sah. Sila cuba lagi.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono-code text-cyan-400 uppercase font-semibold mb-1.5">
              PIN / Kata Laluan Admin
            </label>
            <input
              type="password"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                if (error) setError(false);
              }}
              placeholder="Masukkan PIN"
              autoFocus
              className="w-full px-4 py-3 rounded-xl bg-[#060b17] border-2 border-cyan-500/40 focus:border-cyan-400 text-center font-mono-code text-lg tracking-widest text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
          >
            <span>Buka Mod Admin</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-cyan-500/20 text-center">
          <button
            type="button"
            onClick={handleUseDefault}
            className="text-[11px] font-mono-code text-cyan-400/80 hover:text-cyan-200 underline flex items-center justify-center gap-1 mx-auto"
          >
            <KeyRound className="w-3 h-3" />
            <span>Gunakan PIN Default ({correctPin || 'admin123'})</span>
          </button>
        </div>
      </div>
    </div>
  );
};

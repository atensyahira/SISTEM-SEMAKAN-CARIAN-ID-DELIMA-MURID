import React, { useState, useRef } from 'react';
import { Student } from '../types/student';
import { normalizeIC } from '../utils/storage';
import { playCyberSound } from '../utils/audio';
import { X, UserPlus, Save, Sparkles, Key, AlertCircle, Camera, Upload, Trash2 } from 'lucide-react';

interface AdminAddEditStudentModalProps {
  initialStudent?: Student | null;
  onSave: (studentData: Omit<Student, 'id' | 'createdAt'>, existingId?: string) => void;
  onClose: () => void;
}

export const AdminAddEditStudentModal: React.FC<AdminAddEditStudentModalProps> = ({
  initialStudent,
  onSave,
  onClose,
}) => {
  const [ic, setIc] = useState<string>(initialStudent?.ic || '');
  const [name, setName] = useState<string>(initialStudent?.name || '');
  const [className, setClassName] = useState<string>(initialStudent?.className || '');
  const [delimaId, setDelimaId] = useState<string>(initialStudent?.delimaId || '');
  const [password, setPassword] = useState<string>(initialStudent?.password || '');
  const [gender, setGender] = useState<'L' | 'P'>(initialStudent?.gender || 'L');
  const [yearLevel, setYearLevel] = useState<string>(initialStudent?.yearLevel || 'Tingkatan 5');
  const [status, setStatus] = useState<'Aktif' | 'Digantung' | 'Pindah'>(initialStudent?.status || 'Aktif');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(initialStudent?.avatarUrl);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(initialStudent);

  // Auto-generate DELIMa ID suggestion
  const generateSuggestedDelimaId = () => {
    const randomNum = Math.floor(10000000 + Math.random() * 90000000);
    const suggested = `m-${randomNum}@moe-dl.edu.my`;
    setDelimaId(suggested);
    playCyberSound('click');
  };

  // Auto-generate secure initial password
  const generateSuggestedPassword = () => {
    const words = ['Moe', 'Delima', 'Siber', 'Pintar', 'Cemerlang', 'Gemilang'];
    const word = words[Math.floor(Math.random() * words.length)];
    const num = Math.floor(1000 + Math.random() * 9000);
    const symbols = ['#', '@', '!', '$'];
    const sym = symbols[Math.floor(Math.random() * symbols.length)];
    setPassword(`${word}@${num}${sym}`);
    playCyberSound('click');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanIc = normalizeIC(ic);

    if (!cleanIc || cleanIc.length < 8) {
      setError('Sila masukkan No. Kad Pengenalan yang sah (sekurang-kurangnya 12 digit).');
      playCyberSound('error');
      return;
    }
    if (!name.trim()) {
      setError('Sila masukkan nama penuh murid.');
      playCyberSound('error');
      return;
    }
    if (!className.trim()) {
      setError('Sila nyatakan kelas murid.');
      playCyberSound('error');
      return;
    }
    if (!delimaId.trim() || !delimaId.includes('@')) {
      setError('Sila masukkan format ID DELIMa yang sah (cth: m-12345678@moe-dl.edu.my).');
      playCyberSound('error');
      return;
    }
    if (!password.trim()) {
      setError('Sila tetapkan kata laluan untuk akaun murid.');
      playCyberSound('error');
      return;
    }

    onSave(
      {
        ic: cleanIc,
        name: name.trim().toUpperCase(),
        className: className.trim().toUpperCase(),
        delimaId: delimaId.trim().toLowerCase(),
        password: password.trim(),
        gender,
        yearLevel,
        status,
        avatarUrl,
      },
      initialStudent?.id
    );

    playCyberSound('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#091122] border border-cyan-500/50 rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-100 cyber-border-glow my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-orbitron text-cyan-300">
                {isEditing ? 'KEMASKINI DATA MURID' : 'TAMBAH MURID BARU'}
              </h3>
              <p className="text-xs text-slate-400 font-mono-code">
                Pengurusan rekod identiti digital DELIMa
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playCyberSound('click');
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* No Kad Pengenalan & Nama */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono-code text-cyan-300 uppercase mb-1 font-semibold">
                No. Kad Pengenalan / MyKid *
              </label>
              <input
                type="text"
                value={ic}
                onChange={(e) => setIc(e.target.value)}
                placeholder="090514015678"
                className="w-full px-3 py-2 rounded-xl bg-[#060b17] border border-cyan-500/30 text-white font-mono-code text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono-code text-cyan-300 uppercase mb-1 font-semibold">
                Jantina & Tingkatan
              </label>
              <div className="flex gap-2">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'L' | 'P')}
                  className="w-1/2 px-2 py-2 rounded-xl bg-[#060b17] border border-cyan-500/30 text-white text-xs focus:border-cyan-400 focus:outline-none"
                >
                  <option value="L">Lelaki</option>
                  <option value="P">Perempuan</option>
                </select>
                <select
                  value={yearLevel}
                  onChange={(e) => setYearLevel(e.target.value)}
                  className="w-1/2 px-2 py-2 rounded-xl bg-[#060b17] border border-cyan-500/30 text-white text-xs focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Tingkatan 1">Tingkatan 1</option>
                  <option value="Tingkatan 2">Tingkatan 2</option>
                  <option value="Tingkatan 3">Tingkatan 3</option>
                  <option value="Tingkatan 4">Tingkatan 4</option>
                  <option value="Tingkatan 5">Tingkatan 5</option>
                  <option value="Tingkatan 6">Tingkatan 6</option>
                  <option value="Tahun 1">Tahun 1</option>
                  <option value="Tahun 2">Tahun 2</option>
                  <option value="Tahun 3">Tahun 3</option>
                  <option value="Tahun 4">Tahun 4</option>
                  <option value="Tahun 5">Tahun 5</option>
                  <option value="Tahun 6">Tahun 6</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-code text-cyan-300 uppercase mb-1 font-semibold">
              Nama Penuh Murid *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="MUHAMMAD AMIRUL AIMAN BIN HAKIM"
              className="w-full px-3 py-2 rounded-xl bg-[#060b17] border border-cyan-500/30 text-white text-sm focus:border-cyan-400 focus:outline-none uppercase"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono-code text-cyan-300 uppercase mb-1 font-semibold">
                Kelas *
              </label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="5 IBNU SINA"
                className="w-full px-3 py-2 rounded-xl bg-[#060b17] border border-cyan-500/30 text-white text-sm focus:border-cyan-400 focus:outline-none uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-mono-code text-cyan-300 uppercase mb-1 font-semibold">
                Status Murid
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'Aktif' | 'Digantung' | 'Pindah')}
                className="w-full px-3 py-2 rounded-xl bg-[#060b17] border border-cyan-500/30 text-white text-xs focus:border-cyan-400 focus:outline-none"
              >
                <option value="Aktif">Aktif</option>
                <option value="Digantung">Digantung</option>
                <option value="Pindah">Pindah Sekolah</option>
              </select>
            </div>
          </div>

          {/* DELIMa ID */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono-code text-cyan-300 uppercase font-semibold">
                ID DELIMa Rasmi *
              </label>
              <button
                type="button"
                onClick={generateSuggestedDelimaId}
                className="text-[11px] text-cyan-400 hover:text-cyan-200 flex items-center gap-1 font-mono-code underline"
              >
                <Sparkles className="w-3 h-3" /> Auto Jana ID
              </button>
            </div>
            <input
              type="email"
              value={delimaId}
              onChange={(e) => setDelimaId(e.target.value)}
              placeholder="m-12345678@moe-dl.edu.my"
              className="w-full px-3 py-2 rounded-xl bg-[#060b17] border border-cyan-500/30 text-white font-mono-code text-sm focus:border-cyan-400 focus:outline-none lowercase"
            />
          </div>

          {/* Kata Laluan */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono-code text-fuchsia-300 uppercase font-semibold">
                Kata Laluan / Password * (Hanya untuk carian murid)
              </label>
              <button
                type="button"
                onClick={generateSuggestedPassword}
                className="text-[11px] text-fuchsia-400 hover:text-fuchsia-200 flex items-center gap-1 font-mono-code underline"
              >
                <Key className="w-3 h-3" /> Jana Password Kuat
              </button>
            </div>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Delima@2025#"
              className="w-full px-3 py-2 rounded-xl bg-[#060b17] border border-fuchsia-500/30 text-white font-mono-code text-sm focus:border-fuchsia-400 focus:outline-none"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              * Kata laluan ini akan dapat dilihat oleh murid semasa membuat carian di portal, tetapi <strong>TIDAK AKAN dicetak pada kad ID</strong> demi keselamatan.
            </p>
          </div>

          {/* Gambar Murid (Pilihan) */}
          <div className="p-3.5 rounded-xl bg-[#060b17] border border-cyan-500/30">
            <label className="block text-xs font-mono-code text-cyan-300 uppercase mb-2 font-semibold flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-cyan-400" />
              Gambar Murid / Foto Pasport (Pilihan)
            </label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-14 rounded-lg bg-black/60 border border-cyan-400/50 flex items-center justify-center overflow-hidden shrink-0 shadow">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Foto Murid" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-5 h-5 text-cyan-400/60" />
                )}
              </div>
              <div className="flex-1 flex flex-wrap items-center gap-2">
                <input
                  type="file"
                  id="admin-student-photo"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        if (ev.target?.result) {
                          setAvatarUrl(ev.target.result as string);
                          playCyberSound('click');
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="admin-student-photo"
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 hover:text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors shadow"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{avatarUrl ? 'Tukar Foto' : 'Muat Naik Foto Pasport'}</span>
                </label>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarUrl(undefined);
                      playCyberSound('click');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Buang Foto</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-cyan-500/20">
            <button
              type="button"
              onClick={() => {
                playCyberSound('click');
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/25"
            >
              <Save className="w-4 h-4" />
              {isEditing ? 'Simpan Kemaskini' : 'Tambah Murid'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

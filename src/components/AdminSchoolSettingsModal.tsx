import React, { useState, useRef } from 'react';
import { SchoolSettings } from '../types/student';
import { PRESET_LOGOS } from '../utils/defaultData';
import { playCyberSound } from '../utils/audio';
import {
  X,
  School,
  Save,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  KeyRound,
  Sparkles
} from 'lucide-react';

interface AdminSchoolSettingsModalProps {
  settings: SchoolSettings;
  onSave: (newSettings: SchoolSettings) => void;
  onClose: () => void;
}

export const AdminSchoolSettingsModal: React.FC<AdminSchoolSettingsModalProps> = ({
  settings,
  onSave,
  onClose,
}) => {
  const [form, setForm] = useState<SchoolSettings>({ ...settings });
  const [logoPreview, setLogoPreview] = useState<string>(settings.schoolLogo);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Sila pilih fail imej (PNG, JPG, atau SVG).');
      return;
    }

    // Limit size to 1.5MB for localStorage safety
    if (file.size > 1.5 * 1024 * 1024) {
      alert('Saiz imej logo mestilah di bawah 1.5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setLogoPreview(dataUrl);
        setForm((prev) => ({ ...prev, schoolLogo: dataUrl }));
        playCyberSound('success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (presetData: string) => {
    playCyberSound('click');
    setLogoPreview(presetData);
    setForm((prev) => ({ ...prev, schoolLogo: presetData }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      schoolLogo: logoPreview,
    });
    playCyberSound('success');
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#091122] border border-cyan-500/50 rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-100 cyber-border-glow my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-orbitron text-cyan-300">
                TETAPAN SEKOLAH & LOGO
              </h3>
              <p className="text-xs text-slate-400 font-mono-code">
                Sesuaikan nama sekolah, logo pada kad murid, dan maklumat rasmi
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

        {saveSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Tetapan dan logo sekolah berjaya disimpan!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* LOGO SEKOLAH SECTION */}
          <div className="p-4 rounded-xl bg-[#050c19] border border-cyan-500/30">
            <label className="block text-xs font-mono-code text-cyan-400 uppercase font-bold mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              LOGO SEKOLAH (DIPAPARKAN PADA KAD ID DELIMa)
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Logo Preview Box */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-2xl bg-black/60 border-2 border-cyan-400/60 p-2 flex items-center justify-center shadow-xl overflow-hidden">
                  <img
                    src={logoPreview}
                    alt="Logo Sekolah Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-[10px] text-center font-mono-code text-cyan-400 mt-1">
                  Pratonton Logo
                </div>
              </div>

              {/* Upload & Presets */}
              <div className="flex-1 space-y-3 w-full">
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      playCyberSound('click');
                      fileInputRef.current?.click();
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/50 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Muat Naik Logo Rasmi Sekolah (PNG / JPG / SVG)</span>
                  </button>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Cadangan: Imej berlatar lutsinar (transparent PNG) untuk hasil cetakan kad yang terbaik.
                  </p>
                </div>

                {/* Preset Options */}
                <div>
                  <div className="text-[10px] font-mono-code text-slate-400 uppercase mb-1">
                    Atau Pilih Logo Pratetap:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_LOGOS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset.data)}
                        className={`p-1.5 rounded-lg border text-left flex items-center gap-1.5 transition-all ${
                          logoPreview === preset.data
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                            : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-400'
                        }`}
                      >
                        <div className="w-5 h-5 rounded overflow-hidden shrink-0">
                          <img src={preset.data} alt={preset.name} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-[9px] font-mono-code truncate">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SCHOOL NAME & CODE */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono-code text-cyan-300 uppercase mb-1 font-semibold">
                Nama Penuh Sekolah *
              </label>
              <input
                type="text"
                value={form.schoolName}
                onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                placeholder="SMK CYBER SIBER JAYA"
                className="w-full px-3 py-2 rounded-xl bg-[#060b17] border border-cyan-500/30 text-white text-sm focus:border-cyan-400 focus:outline-none uppercase"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono-code text-cyan-300 uppercase mb-1 font-semibold">
                Kod Sekolah *
              </label>
              <input
                type="text"
                value={form.schoolCode}
                onChange={(e) => setForm({ ...form, schoolCode: e.target.value.toUpperCase() })}
                placeholder="BEA8653"
                className="w-full px-3 py-2 rounded-xl bg-[#060b17] border border-cyan-500/30 text-white font-mono-code text-sm focus:border-cyan-400 focus:outline-none uppercase"
                required
              />
            </div>
          </div>

          {/* MOTTO & SESSION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono-code text-cyan-300 uppercase mb-1 font-semibold">
                Slogan / Moto Sekolah
              </label>
              <input
                type="text"
                value={form.schoolMotto}
                onChange={(e) => setForm({ ...form, schoolMotto: e.target.value })}
                placeholder="Menerajui Inovasi Digital Pendidikan"
                className="w-full px-3 py-2 rounded-xl bg-[#060b17] border border-cyan-500/30 text-white text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono-code text-cyan-300 uppercase mb-1 font-semibold">
                Sesi Persekolahan
              </label>
              <input
                type="text"
                value={form.academicSession}
                onChange={(e) => setForm({ ...form, academicSession: e.target.value })}
                placeholder="2025/2026"
                className="w-full px-3 py-2 rounded-xl bg-[#060b17] border border-cyan-500/30 text-white font-mono-code text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* CONTACT & ADMIN PIN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono-code text-cyan-300 uppercase mb-1 font-semibold">
                Nama Guru Penyelaras ICT / DELIMa
              </label>
              <input
                type="text"
                value={form.coordinatorName}
                onChange={(e) => setForm({ ...form, coordinatorName: e.target.value })}
                placeholder="Cikgu Noraini binti Mohd Salleh"
                className="w-full px-3 py-2 rounded-xl bg-[#060b17] border border-cyan-500/30 text-white text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono-code text-cyan-300 uppercase mb-1 font-semibold">
                Talian Bantuan ICT / Telefon Sekolah
              </label>
              <input
                type="text"
                value={form.helpdeskContact}
                onChange={(e) => setForm({ ...form, helpdeskContact: e.target.value })}
                placeholder="019-876 5432"
                className="w-full px-3 py-2 rounded-xl bg-[#060b17] border border-cyan-500/30 text-white font-mono-code text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* ADMIN PIN */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <label className="text-xs font-mono-code text-amber-300 uppercase font-semibold">
                Kata Laluan PIN Pentadbir (Admin PIN)
              </label>
            </div>
            <input
              type="text"
              value={form.adminPin}
              onChange={(e) => setForm({ ...form, adminPin: e.target.value })}
              placeholder="admin123"
              className="w-full sm:w-60 px-3 py-1.5 rounded-lg bg-[#060b17] border border-slate-600 text-white font-mono-code text-xs focus:border-cyan-400 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 ml-2">
              (Gunakan PIN ini untuk log masuk ke mod Pentadbir)
            </span>
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
              Simpan Tetapan & Logo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

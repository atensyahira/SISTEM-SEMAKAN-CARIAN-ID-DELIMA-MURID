import React, { useState, useRef } from 'react';
import { SchoolSettings, Student } from '../types/student';
import { DelimaCardPreview } from './DelimaCardPreview';
import { Printer, X, ShieldAlert, Sparkles, RotateCw, Layers, Camera, Upload, Trash2 } from 'lucide-react';
import { playCyberSound } from '../utils/audio';
import { updateStudent, markStudentCardGenerated } from '../utils/storage';

interface DelimaCardModalProps {
  student: Student;
  schoolSettings: SchoolSettings;
  onClose: () => void;
}

export const DelimaCardModal: React.FC<DelimaCardModalProps> = ({
  student,
  schoolSettings,
  onClose,
}) => {
  const [showBackSide, setShowBackSide] = useState<boolean>(false);
  const [dualPrintMode, setDualPrintMode] = useState<boolean>(true); // Print both front & back on 1 page
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(student.avatarUrl || null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Automatically mark student as having generated their DELIMa card
  React.useEffect(() => {
    markStudentCardGenerated(student.id);
  }, [student.id]);

  const handlePrint = () => {
    playCyberSound('click');
    markStudentCardGenerated(student.id);
    window.print();
  };

  const handleFlip = () => {
    playCyberSound('click');
    setShowBackSide(!showBackSide);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Sila pilih fail imej (PNG, JPG, atau WEBP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Saiz fail imej terlalu besar (maksimum 2MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setUploadedPhoto(dataUrl);
        playCyberSound('success');
        updateStudent({
          ...student,
          avatarUrl: dataUrl,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    playCyberSound('click');
    setUploadedPhoto(null);
    updateStudent({
      ...student,
      avatarUrl: undefined,
    });
  };

  return (
    <>
      {/* SCREEN MODAL VIEW (hidden during @media print) */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md no-print animate-fade-in overflow-y-auto">
        <div className="relative w-full max-w-2xl bg-[#09101d] border border-cyan-500/50 rounded-2xl shadow-2xl p-4 sm:p-6 text-slate-100 cyber-border-glow my-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/40 text-cyan-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-orbitron tracking-wider text-cyan-300">
                  JANA KAD DIGITAL ID DELIMa
                </h3>
                <p className="text-xs text-slate-400 font-mono-code">
                  Pratonton & Percetakan Kad Rasmi Murid
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                playCyberSound('click');
                onClose();
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Privacy Security Notice Alert */}
          <div className="mb-3.5 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">Perlindungan Keselamatan Akaun Murid:</span> Sesuai dengan arahan keselamatan,{' '}
              <span className="text-white font-semibold underline">hanya ID DELIMa sahaja yang dicetak pada kad</span>. Kata laluan (password) tidak dicetak demi mengelakkan pencerobohan akaun.
            </div>
          </div>

          {/* Photo Upload Section for Parents (Ibu Bapa Boleh Masukkan Gambar Anak) */}
          <div className="mb-4 p-3 sm:p-3.5 rounded-xl bg-[#071326] border border-cyan-500/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-13 rounded-lg bg-black/60 border border-cyan-400/50 flex items-center justify-center overflow-hidden shrink-0 shadow">
                  {uploadedPhoto ? (
                    <img src={uploadedPhoto} alt="Foto Anak" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-5 h-5 text-cyan-400/70" />
                  )}
                </div>
                {uploadedPhoto && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-black" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-cyan-300 font-mono-code flex items-center gap-1.5 uppercase">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Foto Anak (Pilihan Ibu Bapa)</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  Ibu ayah boleh masukkan gambar anak jika mahu untuk dipaparkan dan dicetak pada Kad ID ini.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <input
                type="file"
                ref={photoInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => {
                  playCyberSound('click');
                  photoInputRef.current?.click();
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadedPhoto ? 'Tukar Foto' : 'Muat Naik Foto Anak'}</span>
              </button>
              {uploadedPhoto && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Padam gambar dan guna ikon avatar biasa"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Buang Foto</span>
                </button>
              )}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 px-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleFlip}
                className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow"
              >
                <RotateCw className="w-3.5 h-3.5" />
                {showBackSide ? 'Papar Muka Depan' : 'Papar Muka Belakang'}
              </button>

              <button
                type="button"
                onClick={() => setDualPrintMode(!dualPrintMode)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all shadow ${
                  dualPrintMode
                    ? 'bg-blue-600/30 border-blue-400 text-blue-200'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                {dualPrintMode ? 'Cetak Kedua-Dua Sisi (A4)' : 'Cetak Satu Sisi Sahaja'}
              </button>
            </div>

            <span className="text-[11px] font-mono-code text-cyan-400/80">
              {showBackSide ? 'SISI BELAKANG' : 'SISI HADAPAN'}
            </span>
          </div>

          {/* Card Preview Interactive Stage */}
          <div className="py-4 sm:py-6 px-2 flex justify-center bg-[#050811] rounded-xl border border-cyan-900/60 shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
            <DelimaCardPreview
              student={student}
              schoolSettings={schoolSettings}
              showBackSide={showBackSide}
              photoUrl={uploadedPhoto || undefined}
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="text-xs text-slate-400 text-center sm:text-left">
              Boleh dicetak pada kertas A4, photo paper, atau laminated badge kad murid.
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => {
                  playCyberSound('click');
                  onClose();
                }}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700"
              >
                Batal
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02]"
              >
                <Printer className="w-4 h-4" />
                Cetak Kad Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PRINT-ONLY CONTAINER (active when window.print() is called) */}
      <div className="hidden print-only-area">
        <div className="p-8 text-black bg-white flex flex-col items-center justify-center min-h-screen">
          <div className="text-center mb-6">
            <h1 className="text-lg font-bold uppercase tracking-wider text-slate-900">
              KAD IDENTITI DIGITAL ID DELIMa
            </h1>
            <p className="text-xs text-slate-600 font-mono">
              {schoolSettings.schoolName} ({schoolSettings.schoolCode}) • SESI {schoolSettings.academicSession}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              * Gunting mengikut garisan putus-putus dan laminat untuk dijadikan kad identiti murid.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 items-center justify-center">
            {/* Front Card */}
            <div className="border border-dashed border-slate-400 p-2 rounded-2xl">
              <DelimaCardPreview
                student={student}
                schoolSettings={schoolSettings}
                showBackSide={false}
                photoUrl={uploadedPhoto || undefined}
              />
              <div className="text-center text-[10px] font-mono text-slate-500 mt-1">
                [ MUKA DEPAN ]
              </div>
            </div>

            {/* Back Card if dual mode */}
            {dualPrintMode && (
              <div className="border border-dashed border-slate-400 p-2 rounded-2xl">
                <DelimaCardPreview
                  student={student}
                  schoolSettings={schoolSettings}
                  showBackSide={true}
                />
                <div className="text-center text-[10px] font-mono text-slate-500 mt-1">
                  [ MUKA BELAKANG ]
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 text-center text-[9px] text-slate-400 max-w-md border-t pt-2">
            Inisiatif Pembelajaran Digital Malaysia (DELIMa) • Kementerian Pendidikan Malaysia
            <br />
            ID DELIMa: <strong>{student.delimaId}</strong> (Kata laluan dirahsiakan untuk perlindungan akaun)
          </div>
        </div>
      </div>
    </>
  );
};

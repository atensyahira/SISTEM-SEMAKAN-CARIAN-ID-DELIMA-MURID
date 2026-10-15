import React, { useState, useRef } from 'react';
import { Student } from '../types/student';
import { generateCsvTemplate, downloadFile, parseStudentsCsv } from '../utils/csvHelper';
import { playCyberSound } from '../utils/audio';
import {
  X,
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

interface AdminCsvImportModalProps {
  onImport: (newStudents: Omit<Student, 'id' | 'createdAt'>[], mode: 'append' | 'replace') => void;
  onClose: () => void;
}

export const AdminCsvImportModal: React.FC<AdminCsvImportModalProps> = ({
  onImport,
  onClose,
}) => {
  const [parsedData, setParsedData] = useState<Omit<Student, 'id' | 'createdAt'>[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    playCyberSound('click');
    const templateContent = generateCsvTemplate();
    downloadFile(templateContent, 'template_murid_delima.csv');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const { validStudents, errors } = parseStudentsCsv(text);
        setParsedData(validStudents);
        setParseErrors(errors);
        if (validStudents.length > 0) {
          playCyberSound('success');
        } else {
          playCyberSound('error');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = () => {
    if (parsedData.length === 0) return;
    playCyberSound('success');
    onImport(parsedData, importMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#091122] border border-cyan-500/50 rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-100 cyber-border-glow my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-orbitron text-cyan-300">
                IMPORT REKOD MURID (CSV)
              </h3>
              <p className="text-xs text-slate-400 font-mono-code">
                Muat naik senarai murid dari fail Excel / CSV secara pukal
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

        {/* Step 1: Download Template */}
        <div className="mb-4 p-4 rounded-xl bg-[#060c18] border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-cyan-300 font-mono-code uppercase">
              Langkah 1: Muat Turun Format Templat CSV
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Gunakan templat rasmi untuk mengisi No KP, Nama, Kelas, ID DELIMa, dan Password.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-semibold flex items-center gap-2 shrink-0 transition-colors shadow"
          >
            <Download className="w-4 h-4" />
            <span>Muat Turun Templat CSV</span>
          </button>
        </div>

        {/* Step 2: Upload CSV */}
        <div className="mb-4 p-4 rounded-xl bg-[#060c18] border border-cyan-500/30">
          <div className="text-xs font-bold text-cyan-300 font-mono-code uppercase mb-2">
            Langkah 2: Pilih Fail CSV Sekolah Anda
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv,text/csv"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-xl p-6 text-center cursor-pointer transition-all hover:bg-cyan-500/5 group"
          >
            <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs text-white font-semibold">
              {fileName ? fileName : 'Klik di sini untuk memilih fail CSV dari komputer anda'}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Menyokong fail .csv dengan pemisah koma (comma delimited)
            </div>
          </div>
        </div>

        {/* Errors if any */}
        {parseErrors.length > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs">
            <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-300">
              <AlertTriangle className="w-4 h-4" />
              <span>Amaran / Ralat Semakan CSV ({parseErrors.length}):</span>
            </div>
            <div className="max-h-24 overflow-y-auto space-y-1 font-mono-code text-[10px]">
              {parseErrors.slice(0, 5).map((err, idx) => (
                <div key={idx}>• {err}</div>
              ))}
              {parseErrors.length > 5 && (
                <div>...dan {parseErrors.length - 5} baris ralat lagi.</div>
              )}
            </div>
          </div>
        )}

        {/* Preview parsed data */}
        {parsedData.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono-code">
                <CheckCircle className="w-4 h-4" />
                <span>{parsedData.length} REKOD SAH DIJUMPAI UNTUK DIIMPORT</span>
              </div>
              <div className="text-[11px] font-mono-code text-slate-400">
                Pratonton baris terawal:
              </div>
            </div>

            <div className="max-h-36 overflow-y-auto rounded-xl border border-cyan-500/20 bg-[#040812] text-xs">
              <table className="w-full text-left font-mono-code text-[11px]">
                <thead className="bg-slate-900 text-cyan-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2">No. KP</th>
                    <th className="p-2">Nama Murid</th>
                    <th className="p-2">Kelas</th>
                    <th className="p-2">ID DELIMa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {parsedData.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className="hover:bg-cyan-500/5">
                      <td className="p-2 text-cyan-300">{row.ic}</td>
                      <td className="p-2 text-white font-medium">{row.name}</td>
                      <td className="p-2 text-emerald-300">{row.className}</td>
                      <td className="p-2 text-slate-400 truncate max-w-[150px]">{row.delimaId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Import Mode Radio */}
            <div className="mt-3 p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Mod Kemasukan Data:</span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="importMode"
                    checked={importMode === 'append'}
                    onChange={() => setImportMode('append')}
                    className="accent-cyan-400"
                  />
                  <span>Tambah ke senarai sedia ada</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-amber-300">
                  <input
                    type="radio"
                    name="importMode"
                    checked={importMode === 'replace'}
                    onChange={() => setImportMode('replace')}
                    className="accent-cyan-400"
                  />
                  <span>Ganti semua rekod sedia ada</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
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
            type="button"
            disabled={parsedData.length === 0}
            onClick={handleExecuteImport}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/25"
          >
            <span>Sahkan Import ({parsedData.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

import { Student } from '../types/student';
import { normalizeIC } from './storage';

export function generateCsvTemplate(): string {
  const headers = ['NO_KAD_PENGENALAN', 'NAMA_MURID', 'KELAS', 'ID_DELIMA', 'KATA_LALUAN', 'JANTINA', 'TINGKATAN'];
  const sampleRows = [
    ['090514015678', 'MUHAMMAD AMIRUL AIMAN BIN HAKIM', '5 IBNU SINA', 'm-10293841@moe-dl.edu.my', 'Amirul@2025#', 'L', 'Tingkatan 5'],
    ['091122106782', 'NUR AINA SOFEA BINTI ZULKIFLI', '5 IBNU SINA', 'm-10293842@moe-dl.edu.my', 'Sofea#DELIMa99', 'P', 'Tingkatan 5'],
    ['100415147890', 'DIVYA DARSHINI A/P SARAVANAN', '4 AL-FARABI', 'm-10384751@moe-dl.edu.my', 'Divya#Pass2025', 'P', 'Tingkatan 4'],
  ];

  const content = [headers.join(','), ...sampleRows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(','))].join('\n');
  return content;
}

export function downloadFile(content: string, filename: string, mimeType: string = 'text/csv;charset=utf-8;'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportStudentsToCsv(students: Student[], schoolName: string = 'DELIMa'): void {
  const headers = ['NO_KAD_PENGENALAN', 'NAMA_MURID', 'KELAS', 'ID_DELIMA', 'KATA_LALUAN', 'JANTINA', 'TINGKATAN', 'STATUS'];
  const rows = students.map((s) => [
    s.ic,
    s.name,
    s.className,
    s.delimaId,
    s.password,
    s.gender || 'L',
    s.yearLevel || '',
    s.status || 'Aktif',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  const cleanSchool = schoolName.replace(/[^a-zA-Z0-9]/g, '_');
  downloadFile(csvContent, `senarai_murid_delima_${cleanSchool}_${new Date().toISOString().split('T')[0]}.csv`);
}

export interface ParseResult {
  validStudents: Omit<Student, 'id' | 'createdAt'>[];
  errors: string[];
}

export function parseStudentsCsv(csvText: string): ParseResult {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    return { validStudents: [], errors: ['Fail CSV kosong atau tiada baris data rekod murid.'] };
  }

  // Parse header
  const rawHeaders = splitCsvRow(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  
  // Find column indices with precise matching (avoid 'id' matching 'murid')
  const icIdx = rawHeaders.findIndex((h) => h.includes('kad') || h.includes('kp') || h.includes('ic') || h.includes('nokp'));
  const nameIdx = rawHeaders.findIndex((h) => h.includes('nama') || h.includes('name'));
  const classIdx = rawHeaders.findIndex((h) => h.includes('kelas') || h.includes('class') || (h.includes('tingkatan') && !h.includes('tahap')) || h.includes('darjah'));
  const delimaIdx = rawHeaders.findIndex((h) => 
    h.includes('delima') || 
    h.includes('email') || 
    h.includes('emel') || 
    h === 'id' || 
    h === 'iddelima' || 
    (h.includes('id') && !h.includes('murid') && !h.includes('kad'))
  );
  const passIdx = rawHeaders.findIndex((h) => h.includes('pass') || h.includes('laluan') || h.includes('katalaluan') || h.includes('pwd'));
  const genderIdx = rawHeaders.findIndex((h) => h.includes('jantina') || h.includes('gender'));
  const yearIdx = rawHeaders.findIndex((h) => h.includes('tingkatan') || h.includes('tahun') || h.includes('level') || h.includes('year'));

  if (icIdx === -1 || nameIdx === -1 || delimaIdx === -1) {
    return {
      validStudents: [],
      errors: [
        'Lajur wajib tidak dijumpai dalam baris pertama CSV. Pastikan ada: NO_KAD_PENGENALAN, NAMA_MURID, ID_DELIMA (dan KELAS, KATA_LALUAN).',
      ],
    };
  }

  const validStudents: Omit<Student, 'id' | 'createdAt'>[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = splitCsvRow(lines[i]);
    if (row.length === 0 || row.every((c) => !c.trim())) continue;

    const rawIc = row[icIdx] || '';
    const name = (row[nameIdx] || '').trim();
    const className = (classIdx !== -1 && row[classIdx] ? row[classIdx].trim() : 'UMUM') || 'UMUM';
    const delimaId = (row[delimaIdx] || '').trim();
    const password = passIdx !== -1 && row[passIdx] ? row[passIdx].trim() : 'Delima@123';
    const gender = genderIdx !== -1 && row[genderIdx]?.toUpperCase().startsWith('P') ? 'P' : 'L';
    const yearLevel = yearIdx !== -1 && row[yearIdx] ? row[yearIdx].trim() : undefined;

    const cleanIc = normalizeIC(rawIc);

    if (!cleanIc || cleanIc.length < 6) {
      errors.push(`Baris ${i + 1}: No KP "${rawIc}" tidak sah.`);
      continue;
    }
    if (!name) {
      errors.push(`Baris ${i + 1}: Nama murid kosong.`);
      continue;
    }
    if (!delimaId.includes('@')) {
      errors.push(`Baris ${i + 1}: ID DELIMa "${delimaId}" tidak sah format emel.`);
      continue;
    }

    validStudents.push({
      ic: cleanIc,
      name: name.toUpperCase(),
      className: className.toUpperCase(),
      delimaId: delimaId.toLowerCase(),
      password: password,
      gender,
      yearLevel: yearLevel || undefined,
      status: 'Aktif',
    });
  }

  return { validStudents, errors };
}

function splitCsvRow(rowStr: string): string[] {
  const result: string[] = [];
  let inQuotes = false;
  let current = '';

  for (let i = 0; i < rowStr.length; i++) {
    const char = rowStr[i];
    if (char === '"' || char === "'") {
      if (inQuotes && rowStr[i + 1] === char) {
        current += char;
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

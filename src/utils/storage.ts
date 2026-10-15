import { SchoolSettings, Student } from '../types/student';
import { DEFAULT_SCHOOL_SETTINGS, INITIAL_STUDENTS } from './defaultData';

const STUDENTS_KEY = 'delima_cyber_students_v1';
const SETTINGS_KEY = 'delima_cyber_school_settings_v1';

export function normalizeIC(input: string): string {
  if (!input) return '';
  return input.replace(/[^0-9]/g, '').trim();
}

export function formatIC(raw: string): string {
  const clean = normalizeIC(raw);
  if (clean.length === 12) {
    return `${clean.slice(0, 6)}-${clean.slice(6, 8)}-${clean.slice(8, 12)}`;
  }
  return raw;
}

export function getStudents(): Student[] {
  if (typeof window === 'undefined') return INITIAL_STUDENTS;
  try {
    const raw = localStorage.getItem(STUDENTS_KEY);
    if (!raw) {
      localStorage.setItem(STUDENTS_KEY, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(INITIAL_STUDENTS));
    return INITIAL_STUDENTS;
  } catch (err) {
    console.error('Error reading students from storage', err);
    return INITIAL_STUDENTS;
  }
}

export function saveStudents(students: Student[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
    window.dispatchEvent(new Event('delima_students_updated'));
  } catch (err) {
    console.error('Error saving students to storage', err);
  }
}

export function getSchoolSettings(): SchoolSettings {
  if (typeof window === 'undefined') return DEFAULT_SCHOOL_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SCHOOL_SETTINGS));
      return DEFAULT_SCHOOL_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    // Auto upgrade legacy d2 link to requested d3 landing link
    if (!parsed.delimaPortalUrl || parsed.delimaPortalUrl.includes('d2.delima.edu.my')) {
      parsed.delimaPortalUrl = 'https://d3.delima.edu.my/landing';
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
    }
    return { ...DEFAULT_SCHOOL_SETTINGS, ...parsed };
  } catch (err) {
    console.error('Error reading school settings', err);
    return DEFAULT_SCHOOL_SETTINGS;
  }
}

export function saveSchoolSettings(settings: SchoolSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('delima_settings_updated'));
  } catch (err) {
    console.error('Error saving school settings', err);
  }
}

export function findStudentByIC(searchIC: string): Student | null {
  const cleanSearch = normalizeIC(searchIC);
  if (!cleanSearch) return null;

  const students = getStudents();
  return students.find((s) => normalizeIC(s.ic) === cleanSearch) || null;
}

export function addStudent(newStudent: Omit<Student, 'id' | 'createdAt'>): Student {
  const students = getStudents();
  const student: Student = {
    ...newStudent,
    id: 'stu-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    createdAt: new Date().toISOString().split('T')[0],
  };
  const updated = [student, ...students];
  saveStudents(updated);
  return student;
}

export function updateStudent(updated: Student): void {
  const students = getStudents();
  const next = students.map((s) => (s.id === updated.id ? updated : s));
  saveStudents(next);
}

export function markStudentCardGenerated(id: string): void {
  const students = getStudents();
  const next = students.map((s) =>
    s.id === id
      ? {
          ...s,
          hasGeneratedCard: true,
          lastGeneratedAt: new Date().toISOString(),
        }
      : s
  );
  saveStudents(next);
}

export function deleteStudent(id: string): void {
  const students = getStudents();
  const next = students.filter((s) => s.id !== id);
  saveStudents(next);
}

export function resetToDefaultData(): void {
  saveStudents(INITIAL_STUDENTS);
  saveSchoolSettings(DEFAULT_SCHOOL_SETTINGS);
}

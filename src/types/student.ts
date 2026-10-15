export interface Student {
  id: string;
  ic: string; // 12-digit format e.g. 090514015678
  name: string; // e.g. MUHAMMAD AMIRUL BIN HAKIM
  className: string; // e.g. 5 IBNU SINA
  delimaId: string; // e.g. m-12345678@moe-dl.edu.my
  password: string; // e.g. Amirul@2025 (HANYA UNTUK CARIAN, TIDAK DICETAK PADA KAD)
  gender?: 'L' | 'P';
  yearLevel?: string; // e.g. Tahun 6, Tahun 5
  status?: 'Aktif' | 'Digantung' | 'Pindah';
  avatarUrl?: string;
  hasGeneratedCard?: boolean;
  lastGeneratedAt?: string;
  createdAt?: string;
}

export interface SchoolSettings {
  schoolName: string;
  schoolCode: string;
  schoolLogo: string; // Data URL or SVG string
  schoolMotto: string;
  academicSession: string;
  adminPin: string;
  delimaPortalUrl: string;
  helpdeskContact: string;
  coordinatorName: string;
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeIC, formatIC } from '../src/utils/storage';
import { parseStudentsCsv, generateCsvTemplate } from '../src/utils/csvHelper';

test('normalizeIC should extract only digits and trim whitespace', () => {
  assert.equal(normalizeIC('090514-01-5678'), '090514015678');
  assert.equal(normalizeIC('  090514 01 5678  '), '090514015678');
  assert.equal(normalizeIC(''), '');
});

test('formatIC should format 12 digit IC into 6-2-4 pattern', () => {
  assert.equal(formatIC('090514015678'), '090514-01-5678');
  assert.equal(formatIC('090514-01-5678'), '090514-01-5678');
});

test('generateCsvTemplate should include proper headers and sample rows', () => {
  const template = generateCsvTemplate();
  assert.ok(template.includes('NO_KAD_PENGENALAN'));
  assert.ok(template.includes('NAMA_MURID'));
  assert.ok(template.includes('ID_DELIMA'));
  assert.ok(template.includes('KATA_LALUAN'));
});

test('parseStudentsCsv should parse valid CSV rows and flag invalid rows', () => {
  const csvData = `NO_KAD_PENGENALAN,NAMA_MURID,KELAS,ID_DELIMA,KATA_LALUAN
090514015678,MUHAMMAD AMIRUL,5 IBNU SINA,m-10293841@moe-dl.edu.my,Pass123
100415147890,NUR AINA,4 AL-FARABI,m-10384751@moe-dl.edu.my,Aina@456
invalid-ic,BAD STUDENT,4 AL-FARABI,m-bad@moe-dl.edu.my,Pass`;

  const result = parseStudentsCsv(csvData);
  assert.equal(result.validStudents.length, 2);
  assert.equal(result.validStudents[0].name, 'MUHAMMAD AMIRUL');
  assert.equal(result.validStudents[0].ic, '090514015678');
  assert.equal(result.validStudents[0].delimaId, 'm-10293841@moe-dl.edu.my');
  assert.equal(result.validStudents[0].password, 'Pass123');
  assert.equal(result.errors.length, 1);
});

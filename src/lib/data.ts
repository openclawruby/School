import fs from 'fs';
import path from 'path';
import type { School, SchoolsData } from '@/types/school';

const dataPath = path.join(process.cwd(), 'data', 'schools.json');

export function getAllSchools(): School[] {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const data: SchoolsData = JSON.parse(raw);
  return data.schools.sort((a, b) => {
    // Push nulls/undefined to the bottom; rank ascending by ranking_2026
    const ar = a.ranking_2026 ?? 9999;
    const br = b.ranking_2026 ?? 9999;
    if (ar !== br) return ar - br;
    return (a.name_zh || '').localeCompare(b.name_zh || '');
  });
}

export function getSchoolById(id: string): School | undefined {
  return getAllSchools().find(s => s.id === id);
}

export function getTimelineEvents() {
  const schools = getAllSchools();
  type Event = {
    school_id: string;
    school_name: string;
    school_name_zh: string;
    type: '申請開始' | '申請截止' | '面試' | '結果公佈';
    date: string;
    school_type: string;
  };
  const events: Event[] = [];

  for (const s of schools) {
    if (s.application_open_date) {
      events.push({ school_id: s.id, school_name: s.name_en, school_name_zh: s.name_zh, type: '申請開始', date: s.application_open_date, school_type: s.type });
    }
    if (s.application_deadline) {
      events.push({ school_id: s.id, school_name: s.name_en, school_name_zh: s.name_zh, type: '申請截止', date: s.application_deadline, school_type: s.type });
    }
    for (const d of s.interview_dates || []) {
      events.push({ school_id: s.id, school_name: s.name_en, school_name_zh: s.name_zh, type: '面試', date: d, school_type: s.type });
    }
  }
  return events.sort((a, b) => a.date.localeCompare(b.date));
}
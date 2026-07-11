'use client';
import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import SchoolCard from '@/components/SchoolCard';
import type { School } from '@/types/school';

export default function SchoolsClient({ schools }: { schools: School[] }) {
  const params = useSearchParams();
  const [search, setSearch] = useState('');
  const [type, setType] = useState<string>(params.get('type') || 'all');
  const [gender, setGender] = useState('all');
  const [district, setDistrict] = useState('all');

  const districts = useMemo(() => Array.from(new Set(schools.map(s => s.district))).sort(), [schools]);

  const filtered = useMemo(() => {
    return schools.filter(s => {
      if (search && !s.name_zh.includes(search) && !s.name_en.toLowerCase().includes(search.toLowerCase())) return false;
      if (type !== 'all') {
        const types = type.split(',');
        if (!types.includes(s.type)) return false;
      }
      if (gender !== 'all' && s.gender !== gender) return false;
      if (district !== 'all' && s.district !== district) return false;
      return true;
    });
  }, [schools, search, type, gender, district]);

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h1 className="text-2xl font-bold mb-4">🏫 香港中學一覽</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋中英文校名..." className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          <select value={type} onChange={e => setType(e.target.value)} className="border rounded-lg px-3 py-2 text-sm bg-white">
            <option value="all">全部類型</option>
            <option value="DSS">直資</option>
            <option value="Private">私立</option>
            <option value="Aided">津貼</option>
            <option value="Government">官立</option>
            <option value="DSS,Private">直資+私立</option>
            <option value="Aided,Government">官津</option>
          </select>
          <select value={gender} onChange={e => setGender(e.target.value)} className="border rounded-lg px-3 py-2 text-sm bg-white">
            <option value="all">全部性別</option>
            <option value="Boys">男校</option>
            <option value="Girls">女校</option>
            <option value="Co-ed">男女校</option>
          </select>
          <select value={district} onChange={e => setDistrict(e.target.value)} className="border rounded-lg px-3 py-2 text-sm bg-white">
            <option value="all">全部地區</option>
            {districts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="mt-3 text-sm text-gray-600">顯示 {filtered.length} / {schools.length} 間學校</div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">沒有符合條件的學校，試試其他篩選。</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s => <SchoolCard key={s.id} school={s} />)}
        </div>
      )}
    </div>
  );
}
'use client';
import Link from 'next/link';
import type { School } from '@/types/school';

const typeColors: Record<string, string> = {
  DSS: 'bg-purple-100 text-purple-700',
  Private: 'bg-pink-100 text-pink-700',
  Government: 'bg-blue-100 text-blue-700',
  Aided: 'bg-green-100 text-green-700',
  International: 'bg-orange-100 text-orange-700',
};

const typeLabels: Record<string, string> = {
  DSS: '直資', Private: '私立', Government: '官立', Aided: '津貼', International: '國際'
};

const genderColors: Record<string, string> = {
  Boys: 'bg-blue-50 text-blue-700', Girls: 'bg-pink-50 text-pink-700', 'Co-ed': 'bg-gray-100 text-gray-700'
};

export default function SchoolCard({ school }: { school: School }) {
  return (
    <Link href={`/schools/${school.id}`} className="card p-5 block group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-accent-600 bg-accent-50 px-2 py-0.5 rounded">#{school.ranking_2026}</span>
            <span className={`badge ${typeColors[school.type]}`}>{typeLabels[school.type]}</span>
            <span className={`badge ${genderColors[school.gender]}`}>{school.gender === 'Co-ed' ? '男女' : school.gender === 'Boys' ? '男校' : '女校'}</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-700 transition">{school.name_zh}</h3>
          <p className="text-sm text-gray-500">{school.name_en}</p>
        </div>
      </div>
      <div className="space-y-1.5 text-sm text-gray-600">
        <div className="flex items-center gap-2"><span>📍</span><span>{school.district}</span></div>
        <div className="flex items-center gap-2"><span>🎓</span><span>{school.medium_of_instruction}</span></div>
        {school.tuition_annual_hkd > 0 ? (
          <div className="flex items-center gap-2"><span>💰</span><span>HK$ {school.tuition_annual_hkd.toLocaleString()} /年</span></div>
        ) : (
          <div className="flex items-center gap-2"><span>💰</span><span className="text-green-600 font-medium">免費 (官津)</span></div>
        )}
        <div className="flex items-center gap-2"><span>📅</span><span className="text-red-600 font-medium">截止: {school.application_deadline}</span></div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {school.notable_features.slice(0, 3).map(f => (
          <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{f}</span>
        ))}
      </div>
    </Link>
  );
}
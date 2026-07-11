'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { School } from '@/types/school';

const typeLabels: Record<string, string> = { DSS:'直資', Private:'私立', Government:'官立', Aided:'津貼', International:'國際' };

export default function SchoolDetailClient({ school }: { school: School }) {
  const [applied, setApplied] = useState(false);
  const [interviewed, setInterviewed] = useState(false);
  const [offered, setOffered] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('school-tracker');
    if (saved) {
      const data = JSON.parse(saved);
      setApplied(!!data[school.id]?.applied);
      setInterviewed(!!data[school.id]?.interviewed);
      setOffered(!!data[school.id]?.offered);
    }
  }, [school.id]);

  const save = (key: string, value: boolean) => {
    const saved = JSON.parse(localStorage.getItem('school-tracker') || '{}');
    saved[school.id] = { ...(saved[school.id] || {}), [key]: value };
    localStorage.setItem('school-tracker', JSON.stringify(saved));
  };

  const toggle = (key: 'applied' | 'interviewed' | 'offered', current: boolean, setter: (v: boolean) => void) => {
    const next = !current;
    setter(next);
    save(key, next);
  };

  return (
    <div className="space-y-6">
      <Link href="/schools" className="text-primary-600 hover:underline text-sm">← 返回學校一覽</Link>

      <div className="card p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="badge bg-accent-50 text-accent-600 text-sm">#{school.ranking_2026} 全港排名</span>
          <span className="badge bg-purple-100 text-purple-700">{typeLabels[school.type]}</span>
          <span className="badge bg-gray-100 text-gray-700">{school.category}</span>
          <span className="badge bg-blue-50 text-blue-700">{school.gender === 'Co-ed' ? '男女校' : school.gender === 'Boys' ? '男校' : '女校'}</span>
          <span className="badge bg-green-50 text-green-700">{school.past_bands}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-2">{school.name_zh}</h1>
        <p className="text-lg text-gray-600 mb-4">{school.name_en}</p>
        <p className="text-gray-700 leading-relaxed">{school.website_summary}</p>
      </div>

      {/* 追蹤按鈕 */}
      <div className="card p-5">
        <h2 className="font-bold mb-3">📌 我的申請狀態</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { key: 'applied', label: '已報名', state: applied },
            { key: 'interviewed', label: '已面試', state: interviewed },
            { key: 'offered', label: '獲取錄', state: offered },
          ].map(({ key, label, state }) => (
            <button key={key} onClick={() => toggle(key as any, state, key === 'applied' ? setApplied : key === 'interviewed' ? setInterviewed : setOffered)}
              className={`px-4 py-2 rounded-lg font-medium border-2 transition ${
                state ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-700 hover:border-green-400'
              }`}>
              {state ? '✓' : '○'} {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 基本資料 */}
        <div className="card p-6">
          <h2 className="font-bold text-lg mb-4">📋 基本資料</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">地區</dt><dd className="font-medium">{school.district}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">宗教</dt><dd className="font-medium">{school.religion}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">教學語言</dt><dd className="font-medium">{school.medium_of_instruction}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">每年學費</dt><dd className="font-medium">{school.tuition_annual_hkd > 0 ? `HK$ ${school.tuition_annual_hkd.toLocaleString()}` : '免費 (官津)'}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">聯絡電話</dt><dd className="font-medium">{school.contact_phone || '-'}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">地址</dt><dd className="font-medium text-right max-w-[60%]">{school.address || '-'}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">官方網站</dt><dd><a href={school.application_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">{school.application_url || '-'}</a></dd></div>
          </dl>
        </div>

        {/* 入學資訊 */}
        <div className="card p-6">
          <h2 className="font-bold text-lg mb-4">📅 入學時間表</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">申請開放</dt><dd className="font-medium text-green-700">{school.application_open_date || '-'}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">申請截止</dt><dd className="font-medium text-red-700">{school.application_deadline || '-'}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">面試日期</dt><dd className="font-medium">{school.interview_dates?.length ? school.interview_dates.join(', ') : '-'}</dd></div>
            <div className="pt-2 border-t"><dt className="text-gray-500 mb-1">面試形式</dt><dd className="text-gray-700">{school.interview_format || '-'}</dd></div>
            <div className="pt-2 border-t"><dt className="text-gray-500 mb-1">收生準則</dt><dd className="text-gray-700">{school.admission_criteria || '-'}</dd></div>
            <div className="pt-2 border-t"><dt className="text-gray-500 mb-1">過往成績要求</dt><dd className="text-gray-700">{school.past_cutoff_score || '-'}</dd></div>
          </dl>
        </div>
      </div>

      {/* 特色 */}
      {school.notable_features?.length > 0 && (
        <div className="card p-6">
          <h2 className="font-bold text-lg mb-4">✨ 學校特色</h2>
          <div className="flex flex-wrap gap-2">
            {school.notable_features.map(f => (
              <span key={f} className="badge bg-primary-50 text-primary-700 text-sm">{f}</span>
            ))}
          </div>
        </div>
      )}

      {/* 排名依據 */}
      {school.ranking_note && (
        <div className="card p-6 bg-amber-50 border-amber-200">
          <h2 className="font-bold text-lg mb-2">📊 排名依據</h2>
          <p className="text-sm text-gray-700">{school.ranking_note}</p>
        </div>
      )}

      {school.school_fees_note && (
        <div className="card p-6 bg-blue-50 border-blue-200">
          <h2 className="font-bold text-lg mb-2">💡 學費備註</h2>
          <p className="text-sm text-gray-700">{school.school_fees_note}</p>
        </div>
      )}
    </div>
  );
}
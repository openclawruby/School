'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { School } from '@/types/school';

type TrackerEntry = { applied?: boolean; interviewed?: boolean; offered?: boolean };

export default function TrackerClient({ schools }: { schools: School[] }) {
  const [data, setData] = useState<Record<string, TrackerEntry>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('school-tracker') || '{}');
    setData(saved);
    setHydrated(true);
  }, []);

  const update = (schoolId: string, key: keyof TrackerEntry, value: boolean) => {
    const next = { ...data, [schoolId]: { ...(data[schoolId] || {}), [key]: value } };
    setData(next);
    localStorage.setItem('school-tracker', JSON.stringify(next));
  };

  const clear = () => {
    if (confirm('確定清除所有追蹤記錄？')) {
      localStorage.removeItem('school-tracker');
      setData({});
    }
  };

  const stats = {
    total: Object.keys(data).length,
    applied: Object.values(data).filter(d => d.applied).length,
    interviewed: Object.values(data).filter(d => d.interviewed).length,
    offered: Object.values(data).filter(d => d.offered).length,
  };

  if (!hydrated) return <div className="card p-12 text-center">載入中...</div>;

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold mb-1">📌 申請追蹤</h1>
            <p className="text-gray-600 text-sm">記錄每間學校的申請進度 (儲存在你的瀏覽器本地)</p>
          </div>
          {stats.total > 0 && <button onClick={clear} className="text-sm text-red-600 hover:underline">清除所有記錄</button>}
        </div>
        <div className="grid grid-cols-4 gap-3 mt-5">
          {[
            { label: '已追蹤', value: stats.total, color: 'bg-blue-50 text-blue-700' },
            { label: '已報名', value: stats.applied, color: 'bg-green-50 text-green-700' },
            { label: '已面試', value: stats.interviewed, color: 'bg-purple-50 text-purple-700' },
            { label: '獲取錄', value: stats.offered, color: 'bg-amber-50 text-amber-700' },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-xl p-4 text-center`}>
              <div className="text-2xl font-black">{s.value}</div>
              <div className="text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-600">
              <th className="p-3">學校</th>
              <th className="p-3 text-center">報名</th>
              <th className="p-3 text-center">面試</th>
              <th className="p-3 text-center">取錄</th>
              <th className="p-3">截止日</th>
            </tr>
          </thead>
          <tbody>
            {schools.map(s => {
              const e = data[s.id] || {};
              return (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <Link href={`/schools/${s.id}`} className="font-medium text-primary-700 hover:underline">{s.name_zh}</Link>
                    <div className="text-xs text-gray-500">{s.district}</div>
                  </td>
                  {(['applied','interviewed','offered'] as const).map(k => (
                    <td key={k} className="p-3 text-center">
                      <input type="checkbox" checked={!!e[k]} onChange={ev => update(s.id, k, ev.target.checked)} className="w-5 h-5 cursor-pointer accent-primary-600" />
                    </td>
                  ))}
                  <td className="p-3 text-red-600 font-medium">{s.application_deadline}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
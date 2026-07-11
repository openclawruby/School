import Link from 'next/link';
import { getAllSchools, getTimelineEvents } from '@/lib/data';
import SchoolCard from '@/components/SchoolCard';

export default function Home() {
  const schools = getAllSchools();
  const events = getTimelineEvents();
  const upcoming = events.filter(e => new Date(e.date) >= new Date()).slice(0, 5);
  const dss = schools.filter(s => s.type === 'DSS' || s.type === 'Private').slice(0, 6);
  const aided = schools.filter(s => s.type === 'Aided' || s.type === 'Government').slice(0, 6);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 rounded-3xl p-8 md:p-12 text-white">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-block bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm mb-4">2026-2027 升中年度</div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">為女兒的升中之路<br/>做好最齊全的準備</h1>
          <p className="text-lg text-blue-100 mb-6">整合全港 {schools.length} 間頂尖中學的排名、報名日期、面試資訊，一站式規劃升中面試</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/schools" className="bg-white text-primary-700 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition">查看學校一覽</Link>
            <Link href="/calendar" className="bg-white/10 backdrop-blur border border-white/30 text-white px-6 py-3 rounded-lg font-bold hover:bg-white/20 transition">查看報名月曆</Link>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 text-9xl opacity-10">🎓</div>
      </section>

      {/* 關鍵日期倒數 */}
      {upcoming.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">⏰ 即將到來的關鍵日期</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {upcoming.map((e, i) => {
              const days = Math.ceil((new Date(e.date).getTime() - Date.now()) / 86400000);
              return (
                <Link href={`/schools/${e.school_id}`} key={i} className="card p-4 block">
                  <div className="text-xs text-gray-500 mb-1">{e.date}</div>
                  <div className="font-bold text-sm mb-1 line-clamp-1">{e.school_name_zh}</div>
                  <div className="flex items-center justify-between">
                    <span className={`badge ${
                      e.type === '申請截止' ? 'bg-red-100 text-red-700' :
                      e.type === '面試' ? 'bg-purple-100 text-purple-700' :
                      e.type === '申請開始' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>{e.type}</span>
                    <span className={`text-xs font-bold ${days <= 14 ? 'text-red-600' : 'text-gray-600'}`}>{days > 0 ? `${days}天` : '今日'}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 統計 */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '收錄學校', value: schools.length, icon: '🏫' },
          { label: '頂尖直資', value: schools.filter(s => s.type === 'DSS').length, icon: '⭐' },
          { label: '官津名校', value: schools.filter(s => s.type === 'Aided' || s.type === 'Government').length, icon: '🎯' },
          { label: '關鍵日期', value: events.length, icon: '📅' },
        ].map(s => (
          <div key={s.label} className="card p-5 text-center">
            <div className="text-3xl mb-1">{s.icon}</div>
            <div className="text-2xl font-black text-primary-700">{s.value}</div>
            <div className="text-sm text-gray-600">{s.label}</div>
          </div>
        ))}
      </section>

      {/* 頂尖直資/私立 */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">⭐ 頂尖直資 / 私立名校</h2>
          <Link href="/schools?type=DSS,Private" className="text-primary-600 hover:underline text-sm">查看全部 →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dss.map(s => <SchoolCard key={s.id} school={s} />)}
        </div>
      </section>

      {/* 熱門官津 */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">🎯 熱門官立 / 津貼名校</h2>
          <Link href="/schools?type=Aided,Government" className="text-primary-600 hover:underline text-sm">查看全部 →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {aided.map(s => <SchoolCard key={s.id} school={s} />)}
        </div>
      </section>
    </div>
  );
}
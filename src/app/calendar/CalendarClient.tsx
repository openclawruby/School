'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

type Event = {
  school_id: string;
  school_name: string;
  school_name_zh: string;
  type: '申請開始' | '申請截止' | '面試' | '結果公佈';
  date: string;
  school_type: string;
};

const monthNames = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
const typeColors: Record<string, string> = {
  '申請開始': 'bg-green-100 text-green-700 border-green-300',
  '申請截止': 'bg-red-100 text-red-700 border-red-300',
  '面試': 'bg-purple-100 text-purple-700 border-purple-300',
  '結果公佈': 'bg-blue-100 text-blue-700 border-blue-300',
};

export default function CalendarClient({ events }: { events: Event[] }) {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(10); // Oct = 10 (升中重點月份)

  const monthEvents = useMemo(() =>
    events.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    }).sort((a,b) => a.date.localeCompare(b.date)),
    [events, year, month]
  );

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const eventByDate = useMemo(() => {
    const map: Record<number, Event[]> = {};
    monthEvents.forEach(e => {
      const d = new Date(e.date).getDate();
      (map[d] = map[d] || []).push(e);
    });
    return map;
  }, [monthEvents]);

  const prev = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); };

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h1 className="text-2xl font-bold mb-4">📅 升中報名月曆</h1>
        <div className="flex items-center justify-between">
          <button onClick={prev} className="btn-outline">← 上一月</button>
          <div className="text-xl font-bold">{year} 年 {monthNames[month]}</div>
          <button onClick={next} className="btn-outline">下一月 →</button>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {Object.entries(typeColors).map(([k,v]) => (
            <span key={k} className={`badge border ${v}`}>{k}</span>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['日','一','二','三','四','五','六'].map(d => (
              <div key={d} className="text-center text-sm font-bold text-gray-500 py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const evs = eventByDate[day] || [];
              return (
                <div key={day} className={`min-h-[80px] border rounded-lg p-1 ${evs.length ? 'bg-blue-50/50 border-blue-200' : 'border-gray-200'}`}>
                  <div className="text-sm font-bold mb-1">{day}</div>
                  <div className="space-y-1">
                    {evs.slice(0, 3).map((e, j) => (
                      <Link key={j} href={`/schools/${e.school_id}`} title={`${e.school_name_zh} - ${e.type}`}
                        className={`block text-xs px-1 py-0.5 rounded truncate border ${typeColors[e.type]}`}>
                        {e.school_name_zh}
                      </Link>
                    ))}
                    {evs.length > 3 && <div className="text-xs text-gray-500">+{evs.length - 3}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-bold mb-3">本月所有事件 ({monthEvents.length})</h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {monthEvents.length === 0 && <p className="text-sm text-gray-500">這個月沒有事件</p>}
            {monthEvents.map((e, i) => (
              <Link key={i} href={`/schools/${e.school_id}`} className="block p-3 border rounded-lg hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div className="font-medium text-sm">{e.school_name_zh}</div>
                  <span className={`badge text-xs border ${typeColors[e.type]}`}>{e.type}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">{e.date}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5 bg-amber-50 border-amber-200">
        <h3 className="font-bold mb-2">💡 升中關鍵月份提示</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• <b>10-11月</b>：直資/私立學校開放申請，搶先準備</li>
          <li>• <b>12月</b>：直資學校截止報名</li>
          <li>• <b>1月</b>：官津「自行分配學位」申請 + 直資面試</li>
          <li>• <b>3月</b>：自行分配學位結果公佈</li>
          <li>• <b>4月</b>：統一派位選校</li>
          <li>• <b>7月</b>：統一派位結果公佈</li>
        </ul>
      </div>
    </div>
  );
}
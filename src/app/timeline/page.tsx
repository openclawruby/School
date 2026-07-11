import { getTimelineEvents } from '@/lib/data';

const stages = [
  {
    period: '2026 年 9-10 月',
    title: '準備階段',
    desc: '準備 Portfolio、報名文件、校內成績單、自薦信',
    color: 'bg-gray-100 border-gray-300',
  },
  {
    period: '2026 年 10-11 月',
    title: '直資/私立學校開放申請',
    desc: '大部分直資學校（如聖保羅男女、拔萃男書院）於 10 月底至 11 月初開放報名系統。私立學校亦同步開放。',
    color: 'bg-purple-100 border-purple-300',
    schools: ['聖保羅男女中學', '拔萃男書院', '拔萃女書院', '德雅中學', '民生書院'],
  },
  {
    period: '2026 年 12 月',
    title: '直資/私立 申請截止',
    desc: '大部分直資/私立學校於 12 月截止報名。記得在截止前完成網上申請及繳費！',
    color: 'bg-red-100 border-red-300',
  },
  {
    period: '2027 年 1 月上旬',
    title: '官津「自行分配學位」申請',
    desc: '向所屬校網最多 2 間中學遞交申請表。不受校網限制（但只限 2 間）。',
    color: 'bg-blue-100 border-blue-300',
  },
  {
    period: '2027 年 1 月',
    title: '直資/私立 面試季節',
    desc: '直資學校集中於 1 月舉行面試。內容通常包括中英數筆試、小組討論、個人面試、家長面談。',
    color: 'bg-purple-100 border-purple-300',
  },
  {
    period: '2027 年 2 月',
    title: '直資/私立 取錄結果',
    desc: '直資學校公佈取錄結果。獲取錄者須於限期前確認學位，並放棄其他直資學位。',
    color: 'bg-green-100 border-green-300',
  },
  {
    period: '2027 年 3 月',
    title: '自行分配學位結果',
    desc: '教育局公佈自行分配學位結果。獲分配者自動放棄統一派位。',
    color: 'bg-blue-100 border-blue-300',
  },
  {
    period: '2027 年 4 月',
    title: '統一派位選校',
    desc: '填寫統一派位表格。甲部不受校網限制（最多 3 間），乙部按校網選擇（最多 30 間）。',
    color: 'bg-amber-100 border-amber-300',
  },
  {
    period: '2027 年 7 月初',
    title: '統一派位結果公佈',
    desc: '最終派位結果出爐！',
    color: 'bg-green-100 border-green-300',
  },
];

export const metadata = { title: '升中時間線 | 升中面試規劃' };

export default function TimelinePage() {
  const events = getTimelineEvents();
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-bold mb-2">🗓️ 升中時間線 (2026-2027)</h1>
        <p className="text-gray-600">從現在到派位結果公佈，按部就班準備升中</p>
      </div>

      <div className="space-y-4">
        {stages.map((stage, i) => (
          <div key={i} className={`card p-5 border-l-4 ${stage.color}`}>
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <div className="text-xs font-bold text-gray-500">{stage.period}</div>
                <h3 className="text-lg font-bold mt-1">{stage.title}</h3>
              </div>
              <span className="badge bg-white">{i + 1} / {stages.length}</span>
            </div>
            <p className="text-gray-700 mt-2">{stage.desc}</p>
            {stage.schools && (
              <div className="mt-3 flex flex-wrap gap-2">
                {stage.schools.map(s => <span key={s} className="badge bg-white">{s}</span>)}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card p-5">
        <h3 className="font-bold mb-3">📊 總事件統計: {events.length} 個</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          {['申請開始','申請截止','面試'].map(t => {
            const count = events.filter(e => e.type === t).length;
            return (
              <div key={t} className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-black text-primary-700">{count}</div>
                <div className="text-xs text-gray-600">{t}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
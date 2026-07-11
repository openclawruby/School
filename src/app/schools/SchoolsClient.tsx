'use client';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SchoolCard, { typeOrder } from '@/components/SchoolCard';
import type { School } from '@/types/school';

type SortKey = 'rank' | 'name' | 'tuition' | 'deadline';

const TYPE_KEYS = ['DSS', 'Private', 'Aided', 'Government'] as const;
const TYPE_LABELS: Record<string, string> = {
  DSS: '直資', Private: '私立', Aided: '津貼', Government: '官立',
};
const TYPE_CHIP_ACTIVE: Record<string, string> = {
  DSS: 'bg-purple-600 border-purple-600 text-white hover:bg-purple-700 hover:border-purple-700',
  Private: 'bg-pink-600 border-pink-600 text-white hover:bg-pink-700 hover:border-pink-700',
  Aided: 'bg-green-600 border-green-600 text-white hover:bg-green-700 hover:border-green-700',
  Government: 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700',
};
const TYPE_SECTION_DOT: Record<string, string> = {
  DSS: 'bg-purple-500',
  Private: 'bg-pink-500',
  Aided: 'bg-green-500',
  Government: 'bg-blue-500',
};

const GENDER_KEYS = ['Co-ed', 'Boys', 'Girls'] as const;
const GENDER_LABELS: Record<string, string> = {
  'Co-ed': '男女校', Boys: '男校', Girls: '女校',
};

const FAV_KEY = 'school-favs';

function loadFavs(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(FAV_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveFavs(favs: Set<string>) {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(favs)));
  } catch {}
}

function sortSchools(list: School[], key: SortKey): School[] {
  const copy = [...list];
  switch (key) {
    case 'name':
      return copy.sort((a, b) => (a.name_zh || '').localeCompare(b.name_zh || '', 'zh-Hant'));
    case 'tuition':
      return copy.sort((a, b) => {
        const at = a.tuition_annual_hkd ?? 999999;
        const bt = b.tuition_annual_hkd ?? 999999;
        if (at !== bt) return at - bt;
        return (a.name_zh || '').localeCompare(b.name_zh || '', 'zh-Hant');
      });
    case 'deadline':
      return copy.sort((a, b) => {
        // Empty deadline = skeleton = last. Use a sentinel year so they cluster at the bottom.
        const ad = a.application_deadline || '9999-12-31';
        const bd = b.application_deadline || '9999-12-31';
        return ad.localeCompare(bd);
      });
    case 'rank':
    default:
      return copy.sort((a, b) => {
        const ar = a.ranking_2026 ?? 9999;
        const br = b.ranking_2026 ?? 9999;
        if (ar !== br) return ar - br;
        return (a.name_zh || '').localeCompare(b.name_zh || '', 'zh-Hant');
      });
  }
}

export default function SchoolsClient({ schools }: { schools: School[] }) {
  const params = useSearchParams();
  const [search, setSearch] = useState('');
  const [typeSel, setTypeSel] = useState<Set<string>>(
    new Set(params.get('type') ? params.get('type')!.split(',') : [])
  );
  const [genderSel, setGenderSel] = useState<Set<string>>(new Set());
  const [district, setDistrict] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [favs, setFavs] = useState<Set<string>>(new Set());

  // Load favorites after hydration to avoid SSR mismatch
  useEffect(() => { setFavs(loadFavs()); }, []);
  const toggleFav = (id: string) => {
    setFavs(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      saveFavs(next);
      return next;
    });
  };

  // Counts computed from CURRENT filter state (excluding the chip itself),
  // so users can see how many results each chip would yield.
  const districts = useMemo(
    () => Array.from(new Set(schools.map(s => s.district).filter(Boolean))).sort(),
    [schools]
  );

  const baseFiltered = useMemo(() => {
    return schools.filter(s => {
      if (search) {
        const q = search.toLowerCase();
        if (!s.name_zh.includes(search) && !s.name_en.toLowerCase().includes(q)) return false;
      }
      if (typeSel.size > 0 && !typeSel.has(s.type)) return false;
      if (genderSel.size > 0 && !genderSel.has(s.gender)) return false;
      if (district !== 'all' && s.district !== district) return false;
      return true;
    });
  }, [schools, search, typeSel, genderSel, district]);

  // Counts per chip (excluding that chip from filter, so users see the alternative)
  const typeCounts = useMemo(() => {
    const out: Record<string, number> = {};
    for (const k of TYPE_KEYS) {
      out[k] = baseFiltered.filter(s => s.type === k).length;
    }
    return out;
  }, [baseFiltered]);

  const filtered = useMemo(() => sortSchools(baseFiltered, sortKey), [baseFiltered, sortKey]);

  // Group by type for sectioned layout
  const grouped = useMemo(() => {
    const map = new Map<string, School[]>();
    for (const t of TYPE_KEYS) map.set(t, []);
    for (const s of filtered) {
      if (map.has(s.type)) map.get(s.type)!.push(s);
      else map.set(s.type, [s]); // catch-all for International etc.
    }
    return Array.from(map.entries())
      .filter(([, arr]) => arr.length > 0)
      .sort((a, b) => (typeOrder[a[0]] ?? 99) - (typeOrder[b[0]] ?? 99));
  }, [filtered]);

  const stats = useMemo(() => {
    const all = schools.length;
    const ranked = schools.filter(s => s.ranking_2026).length;
    return { all, ranked };
  }, [schools]);

  const toggleType = (k: string) => {
    setTypeSel(prev => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  };
  const toggleGender = (k: string) => {
    setGenderSel(prev => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  };
  const clearAll = () => {
    setSearch('');
    setTypeSel(new Set());
    setGenderSel(new Set());
    setDistrict('all');
  };
  const hasFilters = search || typeSel.size > 0 || genderSel.size > 0 || district !== 'all';

  return (
    <div className="space-y-6">
      {/* Hero / Stats */}
      <div className="card p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
          <h1 className="text-2xl font-bold">🏫 香港中學一覽</h1>
          <div className="text-sm text-gray-500 tabular-nums">
            <span className="font-bold text-gray-900">{stats.all}</span> 間學校 ·{' '}
            <span className="font-bold text-accent-600">{stats.ranked}</span> 已排名
          </div>
        </div>

        {/* Search + sort row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜尋中英文校名..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
          <select
            value={sortKey}
            onChange={e => setSortKey(e.target.value as SortKey)}
            className="border rounded-lg px-3 py-2 text-sm bg-white"
            aria-label="排序方式"
          >
            <option value="rank">排序: 排名優先</option>
            <option value="name">排序: 校名 (中)</option>
            <option value="tuition">排序: 學費 低→高</option>
            <option value="deadline">排序: 截止日期</option>
          </select>
        </div>

        {/* Type chips */}
        <div className="mb-3">
          <div className="text-xs font-medium text-gray-500 mb-1.5">類型</div>
          <div className="flex flex-wrap gap-2">
            {TYPE_KEYS.map(k => {
              const active = typeSel.has(k);
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => toggleType(k)}
                  className={`chip ${active ? TYPE_CHIP_ACTIVE[k] : ''}`}
                >
                  {TYPE_LABELS[k]}
                  <span className="chip-count">{typeCounts[k]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Gender chips */}
        <div className="mb-3">
          <div className="text-xs font-medium text-gray-500 mb-1.5">性別</div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setGenderSel(new Set())}
              className={`chip ${genderSel.size === 0 ? 'chip-active' : ''}`}
            >
              全部
            </button>
            {GENDER_KEYS.map(k => {
              const active = genderSel.has(k);
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => toggleGender(k)}
                  className={`chip ${active ? 'chip-active' : ''}`}
                >
                  {GENDER_LABELS[k]}
                </button>
              );
            })}
          </div>
        </div>

        {/* District dropdown */}
        <div>
          <div className="text-xs font-medium text-gray-500 mb-1.5">地區</div>
          <select
            value={district}
            onChange={e => setDistrict(e.target.value)}
            className="w-full sm:w-auto border rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="all">全部地區 ({schools.length})</option>
            {districts.map(d => (
              <option key={d} value={d}>
                {d} ({schools.filter(s => s.district === d).length})
              </option>
            ))}
          </select>
        </div>

        {/* Footer line */}
        <div className="mt-4 flex items-center justify-between flex-wrap gap-2 text-sm">
          <div className="text-gray-600 tabular-nums">
            顯示 <span className="font-bold text-gray-900">{filtered.length}</span> / {schools.length} 間學校
            {favs.size > 0 && (
              <span className="ml-3 text-pink-600">
                ♥ <span className="font-bold">{favs.size}</span> 間已收藏
              </span>
            )}
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-primary-600 hover:underline"
            >
              清除全部篩選
            </button>
          )}
        </div>
      </div>

      {/* Results — grouped by type */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          沒有符合條件的學校，試試其他篩選。
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(([typeKey, list]) => (
            <section key={typeKey}>
              <div className="sticky top-16 z-20 -mx-4 px-4 sm:mx-0 sm:px-0 py-2 bg-[#fafbfc]/95 backdrop-blur border-b border-gray-200 mb-4 flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${TYPE_SECTION_DOT[typeKey] || 'bg-gray-400'}`} />
                <h2 className="text-lg font-bold text-gray-900">
                  {TYPE_LABELS[typeKey] || typeKey}
                  <span className="ml-2 text-sm font-normal text-gray-500 tabular-nums">
                    {list.length} 間
                  </span>
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map(s => (
                  <SchoolCard
                    key={s.id}
                    school={s}
                    isFavorited={favs.has(s.id)}
                    onToggleFavorite={toggleFav}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

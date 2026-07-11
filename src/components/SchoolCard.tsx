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

const typeOrder: Record<string, number> = { DSS: 0, Private: 1, Aided: 2, Government: 3, International: 4 };

// Skeleton: missing the most discriminating fields.
// website_summary is the strongest signal (only 31/206 have it).
// We also dim if notable_features + tuition both missing — catches partial fills.
export function isSkeleton(school: School): boolean {
  if (!school.website_summary) return true;
  if (!school.notable_features?.length && !school.tuition_annual_hkd) return true;
  return false;
}

export default function SchoolCard({
  school,
  isFavorited,
  onToggleFavorite,
}: {
  school: School;
  isFavorited?: boolean;
  onToggleFavorite?: (id: string) => void;
}) {
  const skeleton = isSkeleton(school);
  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(school.id);
  };

  return (
    <Link
      href={`/schools/${school.id}`}
      className={`card p-5 block group relative ${skeleton ? 'opacity-90' : ''}`}
    >
      {/* Favorite heart */}
      <button
        type="button"
        onClick={handleFav}
        aria-label={isFavorited ? '取消收藏' : '加入收藏'}
        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-base transition ${
          isFavorited
            ? 'bg-pink-100 text-pink-600 hover:bg-pink-200'
            : 'bg-gray-50 text-gray-300 hover:bg-gray-100 hover:text-pink-400'
        }`}
      >
        {isFavorited ? '♥' : '♡'}
      </button>

      <div className="flex justify-between items-start mb-3 pr-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              school.ranking_2026
                ? 'text-accent-600 bg-accent-50'
                : 'text-gray-400 bg-gray-50'
            }`}>
              {school.ranking_2026 ? `#${school.ranking_2026}` : '未排名'}
            </span>
            <span className={`badge ${typeColors[school.type] || 'bg-gray-100 text-gray-700'}`}>
              {typeLabels[school.type] || school.type}
            </span>
            {school.gender && (
              <span className={`badge ${genderColors[school.gender] || 'bg-gray-100 text-gray-700'}`}>
                {school.gender === 'Co-ed' ? '男女' : school.gender === 'Boys' ? '男校' : school.gender === 'Girls' ? '女校' : school.gender}
              </span>
            )}
            {skeleton && (
              <span className="badge bg-gray-100 text-gray-500">資料待完善</span>
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-700 transition">
            {school.name_zh || school.name_en}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">{school.name_en}</p>
        </div>
      </div>

      <div className="space-y-1.5 text-sm text-gray-600">
        {school.district && (
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>
              {school.district_zh && school.district_zh !== school.district
                ? `${school.district_zh} · ${school.district}`
                : school.district}
            </span>
          </div>
        )}
        {school.medium_of_instruction && (
          <div className="flex items-center gap-2">
            <span>🎓</span>
            <span>{school.medium_of_instruction}</span>
          </div>
        )}
        {!skeleton && (
          <div className="flex items-center gap-2">
            <span>💰</span>
            {typeof school.tuition_annual_hkd === 'number' && school.tuition_annual_hkd > 0 ? (
              <span>HK$ {school.tuition_annual_hkd.toLocaleString()} /年</span>
            ) : (
              <span className="text-green-600 font-medium">免費 (官津)</span>
            )}
          </div>
        )}
        {!skeleton && school.application_deadline && (
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span className="text-red-600 font-medium">截止: {school.application_deadline}</span>
          </div>
        )}
      </div>

      {!skeleton && school.notable_features && school.notable_features.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {school.notable_features.slice(0, 3).map(f => (
            <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{f}</span>
          ))}
        </div>
      )}
    </Link>
  );
}

// Export for use in SchoolsClient when grouping by type
export { typeOrder };

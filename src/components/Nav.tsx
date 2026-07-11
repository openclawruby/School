'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: '首頁' },
  { href: '/schools', label: '學校一覽' },
  { href: '/calendar', label: '報名月曆' },
  { href: '/timeline', label: '升中時間線' },
  { href: '/tracker', label: '申請追蹤' },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🎓</span>
            <div>
              <div className="font-bold text-primary-700">升中面試規劃</div>
              <div className="text-xs text-gray-500">2026-2027 升中年度</div>
            </div>
          </Link>
          <div className="hidden md:flex space-x-1">
            {links.map(l => (
              <Link key={l.href} href={l.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  path === l.href ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
                }`}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
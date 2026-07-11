import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: '升中面試規劃 | 香港中一入學 2026-2027',
  description: '香港頂尖中學排名、報名時間、面試日期及升中派位完整資訊平台',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Nav />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
          {children}
        </main>
        <footer className="border-t border-gray-200 mt-16 py-8 text-center text-sm text-gray-500">
          <p>© 2026 升中面試規劃 · 資料僅供參考，請以學校官方公布為準</p>
        </footer>
      </body>
    </html>
  );
}
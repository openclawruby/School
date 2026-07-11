import { Suspense } from 'react';
import { getAllSchools } from '@/lib/data';
import SchoolsClient from './SchoolsClient';

export default function SchoolsPage() {
  const schools = getAllSchools();
  return (
    <Suspense fallback={<div className="card p-12 text-center">載入中...</div>}>
      <SchoolsClient schools={schools} />
    </Suspense>
  );
}
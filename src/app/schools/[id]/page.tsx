import { getAllSchools, getSchoolById } from '@/lib/data';
import { notFound } from 'next/navigation';
import SchoolDetailClient from './SchoolDetailClient';

export function generateStaticParams() {
  return getAllSchools().map(s => ({ id: s.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const s = getSchoolById(params.id);
  return { title: s ? `${s.name_zh} | 升中面試規劃` : '學校詳情' };
}

export default function SchoolPage({ params }: { params: { id: string } }) {
  const school = getSchoolById(params.id);
  if (!school) notFound();
  return <SchoolDetailClient school={school} />;
}
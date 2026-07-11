import { getAllSchools } from '@/lib/data';
import TrackerClient from './TrackerClient';

export const metadata = { title: '申請追蹤 | 升中面試規劃' };

export default function TrackerPage() {
  return <TrackerClient schools={getAllSchools()} />;
}
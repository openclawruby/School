import { getTimelineEvents } from '@/lib/data';
import CalendarClient from './CalendarClient';

export const metadata = { title: '升中報名月曆 | 升中面試規劃' };

export default function CalendarPage() {
  return <CalendarClient events={getTimelineEvents()} />;
}
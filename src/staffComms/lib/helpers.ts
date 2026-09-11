import type { Announcement, RecurrenceType } from '../types';

export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function weekdayOf(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  return WEEKDAYS[d.getDay()] || '';
}

// Shared by AnnouncementForm (typing a date) and CalendarTab (dragging a
// weekly item's anchor to a new day) - both change the same three inputs
// and need the resulting label to stay consistent.
export function computeRecurrenceLabel(
  type: RecurrenceType,
  eventDate: string | null,
  endDate: string | null,
  day: string,
): string {
  if (type === 'one_time' || !eventDate) return '';
  if (type === 'date_range') {
    if (!endDate) return '';
    const s = new Date(eventDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const e = new Date(endDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${s} – ${e}`;
  }
  if (type === 'weekly') {
    const wd = day || weekdayOf(eventDate);
    if (!endDate) return `Every ${wd}`;
    const s = new Date(eventDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const e = new Date(endDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `Every ${wd}, ${s} – ${e}`;
  }
  return '';
}

export function getScopeLeadWeeks(scope: Announcement['scope']): number {
  if (scope === 'whole_church') return 6;
  if (scope === 'ministry') return 4;
  return 3;
}

export function getSlideStartDate(a: Announcement): string | null {
  if (!a.event_date || !a.show_on_slides) return null;
  const d = new Date(a.event_date + 'T12:00:00');
  d.setDate(d.getDate() - getScopeLeadWeeks(a.scope) * 7);
  return d.toISOString().split('T')[0];
}

export function getSlideEndDate(a: Announcement): string | null {
  if (!a.event_date) return a.happenings_end_date || null;
  return a.event_date;
}

export function getAutoHappeningsStartDate(a: Announcement, today: string): string {
  if (a.is_recurring) return a.happenings_start_date || today;
  if (!a.event_date) return today;
  const leadWeeks = getScopeLeadWeeks(a.scope);
  const d = new Date(a.event_date + 'T12:00:00');
  d.setDate(d.getDate() - leadWeeks * 7);
  const calculated = d.toISOString().split('T')[0];
  return calculated < today ? today : calculated;
}

export function getAutoHappeningsEndDate(a: Announcement): string | null {
  if (a.is_recurring) return a.happenings_end_date || null;
  return a.event_date || a.happenings_end_date || null;
}

export function isSlideActive(a: Announcement, today: string): boolean {
  if (!a.show_on_slides) return false;
  if (a.is_recurring) {
    const start = a.happenings_start_date || '2000-01-01';
    const end = a.happenings_end_date || '2099-12-31';
    return today >= start && today <= end;
  }
  const start = getSlideStartDate(a);
  const end = getSlideEndDate(a);
  if (!start || !end) return false;
  return today >= start && today <= end;
}

export function isHappeningsActive(a: Announcement, today: string): boolean {
  if (!a.show_in_happenings) return false;
  const start = getAutoHappeningsStartDate(a, today);
  const end = getAutoHappeningsEndDate(a) || '2099-12-31';
  return today >= start && today <= end;
}

export function isMonthlyActive(a: Announcement, today: string): boolean {
  if (!a.monthly_include) return false;
  const cm = today.slice(0, 7);
  const startDate = getAutoHappeningsStartDate(a, today);
  const endDate = getAutoHappeningsEndDate(a) || a.event_date;
  const sm = (startDate || '2000-01').slice(0, 7);
  const em = (endDate || '2099-12').slice(0, 7);
  return sm <= cm && em >= cm;
}

export function isStageActive(a: Announcement, today: string): boolean {
  if (a.scope !== 'whole_church') return false;
  if (a.is_recurring) {
    const start = a.happenings_start_date || '2000-01-01';
    const end = a.happenings_end_date || '2099-12-31';
    return today >= start && today <= end;
  }
  if (a.event_date) {
    const start = getSlideStartDate(a) || getAutoHappeningsStartDate(a, today);
    const end = a.event_date;
    return today >= start && today <= end;
  }
  const start = getAutoHappeningsStartDate(a, today);
  const end = getAutoHappeningsEndDate(a) || '2099-12-31';
  return today >= start && today <= end;
}

// Shared by isArchived and the Archive tab's own display/sort - all three
// used to independently gather+sort the same three date fields.
export function getLastRelevantDate(a: Announcement): string | null {
  const dates: string[] = [];
  if (a.event_date) dates.push(a.event_date);
  if (a.event_dates?.length) dates.push(...a.event_dates);
  if (a.happenings_end_date) dates.push(a.happenings_end_date);
  return dates.length ? dates.sort().at(-1)! : null;
}

export function isArchived(a: Announcement, today: string): boolean {
  if (a.is_recurring) return false;
  const last = getLastRelevantDate(a);
  return last !== null && last < today;
}

export function formatDateNice(d: string | null | undefined): string {
  if (!d) return '';
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDateLong(d: string): string {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function weeksUntil(eventDate: string | null | undefined, today: string): number | null {
  if (!eventDate) return null;
  const diff = (new Date(eventDate + 'T12:00:00').getTime() - new Date(today + 'T12:00:00').getTime()) / (1000 * 60 * 60 * 24 * 7);
  return Math.ceil(diff);
}

// Announcement body/flyer text often repeats the title as its own leading
// sentence ("Men's Bible Study - join us...") - strip that duplicate lead-in
// wherever the title is already shown separately (bulletin/flyer layouts).
export function stripLeadingTitle(text: string, title: string): string {
  if (!text || !title) return text;
  return text.replace(new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*[:\\-–—]?\\s*`, 'i'), '');
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

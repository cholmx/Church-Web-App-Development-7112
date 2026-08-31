import type { Announcement } from '../types';

export const CALENDAR_GRID_CELLS = 42;
export const WEEK_LENGTH = 7;

export function getMonthGrid(year: number, month: number): string[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells: string[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, daysInPrev - i);
    cells.push(d.toISOString().split('T')[0]);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d).toISOString().split('T')[0]);
  }
  const remaining = CALENDAR_GRID_CELLS - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push(new Date(year, month + 1, d).toISOString().split('T')[0]);
  }
  return cells;
}

export function getEventItems(day: string, announcements: Announcement[]): Announcement[] {
  return announcements.filter(a => {
    if (a.event_dates?.length) return a.event_dates.includes(day);
    return a.event_date === day;
  });
}

export function getRangeItems(
  day: string,
  announcements: Announcement[],
): Array<{ a: Announcement; isStart: boolean; isEnd: boolean }> {
  return announcements
    .filter(a => !a.event_date && (a.happenings_start_date || a.happenings_end_date))
    .filter(a => {
      const start = a.happenings_start_date || '2000-01-01';
      const end   = a.happenings_end_date   || '2099-12-31';
      return day >= start && day <= end;
    })
    .map(a => ({
      a,
      isStart: a.happenings_start_date === day,
      isEnd:   a.happenings_end_date   === day,
    }));
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function dayIndexInWeek(weekStart: string, date: string): number {
  const ws = new Date(weekStart + 'T12:00:00').getTime();
  const d  = new Date(date      + 'T12:00:00').getTime();
  return Math.round((d - ws) / (1000 * 60 * 60 * 24));
}

export interface RangeRowEntry {
  a: Announcement;
  row: number;
  startCol: number;
  span: number;
}

export function computeRangeRows(
  announcements: Announcement[],
  weekStart: string,
  weekEnd: string,
): RangeRowEntry[] {
  const active = announcements.filter(a => {
    if (a.event_date) return false;
    const s = a.happenings_start_date || '2000-01-01';
    const e = a.happenings_end_date   || '2099-12-31';
    return s <= weekEnd && e >= weekStart;
  });

  if (active.length === 0) return [];

  const result: RangeRowEntry[] = [];
  const rowOccupancy: boolean[][] = [];

  for (const a of active) {
    const s = a.happenings_start_date || '2000-01-01';
    const e = a.happenings_end_date   || '2099-12-31';

    const startCol = clamp(dayIndexInWeek(weekStart, s), 0, WEEK_LENGTH - 1);
    const endCol   = clamp(dayIndexInWeek(weekStart, e), 0, WEEK_LENGTH - 1);
    const span = endCol - startCol + 1;

    let row = 0;
    while (true) {
      if (!rowOccupancy[row]) rowOccupancy[row] = new Array(WEEK_LENGTH).fill(false);
      const occupied = rowOccupancy[row].slice(startCol, startCol + span).some(Boolean);
      if (!occupied) {
        for (let c = startCol; c <= endCol; c++) rowOccupancy[row][c] = true;
        result.push({ a, row, startCol, span });
        break;
      }
      row++;
    }
  }

  return result;
}

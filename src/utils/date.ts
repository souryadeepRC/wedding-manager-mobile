import { differenceInCalendarDays } from 'date-fns';

export type Countdown =
  | { kind: 'none' }
  | { kind: 'future' | 'today' | 'past'; days: number; label: string };

export function getCountdown(weddingDate: Date | null, today: Date = new Date()): Countdown {
  if (!weddingDate) return { kind: 'none' };
  const diff = differenceInCalendarDays(weddingDate, today);
  if (diff === 0) return { kind: 'today', days: 0, label: "Today's the day!" };
  if (diff === 1) return { kind: 'future', days: 1, label: '1 Day to Go' };
  if (diff > 1) return { kind: 'future', days: diff, label: `${diff} Days to Go` };
  const ago = Math.abs(diff);
  return {
    kind: 'past',
    days: ago,
    label: ago === 1 ? 'Married 1 day ago' : `Married ${ago} days ago`,
  };
}

// Dates are stored at local noon so the calendar day never shifts across time zones or DST.
export function toStoredDate(d: Date): string {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12).toISOString();
}

export function fromStoredDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

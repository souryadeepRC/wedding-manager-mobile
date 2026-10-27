import type { ThemeColors } from '@/theme';

export const GUEST_STATUS = [
  { value: 'waiting', label: 'Waiting', color: 'warning' },
  { value: 'confirmed', label: 'Confirmed', color: 'success' },
  { value: 'declined', label: 'Declined', color: 'danger' },
] as const satisfies readonly { value: string; label: string; color: keyof ThemeColors }[];

export const GUEST_RELATION = [
  { value: 'relative', label: 'Relative' },
  { value: 'my_friend', label: 'My friend' },
  { value: 'dad_friend', label: "Dad's friend" },
  { value: 'mom_friend', label: "Mom's friend" },
  { value: 'others', label: 'Others' },
] as const;

export const EVENT_TYPES = [
  { value: 'wedding', label: 'Wedding', icon: 'heart' },
  { value: 'reception', label: 'Reception', icon: 'sparkles' },
] as const;

export const GUEST_COUNT = { min: 1, max: 50 } as const;
export const TITLE_MAX = 80;
export const NOTES_MAX = 500;

export const statusMeta = (value: string) =>
  GUEST_STATUS.find(s => s.value === value) ?? GUEST_STATUS[0];

export const relationLabel = (value: string) =>
  GUEST_RELATION.find(r => r.value === value)?.label ?? GUEST_RELATION[0].label;

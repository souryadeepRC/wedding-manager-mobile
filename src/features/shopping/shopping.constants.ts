import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import type { ThemeColors } from '@/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

// `tone` indexes the theme's tileAccents so each person keeps a colour.
export const ITEM_FOR = [
  { value: 'mother', label: 'Mother', icon: 'heart', tone: 6 },
  { value: 'father', label: 'Father', icon: 'person', tone: 2 },
  { value: 'bride', label: 'Bride', icon: 'flower', tone: 0 },
  { value: 'groom', label: 'Groom', icon: 'star', tone: 3 },
] as const satisfies readonly { value: string; label: string; icon: IconName; tone: number }[];

export const SHOPPING_STATUS = [
  { value: 'pending', label: 'Pending', icon: 'time', color: 'warning' },
  { value: 'done', label: 'Done', icon: 'checkmark', color: 'success' },
] as const satisfies readonly { value: string; label: string; icon: IconName; color: keyof ThemeColors }[];

export const TITLE_MAX = 80;

export const itemForMeta = (value: string) => ITEM_FOR.find(i => i.value === value) ?? ITEM_FOR[0];

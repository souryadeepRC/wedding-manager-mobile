import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import type { ThemeColors } from '@/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

export const CHECKLIST_STATUS = [
  { value: 'pending', label: 'Pending', icon: 'time', color: 'warning' },
  { value: 'done', label: 'Done', icon: 'checkmark', color: 'success' },
] as const satisfies readonly { value: string; label: string; icon: IconName; color: keyof ThemeColors }[];

// Offered on the empty checklist; tapping one opens Add task with it filled in.
export const TASK_SUGGESTIONS = ['Send invites', 'Book mehendi artist', 'Sangeet playlist'] as const;

export const TITLE_MAX = 80;

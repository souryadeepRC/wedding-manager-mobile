import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type IconName = ComponentProps<typeof Ionicons>['name'];

export type ExpenseVisual = { label: string; words: string[]; icon: IconName; tone: number };

// Kinds of expense, also offered as "Quick picks". First match wins against the lower-cased title.
// `tone` indexes the theme's tileAccents (0 pink, 1 purple, 2 cyan, 3 gold, 4 mint, 5 orange, 6 lilac).
export const EXPENSE_KINDS: readonly ExpenseVisual[] = [
  { label: 'Caterer', words: ['cater', 'food', 'dinner', 'lunch', 'menu', 'sweet', 'cake'], icon: 'restaurant', tone: 5 },
  { label: 'Decor', words: ['decor', 'flower', 'floral', 'mandap', 'stage', 'light'], icon: 'flower', tone: 0 },
  { label: 'Photography', words: ['photo', 'video', 'camera', 'album'], icon: 'camera', tone: 2 },
  { label: 'Venue', words: ['venue', 'hall', 'resort', 'hotel', 'banquet', 'lawn'], icon: 'business', tone: 1 },
  { label: 'Outfit', words: ['dress', 'lehenga', 'saree', 'sherwani', 'cloth', 'outfit', 'suit'], icon: 'shirt', tone: 6 },
  { label: 'Jewellery', words: ['jewel', 'gold', 'ring', 'diamond', 'necklace'], icon: 'diamond', tone: 3 },
  { label: 'Makeup', words: ['makeup', 'beauty', 'salon', 'mehendi', 'mehndi', 'henna', 'glam'], icon: 'sparkles', tone: 0 },
  { label: 'Music', words: ['dj', 'music', 'band', 'dhol', 'sound', 'sangeet'], icon: 'musical-notes', tone: 1 },
  { label: 'Travel', words: ['travel', 'cab', 'car', 'bus', 'flight', 'transport', 'baraat'], icon: 'car-sport', tone: 2 },
  { label: 'Invites', words: ['card', 'invite', 'print'], icon: 'mail-open', tone: 3 },
  { label: 'Gifts', words: ['gift', 'return', 'favour', 'favor'], icon: 'gift', tone: 5 },
  { label: 'Priest', words: ['priest', 'pandit', 'puja', 'ritual'], icon: 'flame', tone: 5 },
];

const FALLBACK = { icon: 'wallet', tone: 1 } as const;

export const expenseVisual = (title: string): { icon: IconName; tone: number } => {
  const t = title.toLowerCase();
  return EXPENSE_KINDS.find(k => k.words.some(w => t.includes(w))) ?? FALLBACK;
};

export const expenseIcon = (title: string): IconName => expenseVisual(title).icon;

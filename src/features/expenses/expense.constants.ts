import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export const PAYMENT_MODES = [
  { value: 'cash', label: 'Cash', icon: 'cash', tone: 4 },
  { value: 'credit_card', label: 'Credit Card', icon: 'card', tone: 6 },
  { value: 'debit_card', label: 'Debit Card', icon: 'card', tone: 2 },
  { value: 'gpay', label: 'GPay', icon: 'phone-portrait', tone: 5 },
  { value: 'phonepe', label: 'PhonePe', icon: 'qr-code', tone: 6 },
] as const satisfies readonly { value: string; label: string; icon: ComponentProps<typeof Ionicons>['name']; tone: number }[];

export const TITLE_MAX = 80;
export const AMOUNT_MAX = 1_000_000_000;

export const modeMeta = (value: string) =>
  PAYMENT_MODES.find(m => m.value === value) ?? PAYMENT_MODES[0];

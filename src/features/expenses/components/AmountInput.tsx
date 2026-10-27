import type { ReactNode } from 'react';
import { AppInput, AppText } from '@/components';
import { formatAmount } from '@/utils/currency';

type Props = {
  label: string;
  value: number;
  onChange: (n: number) => void;
  error?: string;
  hint?: ReactNode;
};

// Big whole-rupee input with a ₹ prefix and Indian digit grouping; 0 shows as empty so the placeholder is visible.
export function AmountInput({ label, value, onChange, error, hint }: Props) {
  return (
    <AppInput
      label={label}
      size="lg"
      left={<AppText variant="amount" color="textSecondary">₹</AppText>}
      value={value ? formatAmount(value) : ''}
      onChangeText={text => onChange(Number(text.replace(/\D/g, '')) || 0)}
      keyboardType="number-pad"
      placeholder="0"
      maxLength={14}
      error={error}
      hint={hint}
    />
  );
}

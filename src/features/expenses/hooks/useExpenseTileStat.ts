import { formatINR } from '@/utils/currency';
import { useExpenseData } from './useExpenseData';

export function useExpenseTileStat(): string | undefined {
  const { expenses, totals, isLoading, isError } = useExpenseData();
  if (isLoading || isError) return undefined;
  if (!expenses.length) return 'No expenses yet';
  return `${formatINR(totals.paid)} paid · ${formatINR(totals.remaining)} left`;
}

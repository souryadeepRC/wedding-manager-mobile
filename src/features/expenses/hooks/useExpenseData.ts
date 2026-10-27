import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/store/appStore';
import { expenseService, paymentService } from '../expense.service';
import type { ExpenseSummary, Payment } from '../expense.schema';

// Expenses plus their payments in one place: paid and remaining are derived, never stored.
export function useExpenseData() {
  const weddingId = useAppStore(s => s.currentWeddingId);
  const expensesQ = useQuery({
    queryKey: ['expenses', 'list', weddingId],
    queryFn: () => expenseService.list(weddingId!),
    enabled: !!weddingId,
  });
  const paymentsQ = useQuery({
    queryKey: ['expenses', 'payments', weddingId],
    queryFn: () => paymentService.listAll(weddingId!),
    enabled: !!weddingId,
  });

  const { expenses, paymentsByExpense, totals } = useMemo(() => {
    const byExpense = new Map<string, Payment[]>();
    for (const p of paymentsQ.data ?? []) byExpense.set(p.expenseId, [...(byExpense.get(p.expenseId) ?? []), p]);
    const list: ExpenseSummary[] = (expensesQ.data ?? []).map(e => {
      const paid = (byExpense.get(e.id) ?? []).reduce((sum, p) => sum + p.amount, 0);
      return { ...e, paid, remaining: Math.max(0, e.totalAmount - paid) };
    });
    return {
      expenses: list,
      paymentsByExpense: byExpense,
      totals: {
        total: list.reduce((s, e) => s + e.totalAmount, 0),
        paid: list.reduce((s, e) => s + e.paid, 0),
        remaining: list.reduce((s, e) => s + e.remaining, 0),
      },
    };
  }, [expensesQ.data, paymentsQ.data]);

  return {
    expenses,
    paymentsByExpense,
    totals,
    isLoading: expensesQ.isLoading || paymentsQ.isLoading,
    isError: expensesQ.isError || paymentsQ.isError,
    isRefetching: expensesQ.isRefetching || paymentsQ.isRefetching,
    refetch: () => Promise.all([expensesQ.refetch(), paymentsQ.refetch()]),
  };
}

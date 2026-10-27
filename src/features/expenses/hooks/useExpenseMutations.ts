import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ensureSession } from '@/lib/session';
import { useAppStore } from '@/store/appStore';
import { expenseService, paymentService } from '../expense.service';
import type { ExpenseForm, PaymentForm } from '../expense.schema';

// Every mutation refreshes lists, details and the Home total (all under the 'expenses' key).
function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ['expenses'] });
}

function requireWedding(): string {
  const id = useAppStore.getState().currentWeddingId;
  if (!id) throw new Error('Save your wedding details in Settings first.');
  return id;
}

export function useCreateExpense() {
  const onSuccess = useInvalidate();
  return useMutation({
    mutationFn: async (input: ExpenseForm) => expenseService.create(await ensureSession(), requireWedding(), input),
    onSuccess,
  });
}

export function useUpdateExpense(id: string) {
  const onSuccess = useInvalidate();
  return useMutation({ mutationFn: (input: ExpenseForm) => expenseService.update(id, input), onSuccess });
}

export function useDeleteExpense(id: string) {
  const onSuccess = useInvalidate();
  return useMutation({ mutationFn: () => expenseService.remove(id), onSuccess });
}

export function useCreatePayment(expenseId: string) {
  const onSuccess = useInvalidate();
  return useMutation({
    mutationFn: async (input: PaymentForm) =>
      paymentService.create(await ensureSession(), requireWedding(), expenseId, input),
    onSuccess,
  });
}

export function useUpdatePayment(id: string) {
  const onSuccess = useInvalidate();
  return useMutation({ mutationFn: (input: PaymentForm) => paymentService.update(id, input), onSuccess });
}

export function useDeletePayment(id: string) {
  const onSuccess = useInvalidate();
  return useMutation({ mutationFn: () => paymentService.remove(id), onSuccess });
}

import { z } from 'zod';
import { formatINR } from '@/utils/currency';
import { AMOUNT_MAX, PAYMENT_MODES, TITLE_MAX } from './expense.constants';

const modes = PAYMENT_MODES.map(m => m.value) as [
  (typeof PAYMENT_MODES)[number]['value'],
  ...(typeof PAYMENT_MODES)[number]['value'][],
];

const amount = z.number().int('Whole rupees only').positive('Enter an amount above ₹0');

export const expenseFormSchema = z.object({
  title: z.string().trim().min(1, 'Enter a title').max(TITLE_MAX, `Up to ${TITLE_MAX} characters`),
  totalAmount: amount.max(AMOUNT_MAX, 'Amount is too large'),
});

// A payment can never exceed what is still owed on its expense.
export const makePaymentSchema = (max: number) =>
  z.object({
    amount: amount.max(max, max > 0 ? `That's more than the ${formatINR(max)} left to pay` : 'Already paid in full'),
    paidOn: z.date(),
    mode: z.enum(modes),
  });

export type ExpenseForm = z.infer<typeof expenseFormSchema>;
export type PaymentForm = z.infer<ReturnType<typeof makePaymentSchema>>;

export type Expense = ExpenseForm & { id: string };
export type Payment = PaymentForm & { id: string; expenseId: string };
export type ExpenseSummary = Expense & { paid: number; remaining: number };

export const defaultExpenseForm: ExpenseForm = { title: '', totalAmount: 0 };
export const defaultPaymentForm = (): PaymentForm => ({ amount: 0, paidOn: new Date(), mode: 'cash' });

export const toExpenseFormValues = ({ id: _id, title, totalAmount }: Expense): ExpenseForm => ({ title, totalAmount });
export const toPaymentFormValues = ({ amount, paidOn, mode }: Payment): PaymentForm => ({ amount, paidOn, mode });

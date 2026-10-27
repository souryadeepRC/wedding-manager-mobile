import { ID, Permission, Query, Role, type Models } from 'react-native-appwrite';
import { tablesDB } from '@/lib/appwrite';
import { config } from '@/lib/config';
import type { Expense, ExpenseForm, Payment, PaymentForm } from './expense.schema';

const PAGE = 100;
const expensesTable = { databaseId: config.databaseId, tableId: config.tables.expenses };
const paymentsTable = { databaseId: config.databaseId, tableId: config.tables.payments };

type ExpenseRow = Models.Row & ExpenseForm & { weddingId: string };
type PaymentRow = Models.Row & Omit<PaymentForm, 'paidOn'> & { weddingId: string; expenseId: string; paidOn: string };

const toExpense = (r: ExpenseRow): Expense => ({ id: r.$id, title: r.title, totalAmount: r.totalAmount });
const toPayment = (r: PaymentRow): Payment => ({
  id: r.$id,
  expenseId: r.expenseId,
  amount: r.amount,
  paidOn: new Date(r.paidOn),
  mode: r.mode,
});

const owner = (uid: string) => [
  Permission.read(Role.user(uid)),
  Permission.update(Role.user(uid)),
  Permission.delete(Role.user(uid)),
];

async function listAll<R extends Models.Row>(table: typeof expensesTable, filters: string[]): Promise<R[]> {
  const rows: R[] = [];
  let cursor: string | undefined;
  for (;;) {
    const page = await tablesDB.listRows<R>({
      ...table,
      queries: [...filters, Query.limit(PAGE), ...(cursor ? [Query.cursorAfter(cursor)] : [])],
    });
    rows.push(...page.rows);
    if (page.rows.length < PAGE) return rows;
    cursor = page.rows[page.rows.length - 1].$id;
  }
}

export const paymentService = {
  async listAll(weddingId: string): Promise<Payment[]> {
    const rows = await listAll<PaymentRow>(paymentsTable, [
      Query.equal('weddingId', weddingId),
      Query.orderDesc('paidOn'),
    ]);
    return rows.map(toPayment);
  },

  async create(uid: string, weddingId: string, expenseId: string, input: PaymentForm): Promise<Payment> {
    const row = await tablesDB.createRow<PaymentRow>({
      ...paymentsTable,
      rowId: ID.unique(),
      data: { ...input, paidOn: input.paidOn.toISOString(), weddingId, expenseId },
      permissions: owner(uid),
    });
    return toPayment(row);
  },

  async update(id: string, input: PaymentForm): Promise<Payment> {
    const row = await tablesDB.updateRow<PaymentRow>({
      ...paymentsTable,
      rowId: id,
      data: { ...input, paidOn: input.paidOn.toISOString() },
    });
    return toPayment(row);
  },

  async remove(id: string): Promise<void> {
    await tablesDB.deleteRow({ ...paymentsTable, rowId: id });
  },
};

export const expenseService = {
  async list(weddingId: string): Promise<Expense[]> {
    const rows = await listAll<ExpenseRow>(expensesTable, [
      Query.equal('weddingId', weddingId),
      Query.orderDesc('$createdAt'),
    ]);
    return rows.map(toExpense);
  },

  async create(uid: string, weddingId: string, input: ExpenseForm): Promise<Expense> {
    const row = await tablesDB.createRow<ExpenseRow>({
      ...expensesTable,
      rowId: ID.unique(),
      data: { ...input, weddingId },
      permissions: owner(uid),
    });
    return toExpense(row);
  },

  async update(id: string, input: ExpenseForm): Promise<Expense> {
    return toExpense(await tablesDB.updateRow<ExpenseRow>({ ...expensesTable, rowId: id, data: input }));
  },

  // Payments belong to the expense, so they go with it.
  async remove(id: string): Promise<void> {
    const payments = await listAll<PaymentRow>(paymentsTable, [Query.equal('expenseId', id)]);
    await Promise.all(payments.map(p => paymentService.remove(p.$id)));
    await tablesDB.deleteRow({ ...expensesTable, rowId: id });
  },
};

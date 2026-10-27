import { ID, Permission, Query, Role, type Models } from 'react-native-appwrite';
import { tablesDB } from '@/lib/appwrite';
import { config } from '@/lib/config';
import type { ChecklistForm, ChecklistItem, ChecklistStatus } from './checklist.schema';

const PAGE = 100;
const base = { databaseId: config.databaseId, tableId: config.tables.checklist };

type ChecklistRow = Models.Row & Omit<ChecklistForm, 'dueDate'> & { weddingId: string; dueDate?: string | null };

const toItem = (r: ChecklistRow): ChecklistItem => ({
  id: r.$id,
  title: r.title,
  dueDate: r.dueDate ? new Date(r.dueDate) : null,
  status: r.status,
});

const toData = (input: ChecklistForm) => ({ ...input, dueDate: input.dueDate ? input.dueDate.toISOString() : null });

export const checklistService = {
  async list(weddingId: string): Promise<ChecklistItem[]> {
    const items: ChecklistItem[] = [];
    let cursor: string | undefined;
    for (;;) {
      const { rows } = await tablesDB.listRows<ChecklistRow>({
        ...base,
        queries: [
          Query.equal('weddingId', weddingId),
          Query.orderDesc('$createdAt'),
          Query.limit(PAGE),
          ...(cursor ? [Query.cursorAfter(cursor)] : []),
        ],
      });
      items.push(...rows.map(toItem));
      if (rows.length < PAGE) return items;
      cursor = rows[rows.length - 1].$id;
    }
  },

  async create(uid: string, weddingId: string, input: ChecklistForm): Promise<ChecklistItem> {
    const row = await tablesDB.createRow<ChecklistRow>({
      ...base,
      rowId: ID.unique(),
      data: { ...toData(input), weddingId },
      permissions: [
        Permission.read(Role.user(uid)),
        Permission.update(Role.user(uid)),
        Permission.delete(Role.user(uid)),
      ],
    });
    return toItem(row);
  },

  async update(id: string, input: ChecklistForm): Promise<ChecklistItem> {
    return toItem(await tablesDB.updateRow<ChecklistRow>({ ...base, rowId: id, data: toData(input) }));
  },

  async setStatus(id: string, status: ChecklistStatus): Promise<ChecklistItem> {
    return toItem(await tablesDB.updateRow<ChecklistRow>({ ...base, rowId: id, data: { status } }));
  },

  async remove(id: string): Promise<void> {
    await tablesDB.deleteRow({ ...base, rowId: id });
  },
};

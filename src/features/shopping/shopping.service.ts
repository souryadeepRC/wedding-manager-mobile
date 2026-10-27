import { ID, Permission, Query, Role, type Models } from 'react-native-appwrite';
import { tablesDB } from '@/lib/appwrite';
import { config } from '@/lib/config';
import type { ShoppingForm, ShoppingItem, ShoppingStatus } from './shopping.schema';

const PAGE = 100;
const base = { databaseId: config.databaseId, tableId: config.tables.shopping };

type ShoppingRow = Models.Row & ShoppingForm & { weddingId: string };

const toItem = (r: ShoppingRow): ShoppingItem => ({ id: r.$id, title: r.title, itemFor: r.itemFor, status: r.status });

export const shoppingService = {
  async list(weddingId: string): Promise<ShoppingItem[]> {
    const items: ShoppingItem[] = [];
    let cursor: string | undefined;
    for (;;) {
      const { rows } = await tablesDB.listRows<ShoppingRow>({
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

  async create(uid: string, weddingId: string, input: ShoppingForm): Promise<ShoppingItem> {
    const row = await tablesDB.createRow<ShoppingRow>({
      ...base,
      rowId: ID.unique(),
      data: { ...input, weddingId },
      permissions: [
        Permission.read(Role.user(uid)),
        Permission.update(Role.user(uid)),
        Permission.delete(Role.user(uid)),
      ],
    });
    return toItem(row);
  },

  async update(id: string, input: ShoppingForm): Promise<ShoppingItem> {
    return toItem(await tablesDB.updateRow<ShoppingRow>({ ...base, rowId: id, data: input }));
  },

  async setStatus(id: string, status: ShoppingStatus): Promise<ShoppingItem> {
    return toItem(await tablesDB.updateRow<ShoppingRow>({ ...base, rowId: id, data: { status } }));
  },

  async remove(id: string): Promise<void> {
    await tablesDB.deleteRow({ ...base, rowId: id });
  },
};

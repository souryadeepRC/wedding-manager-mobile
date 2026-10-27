import { ID, Permission, Query, Role, type Models } from 'react-native-appwrite';
import { tablesDB } from '@/lib/appwrite';
import { config } from '@/lib/config';
import type { Guest, GuestForm } from './guest.schema';

const PAGE = 100;
const base = { databaseId: config.databaseId, tableId: config.tables.guests };

type GuestRow = Models.Row & Omit<GuestForm, 'notes'> & { weddingId: string; notes?: string | null };

const toGuest = (r: GuestRow): Guest => ({
  id: r.$id,
  title: r.title,
  connection: r.connection,
  eventType: r.eventType,
  guestCount: r.guestCount,
  inviteSent: r.inviteSent,
  status: r.status,
  notes: r.notes ?? '',
});

export type GuestStats = { totalGuests: number; confirmed: number };

export const guestService = {
  async list(weddingId: string): Promise<Guest[]> {
    const guests: Guest[] = [];
    let cursor: string | undefined;
    for (;;) {
      const { rows } = await tablesDB.listRows<GuestRow>({
        ...base,
        queries: [
          Query.equal('weddingId', weddingId),
          Query.orderDesc('$createdAt'),
          Query.limit(PAGE),
          ...(cursor ? [Query.cursorAfter(cursor)] : []),
        ],
      });
      guests.push(...rows.map(toGuest));
      if (rows.length < PAGE) return guests;
      cursor = rows[rows.length - 1].$id;
    }
  },

  async get(id: string): Promise<Guest> {
    return toGuest(await tablesDB.getRow<GuestRow>({ ...base, rowId: id }));
  },

  async create(uid: string, weddingId: string, input: GuestForm): Promise<Guest> {
    const row = await tablesDB.createRow<GuestRow>({
      ...base,
      rowId: ID.unique(),
      data: { ...input, weddingId },
      permissions: [
        Permission.read(Role.user(uid)),
        Permission.update(Role.user(uid)),
        Permission.delete(Role.user(uid)),
      ],
    });
    return toGuest(row);
  },

  async update(id: string, input: GuestForm): Promise<Guest> {
    return toGuest(await tablesDB.updateRow<GuestRow>({ ...base, rowId: id, data: input }));
  },

  async remove(id: string): Promise<void> {
    await tablesDB.deleteRow({ ...base, rowId: id });
  },

  async getStats(weddingId: string): Promise<GuestStats> {
    const stats: GuestStats = { totalGuests: 0, confirmed: 0 };
    let cursor: string | undefined;
    for (;;) {
      const queries = [
        Query.equal('weddingId', weddingId),
        Query.select(['guestCount', 'status']),
        Query.limit(PAGE),
        ...(cursor ? [Query.cursorAfter(cursor)] : []),
      ];
      const { rows } = await tablesDB.listRows({
        databaseId: config.databaseId,
        tableId: config.tables.guests,
        queries,
      });
      for (const r of rows) {
        const n = Number(r.guestCount) || 0;
        stats.totalGuests += n;
        if (r.status === 'confirmed') stats.confirmed += n;
      }
      if (rows.length < PAGE) return stats;
      cursor = rows[rows.length - 1].$id;
    }
  },
};

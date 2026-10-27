import { ID, Permission, Role, type Models } from 'react-native-appwrite';
import { tablesDB } from '@/lib/appwrite';
import { config } from '@/lib/config';
import { fromStoredDate, toStoredDate } from '@/utils/date';
import type { Wedding, WeddingForm } from './wedding.schema';

const base = { databaseId: config.databaseId, tableId: config.tables.weddings };

type WeddingRow = Models.Row & {
  brideName?: string | null;
  groomName?: string | null;
  weddingDate?: string | null;
  receptionDate?: string | null;
};

const toWedding = (r: WeddingRow): Wedding => ({
  id: r.$id,
  brideName: r.brideName ?? '',
  groomName: r.groomName ?? '',
  weddingDate: fromStoredDate(r.weddingDate),
  receptionDate: fromStoredDate(r.receptionDate),
});

const toData = (input: WeddingForm) => ({
  brideName: input.brideName,
  groomName: input.groomName,
  weddingDate: input.weddingDate ? toStoredDate(input.weddingDate) : null,
  receptionDate: input.receptionDate ? toStoredDate(input.receptionDate) : null,
});

export const weddingService = {
  // Called once, on the first save. Later saves go through update().
  async create(uid: string, input: WeddingForm): Promise<Wedding> {
    const row = await tablesDB.createRow<WeddingRow>({
      ...base,
      rowId: ID.unique(),
      data: toData(input),
      permissions: [
        Permission.read(Role.user(uid)),
        Permission.update(Role.user(uid)),
        Permission.delete(Role.user(uid)),
      ],
    });
    return toWedding(row);
  },

  async get(id: string): Promise<Wedding> {
    return toWedding(await tablesDB.getRow<WeddingRow>({ ...base, rowId: id }));
  },

  async update(id: string, input: WeddingForm): Promise<Wedding> {
    const row = await tablesDB.updateRow<WeddingRow>({
      ...base,
      rowId: id,
      data: toData(input),
    });
    return toWedding(row);
  },
};

import { z } from 'zod';
import { ITEM_FOR, SHOPPING_STATUS, TITLE_MAX } from './shopping.constants';

const values = <T extends readonly { value: string }[]>(list: T) =>
  list.map(i => i.value) as [T[number]['value'], ...T[number]['value'][]];

export const shoppingFormSchema = z.object({
  title: z.string().trim().min(1, 'Enter what to buy').max(TITLE_MAX, `Up to ${TITLE_MAX} characters`),
  itemFor: z.enum(values(ITEM_FOR)),
  status: z.enum(values(SHOPPING_STATUS)),
});

export type ShoppingForm = z.infer<typeof shoppingFormSchema>;
export type ShoppingItem = ShoppingForm & { id: string };
export type ShoppingStatus = ShoppingForm['status'];

export const defaultShoppingForm: ShoppingForm = { title: '', itemFor: 'mother', status: 'pending' };

export const toShoppingFormValues = ({ id: _id, ...form }: ShoppingItem): ShoppingForm => form;

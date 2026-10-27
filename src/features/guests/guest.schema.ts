import { z } from 'zod';
import { EVENT_TYPES, GUEST_COUNT, GUEST_RELATION, GUEST_STATUS, NOTES_MAX, TITLE_MAX } from './guest.constants';

const values = <T extends readonly { value: string }[]>(list: T) =>
  list.map(i => i.value) as [T[number]['value'], ...T[number]['value'][]];

export const guestFormSchema = z.object({
  title: z.string().trim().min(1, 'Enter a name or title').max(TITLE_MAX, `Up to ${TITLE_MAX} characters`),
  connection: z.enum(values(GUEST_RELATION)),
  eventType: z.enum(values(EVENT_TYPES)),
  guestCount: z.number().int().min(GUEST_COUNT.min, 'At least 1 guest').max(GUEST_COUNT.max, `Up to ${GUEST_COUNT.max} guests`),
  inviteSent: z.boolean(),
  status: z.enum(values(GUEST_STATUS)),
  notes: z.string().trim().max(NOTES_MAX, `Up to ${NOTES_MAX} characters`),
});

export type GuestForm = z.infer<typeof guestFormSchema>;
export type Guest = GuestForm & { id: string };

export const defaultGuestForm: GuestForm = {
  title: '',
  connection: 'relative',
  eventType: 'wedding',
  guestCount: 1,
  inviteSent: false,
  status: 'waiting',
  notes: '',
};

export const toGuestFormValues = ({ id: _id, ...form }: Guest): GuestForm => form;

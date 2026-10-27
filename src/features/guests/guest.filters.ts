import { GUEST_RELATION, GUEST_STATUS } from './guest.constants';
import type { Guest } from './guest.schema';

export type InviteFilter = 'any' | 'yes' | 'no';

export type GuestFilters = {
  connections: string[];
  statuses: string[];
  invite: InviteFilter;
};

export const emptyFilters: GuestFilters = { connections: [], statuses: [], invite: 'any' };

export const activeFilterCount = (f: GuestFilters) =>
  (f.connections.length ? 1 : 0) + (f.statuses.length ? 1 : 0) + (f.invite !== 'any' ? 1 : 0);

export function filterGuests(guests: Guest[], search: string, f: GuestFilters): Guest[] {
  const q = search.trim().toLowerCase();
  return guests.filter(g =>
    (!q || g.title.toLowerCase().includes(q)) &&
    (!f.connections.length || f.connections.includes(g.connection)) &&
    (!f.statuses.length || f.statuses.includes(g.status)) &&
    (f.invite === 'any' || g.inviteSent === (f.invite === 'yes')),
  );
}

const plural = (label: string) => (label.endsWith('s') ? label : `${label}s`);

// Explains an empty result, e.g. Nobody called “Gupta” among Relatives who've Confirmed.
export function describeNoMatch(search: string, f: GuestFilters): string {
  const q = search.trim();
  const who = GUEST_RELATION.filter(r => f.connections.includes(r.value)).map(r => plural(r.label));
  const status = GUEST_STATUS.filter(s => f.statuses.includes(s.value))
    .map(s => (s.value === 'waiting' ? 'who are still Waiting' : `who've ${s.label}`));
  let text = q ? `Nobody called “${q}”` : 'Nobody';
  if (who.length) text += ` among ${who.join(' or ')}`;
  if (status.length) text += ` ${status.join(' or ')}`;
  if (f.invite !== 'any') text += f.invite === 'yes' ? ' with an invite sent' : ' without an invite yet';
  return `${text}.`;
}

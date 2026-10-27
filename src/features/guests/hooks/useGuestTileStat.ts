import { useGuestStats } from './useGuestStats';

export function useGuestTileStat(): string | undefined {
  const { data } = useGuestStats();
  if (!data) return undefined;
  if (data.totalGuests === 0) return 'No guests yet';
  return `${data.totalGuests} guests · ${data.confirmed} confirmed`;
}

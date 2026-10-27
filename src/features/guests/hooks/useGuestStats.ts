import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/store/appStore';
import { guestService } from '../guest.service';

export function useGuestStats() {
  const weddingId = useAppStore(s => s.currentWeddingId);
  return useQuery({
    queryKey: ['guests', 'stats', weddingId],
    queryFn: () => guestService.getStats(weddingId!),
    enabled: !!weddingId,
  });
}

import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/store/appStore';
import { guestService } from '../guest.service';

export function useGuests() {
  const weddingId = useAppStore(s => s.currentWeddingId);
  return useQuery({
    queryKey: ['guests', 'list', weddingId],
    queryFn: () => guestService.list(weddingId!),
    enabled: !!weddingId,
  });
}

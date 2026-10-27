import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/store/appStore';
import { weddingService } from '../wedding.service';
import type { Wedding } from '../wedding.schema';

// Shown until the first save creates the wedding row.
const emptyWedding: Wedding = {
  id: '', brideName: '', groomName: '', weddingDate: null, receptionDate: null,
};

export function useWedding() {
  const weddingId = useAppStore(s => s.currentWeddingId);
  return useQuery({
    queryKey: ['wedding', weddingId],
    queryFn: () => (weddingId ? weddingService.get(weddingId) : emptyWedding),
  });
}

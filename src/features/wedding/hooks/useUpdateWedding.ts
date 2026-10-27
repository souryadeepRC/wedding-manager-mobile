import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ensureSession } from '@/lib/session';
import { useAppStore } from '@/store/appStore';
import { weddingService } from '../wedding.service';
import type { WeddingForm } from '../wedding.schema';

// First save creates the row and caches its id; every later save updates that row.
export function useUpdateWedding() {
  const qc = useQueryClient();
  const setCurrentWeddingId = useAppStore(s => s.setCurrentWeddingId);
  return useMutation({
    mutationFn: async (input: WeddingForm) => {
      const weddingId = useAppStore.getState().currentWeddingId;
      if (weddingId) return weddingService.update(weddingId, input);
      return weddingService.create(await ensureSession(), input);
    },
    onSuccess: row => {
      qc.setQueryData(['wedding', row.id], row);
      setCurrentWeddingId(row.id);
      qc.invalidateQueries({ queryKey: ['wedding'] });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ensureSession } from '@/lib/session';
import { useAppStore } from '@/store/appStore';
import { guestService } from '../guest.service';
import type { GuestForm } from '../guest.schema';

// Every mutation refreshes the list, detail and home stats (all under the 'guests' key).
function useInvalidateGuests() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ['guests'] });
}

export function useCreateGuest() {
  const invalidate = useInvalidateGuests();
  return useMutation({
    mutationFn: async (input: GuestForm) => {
      const weddingId = useAppStore.getState().currentWeddingId;
      if (!weddingId) throw new Error('Save your wedding details in Settings first.');
      return guestService.create(await ensureSession(), weddingId, input);
    },
    onSuccess: invalidate,
  });
}

export function useUpdateGuest(id: string) {
  const invalidate = useInvalidateGuests();
  return useMutation({
    mutationFn: (input: GuestForm) => guestService.update(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteGuest(id: string) {
  const invalidate = useInvalidateGuests();
  return useMutation({
    mutationFn: () => guestService.remove(id),
    onSuccess: invalidate,
  });
}

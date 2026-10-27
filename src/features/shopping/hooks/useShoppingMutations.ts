import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ensureSession } from '@/lib/session';
import { useAppStore } from '@/store/appStore';
import { shoppingService } from '../shopping.service';
import type { ShoppingForm, ShoppingStatus } from '../shopping.schema';

// Every mutation refreshes the list and the Home tile (all under the 'shopping' key).
function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ['shopping'] });
}

export function useCreateShopping() {
  const onSuccess = useInvalidate();
  return useMutation({
    mutationFn: async (input: ShoppingForm) => {
      const weddingId = useAppStore.getState().currentWeddingId;
      if (!weddingId) throw new Error('Save your wedding details in Settings first.');
      return shoppingService.create(await ensureSession(), weddingId, input);
    },
    onSuccess,
  });
}

export function useUpdateShopping(id: string) {
  const onSuccess = useInvalidate();
  return useMutation({ mutationFn: (input: ShoppingForm) => shoppingService.update(id, input), onSuccess });
}

export function useSetShoppingStatus() {
  const onSuccess = useInvalidate();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ShoppingStatus }) => shoppingService.setStatus(id, status),
    onSuccess,
  });
}

export function useDeleteShopping(id: string) {
  const onSuccess = useInvalidate();
  return useMutation({ mutationFn: () => shoppingService.remove(id), onSuccess });
}

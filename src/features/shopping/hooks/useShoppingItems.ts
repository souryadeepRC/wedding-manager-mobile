import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/store/appStore';
import { shoppingService } from '../shopping.service';

export function useShoppingItems() {
  const weddingId = useAppStore(s => s.currentWeddingId);
  return useQuery({
    queryKey: ['shopping', 'list', weddingId],
    queryFn: () => shoppingService.list(weddingId!),
    enabled: !!weddingId,
  });
}

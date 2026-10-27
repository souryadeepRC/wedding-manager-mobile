import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/store/appStore';
import { checklistService } from '../checklist.service';

export function useChecklistItems() {
  const weddingId = useAppStore(s => s.currentWeddingId);
  return useQuery({
    queryKey: ['checklist', 'list', weddingId],
    queryFn: () => checklistService.list(weddingId!),
    enabled: !!weddingId,
  });
}

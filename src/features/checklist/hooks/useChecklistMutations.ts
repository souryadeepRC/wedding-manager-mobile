import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ensureSession } from '@/lib/session';
import { useAppStore } from '@/store/appStore';
import { checklistService } from '../checklist.service';
import type { ChecklistForm, ChecklistStatus } from '../checklist.schema';

// Every mutation refreshes the list and the Home tile (all under the 'checklist' key).
function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ['checklist'] });
}

export function useCreateChecklist() {
  const onSuccess = useInvalidate();
  return useMutation({
    mutationFn: async (input: ChecklistForm) => {
      const weddingId = useAppStore.getState().currentWeddingId;
      if (!weddingId) throw new Error('Save your wedding details in Settings first.');
      return checklistService.create(await ensureSession(), weddingId, input);
    },
    onSuccess,
  });
}

export function useUpdateChecklist(id: string) {
  const onSuccess = useInvalidate();
  return useMutation({ mutationFn: (input: ChecklistForm) => checklistService.update(id, input), onSuccess });
}

export function useSetChecklistStatus() {
  const onSuccess = useInvalidate();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ChecklistStatus }) => checklistService.setStatus(id, status),
    onSuccess,
  });
}

export function useDeleteChecklist(id: string) {
  const onSuccess = useInvalidate();
  return useMutation({ mutationFn: () => checklistService.remove(id), onSuccess });
}

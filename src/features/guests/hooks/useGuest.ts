import { useQuery } from '@tanstack/react-query';
import { guestService } from '../guest.service';

export function useGuest(id: string) {
  return useQuery({
    queryKey: ['guests', 'detail', id],
    queryFn: () => guestService.get(id),
  });
}

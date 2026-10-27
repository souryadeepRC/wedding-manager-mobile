import { useChecklistItems } from './useChecklistItems';

export function useChecklistTileStat(): string | undefined {
  const { data } = useChecklistItems();
  if (!data) return undefined;
  if (!data.length) return 'No tasks yet';
  const pending = data.filter(i => i.status === 'pending').length;
  return `${pending} pending · ${data.length - pending} done`;
}

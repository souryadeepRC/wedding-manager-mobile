import { useShoppingItems } from './useShoppingItems';

export function useShoppingTileStat(): string | undefined {
  const { data } = useShoppingItems();
  if (!data) return undefined;
  if (!data.length) return 'No items yet';
  const pending = data.filter(i => i.status === 'pending').length;
  return `${pending} pending · ${data.length - pending} done`;
}

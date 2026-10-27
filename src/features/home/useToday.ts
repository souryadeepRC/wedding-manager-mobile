import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

// Re-evaluates "today" when the app returns to the foreground so the countdown stays correct after midnight.
export function useToday(): Date {
  const [today, setToday] = useState(() => new Date());
  useEffect(() => {
    const sub = AppState.addEventListener('change', s => {
      if (s === 'active') setToday(new Date());
    });
    return () => sub.remove();
  }, []);
  return today;
}

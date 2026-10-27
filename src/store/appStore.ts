import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { defaultThemeName, isThemeName, type ThemeName } from '@/theme/theme';

type AppState = {
  currentWeddingId: string | null;
  themeName: ThemeName;
  setCurrentWeddingId: (id: string | null) => void;
  setThemeName: (name: ThemeName) => void;
};

// Persisted so the wedding row id survives app restarts.
export const useAppStore = create<AppState>()(
  persist(
    set => ({
      currentWeddingId: null,
      themeName: defaultThemeName,
      setCurrentWeddingId: currentWeddingId => set({ currentWeddingId }),
      setThemeName: themeName => set({ themeName }),
    }),
    {
      name: 'wedding-manager-app',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      // v0 stored the old palette names (classic_beige, sage_garden).
      migrate: persisted => {
        const state = persisted as Partial<AppState>;
        return { ...state, themeName: isThemeName(state.themeName) ? state.themeName : defaultThemeName } as AppState;
      },
    },
  ),
);

export function waitForStoreHydration(): Promise<void> {
  if (useAppStore.persist.hasHydrated()) return Promise.resolve();
  return new Promise(resolve => {
    useAppStore.persist.onFinishHydration(() => resolve());
  });
}

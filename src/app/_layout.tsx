import { useCallback, useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { AppwriteException } from 'react-native-appwrite';
import { QueryClientProvider } from '@tanstack/react-query';
import { Fraunces_700Bold, Fraunces_800ExtraBold } from '@expo-google-fonts/fraunces';
import {
  PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold, useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { ErrorState, Screen, ToastProvider } from '@/components';
import { weddingService } from '@/features/wedding';
import { queryClient } from '@/lib/queryClient';
import { ensureSession } from '@/lib/session';
import { useAppStore, waitForStoreHydration } from '@/store/appStore';
import { ThemeProvider } from '@/theme';

SplashScreen.preventAutoHideAsync();

type Boot = 'loading' | 'ready' | 'error';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold, Fraunces_700Bold, Fraunces_800ExtraBold,
  });
  const [boot, setBoot] = useState<Boot>('loading');
  const [bootError, setBootError] = useState('');

  const bootstrap = useCallback(async () => {
    try {
      await ensureSession();
      await waitForStoreHydration();
      const { currentWeddingId, setCurrentWeddingId } = useAppStore.getState();
      if (currentWeddingId) {
        try {
          const wedding = await weddingService.get(currentWeddingId);
          queryClient.setQueryData(['wedding', wedding.id], wedding);
        } catch (e) {
          // Row gone or not ours (e.g. new anonymous session): forget it and start fresh.
          if (e instanceof AppwriteException && (e.code === 404 || e.code === 401 || e.code === 403)) {
            setCurrentWeddingId(null);
          } else {
            throw e;
          }
        }
      }
      setBoot('ready');
    } catch (e) {
      console.warn('Bootstrap failed', e);
      setBootError(e instanceof Error ? e.message : String(e));
      setBoot('error');
    }
  }, []);

  useEffect(() => {
    // bootstrap sets state only after awaiting, never synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    bootstrap();
  }, [bootstrap]);

  const retry = () => {
    setBoot('loading');
    bootstrap();
  };

  useEffect(() => {
    if (fontsLoaded && boot !== 'loading') SplashScreen.hideAsync();
  }, [fontsLoaded, boot]);

  if (!fontsLoaded || boot === 'loading') return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          {boot === 'error' ? (
            <Screen>
              <ErrorState message={`Could not start the app. Check your connection.${__DEV__ ? `\n\n${bootError}` : ''}`} onRetry={retry} />
            </Screen>
          ) : (
            // Tabs live in (app); Shopping and Checklist are pushed on top, reachable only from Home.
            <Stack screenOptions={{ headerShown: false }} />
          )}
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

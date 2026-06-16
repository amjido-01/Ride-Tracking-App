import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as NativeSplashScreen from 'expo-splash-screen';
import { useEffect, useState, useCallback } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { RideProvider } from '@/context/ride-context';
import { SplashScreen } from '@/components/ui/splash-screen';

// Keep the native splash screen visible while we load resources
NativeSplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appReady, setAppReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await NativeSplashScreen.hideAsync();

        await new Promise((resolve) => setTimeout(resolve, 2000));
      } finally {
        setAppReady(true);
      }
    }

    prepare();
  }, []);

  const handleSplashFinish = useCallback(() => {
    setSplashDone(true);
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RideProvider>
        <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="completed" options={{ animation: 'slide_from_bottom' }} />
        </Stack>
      </RideProvider>
      <StatusBar style="auto" />

      {/* Custom animated splash screen overlay */}
      {!splashDone && (
        <SplashScreen isReady={appReady} onFinish={handleSplashFinish} />
      )}
    </ThemeProvider>
  );
}

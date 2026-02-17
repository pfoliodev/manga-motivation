import CustomSplashScreen from '@/components/SplashScreen';
import { PowerLevelProvider } from '@/context/PowerLevelContext';
import { Bangers_400Regular } from '@expo-google-fonts/bangers';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';
import { AuthProvider } from '../src/context/AuthContext';
import { FavoritesProvider } from '../src/context/FavoritesContext';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Bangers_400Regular,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}


function RootLayoutNav() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <CustomSplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={DarkTheme}>
        <AuthProvider>
          <PowerLevelProvider>
            <FavoritesProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="category/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="paywall" options={{ presentation: 'modal', headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
              </Stack>
            </FavoritesProvider>
          </PowerLevelProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

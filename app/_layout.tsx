import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { MealsProvider } from '../data/MealsContext';
import { FoodsProvider } from '../data/FoodsContext';
import { ErrorProvider, useError } from '../data/ErrorContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ErrorBanner from '../components/ErrorBanner';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function AppShell({ children }: { children: React.ReactNode }) {
  const { storageError, setStorageError } = useError();

  useEffect(() => {
    Notifications.requestPermissionsAsync().then(({ status }) => {
      if (status !== 'granted') {
        console.log('Notification permissions denied — notifications will not show');
      }
    });
  }, []);

  return (
    <>
      {children}
      <ErrorBanner message={storageError} onDismiss={() => setStorageError(null)} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ErrorProvider>
      <AppShell>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <FoodsProvider>
            <MealsProvider>
              <SafeAreaProvider>
                <Stack
                  screenOptions={{
                    headerStyle: { backgroundColor: '#111' },
                    headerTitleStyle: { fontWeight: 'bold', color: '#f0f0f0' },
                    headerTintColor: '#f0f0f0',
                  }}
                >
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
              </SafeAreaProvider>
            </MealsProvider>
          </FoodsProvider>
        </GestureHandlerRootView>
      </AppShell>
    </ErrorProvider>
  );
}

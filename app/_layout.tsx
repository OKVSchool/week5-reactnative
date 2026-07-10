import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MealsProvider } from '../data/MealsContext';
import { FoodsProvider } from '../data/FoodsContext';
import { ErrorProvider, useError } from '../data/ErrorContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ErrorBanner from '../components/ErrorBanner';

function AppShell({ children }: { children: React.ReactNode }) {
  const { storageError, setStorageError } = useError();
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
                    headerStyle: { backgroundColor: '#fff' },
                    headerTitleStyle: { fontWeight: 'bold' },
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

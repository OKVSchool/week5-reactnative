import { Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scheduleInactivityReminder, scheduleDailyReminder } from '../../utils/notifications';
import { useError } from '../../data/ErrorContext';

export default function DevToolsScreen() {
  const { setStorageError } = useError();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>DevTools</Text>

        <Text style={styles.section}>Notifications</Text>
        <Pressable
          style={({ pressed }) => [styles.btn, pressed && styles.btnGreen]}
          onPress={() => scheduleInactivityReminder()}
        >
          {({ pressed }) => (
            <Text style={[styles.btnText, pressed && styles.btnTextWhite]}>TestINACTIVITY</Text>
          )}
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.btn, pressed && styles.btnGreen]}
          onPress={() => scheduleDailyReminder()}
        >
          {({ pressed }) => (
            <Text style={[styles.btnText, pressed && styles.btnTextWhite]}>TestDAILY</Text>
          )}
        </Pressable>

        <Text style={styles.section}>Error Banners</Text>
        <Pressable
          style={({ pressed }) => [styles.btn, styles.errBtn, pressed && styles.btnRed]}
          onPress={() => setStorageError('Save Error. Re-enter meal')}
        >
          {({ pressed }) => (
            <Text style={[styles.btnText, pressed && styles.btnTextWhite]}>Trigger: Meal Save Error</Text>
          )}
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.btn, styles.errBtn, pressed && styles.btnRed]}
          onPress={() => setStorageError('Save Error. Re-enter food data')}
        >
          {({ pressed }) => (
            <Text style={[styles.btnText, pressed && styles.btnTextWhite]}>Trigger: Food Save Error</Text>
          )}
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#0f0f0f' },
  scroll:       { paddingHorizontal: 16, paddingBottom: 40 },
  heading:      { fontSize: 24, fontWeight: 'bold', marginTop: 16, marginBottom: 24, color: '#f0f0f0' },
  section:      { fontSize: 13, fontWeight: '600', color: '#555', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginTop: 16 },
  btn:          { borderWidth: 1, borderColor: '#2a2a2a', borderRadius: 8, minHeight: 50, justifyContent: 'center', paddingHorizontal: 16, marginBottom: 8, backgroundColor: '#1a1a1a' },
  errBtn:       { borderColor: '#ef4444' },
  btnGreen:     { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  btnRed:       { backgroundColor: '#ef4444', borderColor: '#ef4444' },
  btnText:      { fontSize: 15, color: '#f0f0f0' },
  btnTextWhite: { color: '#fff' },
});

import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
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
        <Pressable style={styles.btn} onPress={() => scheduleInactivityReminder()}>
          <Text style={styles.btnText}>TestINACTIVITY</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={() => scheduleDailyReminder()}>
          <Text style={styles.btnText}>TestDAILY</Text>
        </Pressable>

        <Text style={styles.section}>Error Banners</Text>
        <Pressable style={[styles.btn, styles.errBtn]} onPress={() => setStorageError('Save Error. Re-enter meal')}>
          <Text style={styles.btnText}>Trigger: Meal Save Error</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.errBtn]} onPress={() => setStorageError('Save Error. Re-enter food data')}>
          <Text style={styles.btnText}>Trigger: Food Save Error</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll:    { paddingHorizontal: 16, paddingBottom: 40 },
  heading:   { fontSize: 24, fontWeight: 'bold', marginTop: 16, marginBottom: 24 },
  section:   { fontSize: 13, fontWeight: '600', color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginTop: 16 },
  btn:       { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, minHeight: 50, justifyContent: 'center', paddingHorizontal: 16, marginBottom: 8 },
  errBtn:    { borderColor: '#FF3B30' },
  btnText:   { fontSize: 15, color: '#333' },
});

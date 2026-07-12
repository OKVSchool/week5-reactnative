import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = { message: string | null; onDismiss: () => void };

export default function ErrorBanner({ message, onDismiss }: Props) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [message]);

  if (!message) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: '#D32F2F', paddingVertical: 10, paddingHorizontal: 16, position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 999 },
  text:   { color: '#fff', fontSize: 13, fontWeight: '600' },
});

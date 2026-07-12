import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useFoods } from '../../data/FoodsContext';

// PLACEHOLDER — delete this function and replace with real usage data later
const makePlaceholder = (id: string) =>
  Array.from({ length: 30 }, (_, i) => (i * 13 + id.length) % 3 === 0);

export default function FoodDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { foods } = useFoods();
  const food = foods.find(f => f.id === id);

  if (!food) return <View style={styles.container}><Text>Food not found.</Text></View>;

  const placeholderDays = makePlaceholder(id);

  return (
    <>
      <Stack.Screen options={{ title: food.name }} />
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>{food.name}</Text>
        <View style={styles.nutrition}>
          <Text style={styles.stat}>{food.calories} kcal</Text>
          <Text style={styles.stat}>{food.protein}g Protein</Text>
          <Text style={styles.stat}>{food.fat}g Fat</Text>
          <Text style={styles.stat}>{food.carbs}g Carbs</Text>
        </View>
        <Text style={styles.gridLabel}>30-Day Usage</Text>
        <Text style={styles.placeholderNote}>— placeholder data —</Text>
        <View style={styles.grid}>
          {placeholderDays.map((used, i) => (
            <View key={i} style={[styles.square, used && styles.squareFilled]} />
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, padding: 20, backgroundColor: '#0f0f0f' },
  heading:         { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#f0f0f0' },
  nutrition:       { backgroundColor: '#1a1a1a', borderRadius: 10, padding: 16, gap: 8, borderWidth: 1, borderColor: '#2a2a2a', marginBottom: 24 },
  stat:            { fontSize: 16, color: '#f0f0f0' },
  gridLabel:       { fontSize: 18, fontWeight: '700', marginBottom: 4, color: '#f0f0f0' },
  placeholderNote: { fontSize: 12, color: '#555', marginBottom: 12 },
  grid:            { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  square:          { width: 28, height: 28, borderRadius: 4, backgroundColor: '#2a2a2a' },
  squareFilled:    { backgroundColor: '#6366f1' },
});

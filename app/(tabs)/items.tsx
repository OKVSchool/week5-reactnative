import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMeals } from '../../data/MealsContext';
import { Meal } from '../../data/meals';

type ListHeader = { type: 'header'; id: string; date: string };
type ListMeal   = { type: 'meal' } & Meal;
type ListItem   = ListHeader | ListMeal;

function buildListData(meals: Meal[]): ListItem[] {
  const grouped = meals.reduce<Record<string, Meal[]>>((acc, meal) => {
    (acc[meal.date] ??= []).push(meal);
    return acc;
  }, {});
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
  const items: ListItem[] = [];
  for (const date of dates) {
    items.push({ type: 'header', id: `header-${date}`, date });
    for (const meal of grouped[date]) {
      items.push({ type: 'meal', ...meal });
    }
  }
  return items;
}

function fmtDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric',
  });
}

export default function ItemsScreen() {
  const { meals } = useMeals();

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={buildListData(meals)}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No meals logged yet</Text>
            <Text style={styles.emptySubtitle}>Your meal history will appear here</Text>
          </View>
        }
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return <Text style={styles.dateHeader}>{fmtDate(item.date)}</Text>;
          }
          return (
            <View style={styles.card}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.macros}>
                {item.calories} kcal · {item.protein}g P · {item.fat}g F · {item.carbs}g C
              </Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, paddingHorizontal: 16 },
  emptyState:   { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  emptyIcon:    { fontSize: 48, marginBottom: 16 },
  emptyTitle:   { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  emptySubtitle:{ fontSize: 14, color: '#aaa', textAlign: 'center' },
  dateHeader: { fontSize: 15, fontWeight: '700', marginTop: 20, marginBottom: 6, color: '#555' },
  card:       { paddingVertical: 12, paddingHorizontal: 14, marginBottom: 8, backgroundColor: '#f9f9f9', borderRadius: 10, borderWidth: 1, borderColor: '#eee' },
  nameRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name:       { fontSize: 15, fontWeight: '500', flex: 1 },
  time:       { fontSize: 13, color: '#aaa' },
  macros:     { fontSize: 13, color: '#777', marginTop: 2 },
});

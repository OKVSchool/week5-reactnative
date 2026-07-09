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
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return <Text style={styles.dateHeader}>{fmtDate(item.date)}</Text>;
          }
          return (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
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
  container:  { flex: 1, paddingHorizontal: 16 },
  dateHeader: { fontSize: 15, fontWeight: '700', marginTop: 20, marginBottom: 6, color: '#555' },
  card:       { paddingVertical: 12, paddingHorizontal: 14, marginBottom: 8, backgroundColor: '#f9f9f9', borderRadius: 10, borderWidth: 1, borderColor: '#eee' },
  name:       { fontSize: 15, fontWeight: '500' },
  macros:     { fontSize: 13, color: '#777', marginTop: 2 },
});

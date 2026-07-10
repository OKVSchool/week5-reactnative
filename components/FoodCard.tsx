import { View, Text, Pressable, StyleSheet } from 'react-native';
import { FoodTemplate } from '../data/FoodsContext';

type Props = { food: FoodTemplate; onEdit?: () => void; onDelete?: () => void };

export default function FoodCard({ food, onEdit, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{food.name}</Text>
        <Text style={styles.macros}>
          {food.calories} kcal · {food.protein}g P · {food.fat}g F · {food.carbs}g C
        </Text>
        <Text style={styles.usage}>Used {food.usageCount}x</Text>
      </View>
      {(onEdit || onDelete) && (
        <View style={styles.actions}>
          {onEdit && <Pressable style={styles.action} onPress={onEdit}><Text style={styles.edit}>Edit</Text></Pressable>}
          {onDelete && <Pressable style={styles.action} onPress={onDelete}><Text style={styles.delete}>Delete</Text></Pressable>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, marginBottom: 8, backgroundColor: '#f9f9f9', borderRadius: 10, borderWidth: 1, borderColor: '#eee' },
  info:    { flex: 1 },
  name:    { fontSize: 15, fontWeight: '500' },
  macros:  { fontSize: 13, color: '#777', marginTop: 2 },
  usage:   { fontSize: 12, color: '#aaa', marginTop: 2 },
  actions: { gap: 12 },
  action:  { minHeight: 50, justifyContent: 'center' },
  edit:    { fontSize: 13, color: '#007AFF' },
  delete:  { fontSize: 13, color: '#FF3B30' },
});

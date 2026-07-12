import { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFoods, FoodTemplate } from '../../data/FoodsContext';
import FoodCard from '../../components/FoodCard';

const EMPTY_FORM = { name: '', calories: '', protein: '', fat: '', carbs: '' };

export default function LibraryScreen() {
  const { foods, editFood, deleteFood } = useFoods();
  const [editTarget, setEditTarget] = useState<FoodTemplate | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const sorted = [...foods].sort((a, b) => b.usageCount - a.usageCount);

  function openEdit(food: FoodTemplate) {
    setEditTarget(food);
    setForm({
      name: food.name,
      calories: String(food.calories),
      protein: String(food.protein),
      fat: String(food.fat),
      carbs: String(food.carbs),
    });
  }

  function handleSave() {
    if (!editTarget) return;
    editFood(editTarget.id, {
      name: form.name.trim(),
      calories: Number(form.calories) || 0,
      protein:  Number(form.protein)  || 0,
      fat:      Number(form.fat)      || 0,
      carbs:    Number(form.carbs)    || 0,
    });
    setEditTarget(null);
    setForm(EMPTY_FORM);
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sorted}
        keyExtractor={f => f.id}
        ListEmptyComponent={
          <Text style={styles.empty}>No foods yet. Add a meal to build your library.</Text>
        }
        renderItem={({ item }) => (
          <FoodCard
            food={item}
            onEdit={() => openEdit(item)}
            onDelete={() => deleteFood(item.id)}
          />
        )}
      />
      <Modal visible={!!editTarget} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.form}>
            <Text style={styles.formTitle}>Edit Food</Text>
            <TextInput
              style={styles.input}
              placeholder="Food name"
              placeholderTextColor="#555"
              value={form.name}
              onChangeText={v => setForm(f => ({ ...f, name: v }))}
            />
            {(['calories', 'protein', 'fat', 'carbs'] as const).map(key => (
              <TextInput
                key={key}
                style={styles.input}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                placeholderTextColor="#555"
                keyboardType="numeric"
                value={form[key]}
                onChangeText={v => setForm(f => ({ ...f, [key]: v }))}
              />
            ))}
            <Pressable style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save</Text>
            </Pressable>
            <Pressable onPress={() => setEditTarget(null)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, paddingHorizontal: 16, backgroundColor: '#0f0f0f' },
  empty:       { marginTop: 40, textAlign: 'center', color: '#555' },
  overlay:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  form:        { backgroundColor: '#1a1a1a', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 24, gap: 12 },
  formTitle:   { fontSize: 20, fontWeight: 'bold', marginBottom: 4, color: '#f0f0f0' },
  input:       { borderWidth: 1, borderColor: '#2a2a2a', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, backgroundColor: '#242424', color: '#f0f0f0' },
  saveBtn:     { backgroundColor: '#6366f1', borderRadius: 8, minHeight: 50, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancelText:  { textAlign: 'center', color: '#555', fontSize: 14, paddingVertical: 4 },
});

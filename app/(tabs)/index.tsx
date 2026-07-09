import { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMeals } from '../../data/MealsContext';

function localDateStr(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

const DATE_LABEL = new Date().toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
});

const BOXES = [
  { key: 'calories' as const, label: 'Calories', unit: 'kcal' },
  { key: 'protein'  as const, label: 'Protein',  unit: 'g' },
  { key: 'fat'      as const, label: 'Fat',       unit: 'g' },
  { key: 'carbs'    as const, label: 'Carbs',     unit: 'g' },
];

const EMPTY_FORM = { name: '', calories: '', protein: '', fat: '', carbs: '' };

export default function TodayScreen() {
  const { meals, addMeal } = useMeals();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const TODAY = localDateStr();
  const todayMeals = meals.filter(m => m.date === TODAY);
  const totals = {
    calories: todayMeals.reduce((s, m) => s + m.calories, 0),
    protein:  todayMeals.reduce((s, m) => s + m.protein,  0),
    fat:      todayMeals.reduce((s, m) => s + m.fat,      0),
    carbs:    todayMeals.reduce((s, m) => s + m.carbs,    0),
  };

  function handleAdd() {
    if (!form.name.trim()) return;
    addMeal({
      id: Date.now().toString(),
      name: form.name.trim(),
      date: TODAY,
      calories: Number(form.calories) || 0,
      protein:  Number(form.protein)  || 0,
      fat:      Number(form.fat)      || 0,
      carbs:    Number(form.carbs)    || 0,
    });
    setForm(EMPTY_FORM);
    setShowForm(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>macroTrack</Text>
      <Text style={styles.subheader}>Daily Totals</Text>
      <Text style={styles.date}>{DATE_LABEL}</Text>
      <View style={styles.grid}>
        {BOXES.map(({ key, label, unit }) => (
          <View key={key} style={styles.box}>
            <Text style={styles.macroLabel}>{label}</Text>
            <Text style={styles.macroValue}>{totals[key]} {unit}</Text>
          </View>
        ))}
      </View>
      <Pressable style={styles.addBtn} onPress={() => setShowForm(true)}>
        <Text style={styles.addBtnText}>+ Add Food</Text>
      </Pressable>

      <Modal visible={showForm} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.form}>
            <Text style={styles.formTitle}>Add Food</Text>
            <TextInput
              style={styles.input}
              placeholder="Food name"
              value={form.name}
              onChangeText={v => setForm(f => ({ ...f, name: v }))}
            />
            {(['calories', 'protein', 'fat', 'carbs'] as const).map(key => (
              <TextInput
                key={key}
                style={styles.input}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                keyboardType="numeric"
                value={form[key]}
                onChangeText={v => setForm(f => ({ ...f, [key]: v }))}
              />
            ))}
            <Pressable style={styles.submitBtn} onPress={handleAdd}>
              <Text style={styles.submitBtnText}>Add</Text>
            </Pressable>
            <Pressable onPress={() => { setShowForm(false); setForm(EMPTY_FORM); }}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, alignItems: 'center', paddingHorizontal: 16 },
  title:         { fontSize: 28, fontWeight: 'bold', marginTop: 16, marginBottom: 24 },
  subheader:     { fontSize: 20, fontWeight: '600' },
  date:          { fontSize: 14, marginBottom: 24 },
  grid:          { width: '100%', flexDirection: 'row', flexWrap: 'wrap', flex: 1 },
  box:           { width: '50%', height: '50%', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ccc' },
  macroLabel:    { fontSize: 18, fontWeight: '600' },
  macroValue:    { fontSize: 24, marginTop: 8 },
  addBtn:        { backgroundColor: '#000', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 32, marginBottom: 24 },
  addBtnText:    { color: '#fff', fontSize: 16, fontWeight: '600' },
  overlay:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  form:          { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 24, gap: 12 },
  formTitle:     { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  input:         { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15 },
  submitBtn:     { backgroundColor: '#000', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancelText:    { textAlign: 'center', color: '#888', fontSize: 14, paddingVertical: 4 },
});

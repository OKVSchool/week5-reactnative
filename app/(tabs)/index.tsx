import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Modal, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Animated, Dimensions, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { useMeals } from '../../data/MealsContext';
import { useFoods } from '../../data/FoodsContext';
import SwipeableFoodCard from '../../components/SwipeableFoodCard';
import { scheduleInactivityReminderFor, scheduleDailyReminderAt } from '../../utils/notifications';

const DRAWER_WIDTH = Dimensions.get('window').width * 0.72;
const SETTINGS_KEY = 'notification_settings';

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
  { key: 'calories' as const, label: 'Calories', unit: 'kcal', accent: '#FF6B6B' },
  { key: 'protein'  as const, label: 'Protein',  unit: 'g',    accent: '#4ECDC4' },
  { key: 'fat'      as const, label: 'Fat',       unit: 'g',    accent: '#FFE66D' },
  { key: 'carbs'    as const, label: 'Carbs',     unit: 'g',    accent: '#A8E6CF' },
];

const EMPTY_FORM = { name: '', calories: '', protein: '', fat: '', carbs: '' };

function defaultDailyTime() {
  const d = new Date();
  d.setHours(21, 0, 0, 0);
  return d;
}

function defaultDuration() {
  const d = new Date();
  d.setHours(4, 0, 0, 0);
  return d;
}

export default function TodayScreen() {
  const { meals, addMeal } = useMeals();
  const { foods, addOrIncrementFood } = useFoods();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [menuOpen, setMenuOpen] = useState(false);
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  const [notifInactivity, setNotifInactivity] = useState(false);
  const [notifDaily, setNotifDaily] = useState(false);
  const [dailyTime, setDailyTime] = useState(defaultDailyTime());
  const [inactivityDuration, setInactivityDuration] = useState(defaultDuration());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [editingTime, setEditingTime] = useState(false);
  const [editingDuration, setEditingDuration] = useState(false);
  const [showNotifSettings, setShowNotifSettings] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then(data => {
      if (!data) return;
      const s = JSON.parse(data);
      setNotifInactivity(s.notifInactivity ?? false);
      setNotifDaily(s.notifDaily ?? false);
      if (s.dailyHour !== undefined) {
        const d = new Date();
        d.setHours(s.dailyHour, s.dailyMinute, 0, 0);
        setDailyTime(d);
      }
      if (s.inactivityHours !== undefined) {
        const d = new Date();
        d.setHours(s.inactivityHours, s.inactivityMinutes, 0, 0);
        setInactivityDuration(d);
      }
    });
  }, []);

  function saveSettings(inactivity: boolean, daily: boolean, time: Date, duration: Date) {
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({
      notifInactivity: inactivity,
      notifDaily: daily,
      dailyHour: time.getHours(),
      dailyMinute: time.getMinutes(),
      inactivityHours: duration.getHours(),
      inactivityMinutes: duration.getMinutes(),
    }));
  }

  async function syncNotifications(inactivity: boolean, daily: boolean, time: Date, duration: Date) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (inactivity) {
      const seconds = (duration.getHours() * 60 + duration.getMinutes()) * 60;
      scheduleInactivityReminderFor(seconds > 0 ? seconds : 14400);
    }
    if (daily) scheduleDailyReminderAt(time.getHours(), time.getMinutes());
  }

  function toggleInactivity(val: boolean) {
    setNotifInactivity(val);
    saveSettings(val, notifDaily, dailyTime, inactivityDuration);
    syncNotifications(val, notifDaily, dailyTime, inactivityDuration);
  }

  function toggleDaily(val: boolean) {
    setNotifDaily(val);
    saveSettings(notifInactivity, val, dailyTime, inactivityDuration);
    syncNotifications(notifInactivity, val, dailyTime, inactivityDuration);
  }

  function handleTimeChange(date: Date) {
    setDailyTime(date);
    saveSettings(notifInactivity, notifDaily, date, inactivityDuration);
    syncNotifications(notifInactivity, notifDaily, date, inactivityDuration);
  }

  function handleDurationChange(date: Date) {
    setInactivityDuration(date);
    saveSettings(notifInactivity, notifDaily, dailyTime, date);
    syncNotifications(notifInactivity, notifDaily, dailyTime, date);
  }

  function openMenu() {
    setMenuOpen(true);
    Animated.timing(translateX, { toValue: 0, duration: 250, useNativeDriver: true }).start();
  }

  function closeMenu() {
    Animated.timing(translateX, { toValue: -DRAWER_WIDTH, duration: 250, useNativeDriver: true }).start(() => setMenuOpen(false));
  }

  const TODAY = localDateStr();
  const todayMeals = meals.filter(m => m.date === TODAY);
  const totals = {
    calories: todayMeals.reduce((s, m) => s + m.calories, 0),
    protein:  todayMeals.reduce((s, m) => s + m.protein,  0),
    fat:      todayMeals.reduce((s, m) => s + m.fat,      0),
    carbs:    todayMeals.reduce((s, m) => s + m.carbs,    0),
  };

  const top5 = [...foods].sort((a, b) => b.usageCount - a.usageCount).slice(0, 5);
  const suggestions = form.name.length > 0
    ? foods.filter(f => f.name.toLowerCase().includes(form.name.toLowerCase()))
    : [];

  function handleAdd() {
    if (!form.name.trim()) return;
    const meal = {
      id: Date.now().toString(),
      name: form.name.trim(),
      date: TODAY,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      calories: Number(form.calories) || 0,
      protein:  Number(form.protein)  || 0,
      fat:      Number(form.fat)      || 0,
      carbs:    Number(form.carbs)    || 0,
    };
    addMeal(meal);
    addOrIncrementFood({ name: meal.name, calories: meal.calories, protein: meal.protein, fat: meal.fat, carbs: meal.carbs });
    setForm(EMPTY_FORM);
    setShowForm(false);
  }

  function fillFromSuggestion(food: typeof foods[0]) {
    setForm({
      name: food.name,
      calories: String(food.calories),
      protein:  String(food.protein),
      fat:      String(food.fat),
      carbs:    String(food.carbs),
    });
  }

  const timeLabel = dailyTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const durationLabel = `${inactivityDuration.getHours()}h ${inactivityDuration.getMinutes()}m`;

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.hamburger} onPress={menuOpen ? closeMenu : openMenu}>
        <Text style={styles.hamburgerIcon}>{menuOpen ? '✕' : '☰'}</Text>
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>macroTrack</Text>

        <Text style={styles.subheader}>Daily Totals</Text>
        <Text style={styles.date}>{DATE_LABEL}</Text>
        {meals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.emptyTitle}>Nothing tracked yet</Text>
            <Text style={styles.emptySubtitle}>Add your first food to get started</Text>
          </View>
        ) : (
          <>
            <View style={styles.grid}>
              {BOXES.map(({ key, label, unit, accent }) => (
                <View key={key} style={[styles.box, { borderTopColor: accent, borderTopWidth: 3 }]}>
                  <Text style={styles.macroLabel}>{label}</Text>
                  <Text style={[styles.macroValue, { color: accent }]}>{totals[key]}</Text>
                  <Text style={styles.macroUnit}>{unit}</Text>
                </View>
              ))}
            </View>
            {top5.length > 0 && (
              <>
                <Text style={styles.top5Label}>Top Foods</Text>
                {top5.map(food => (
                  <SwipeableFoodCard
                    key={food.id}
                    food={food}
                    onAdd={() => {
                      addMeal({
                        id: Date.now().toString(),
                        name: food.name,
                        date: TODAY,
                        calories: food.calories,
                        protein: food.protein,
                        fat: food.fat,
                        carbs: food.carbs,
                      });
                      addOrIncrementFood({ name: food.name, calories: food.calories, protein: food.protein, fat: food.fat, carbs: food.carbs });
                    }}
                  />
                ))}
              </>
            )}
          </>
        )}
        <Pressable style={styles.addBtn} onPress={() => setShowForm(true)}>
          <Text style={styles.addBtnText}>+ Add Food</Text>
        </Pressable>
      </ScrollView>

      {/* Drawer backdrop */}
      {menuOpen && <Pressable style={styles.backdrop} onPress={closeMenu} />}

      {/* Settings drawer */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
        <Text style={styles.drawerHeading}>Settings</Text>
        <View style={styles.drawerDivider} />

        <Pressable style={styles.drawerRow} onPress={() => setShowNotifSettings(true)}>
          <Text style={styles.drawerRowText}>Notifications</Text>
          <Text style={styles.drawerRowChevron}>›</Text>
        </Pressable>
      </Animated.View>

      {/* Notifications settings screen */}
      <Modal visible={showNotifSettings} animationType="slide">
        <SafeAreaView style={styles.notifScreen}>
          <Pressable style={styles.notifClose} onPress={() => setShowNotifSettings(false)}>
            <Text style={styles.notifCloseText}>✕</Text>
          </Pressable>
          <Text style={styles.notifHeading}>Notifications</Text>
          <View style={styles.drawerDivider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLabel}>
              <Text style={styles.settingTitle}>Inactivity Reminder</Text>
              <Text style={styles.settingSubtitle}>
                Alert after {inactivityDuration.getHours()}h {inactivityDuration.getMinutes()}m without logging
              </Text>
            </View>
            <Switch
              value={notifInactivity}
              onValueChange={toggleInactivity}
              trackColor={{ false: '#333', true: '#6366f1' }}
              thumbColor="#fff"
            />
          </View>

          {notifInactivity && (
            <View style={styles.timeRow}>
              <View style={styles.editRow}>
                <Text style={styles.settingTitle}>Duration: <Text style={styles.timeValue}>{durationLabel}</Text></Text>
                <Pressable onPress={() => setEditingDuration(e => !e)}>
                  <Text style={styles.editBtn}>{editingDuration ? 'Done' : 'Edit'}</Text>
                </Pressable>
              </View>
              {editingDuration && (
                <View style={styles.stepperRow}>
                  <View style={styles.stepper}>
                    <Text style={styles.stepperLabel}>Hours</Text>
                    <View style={styles.stepperControls}>
                      <Pressable style={styles.stepperBtn} onPress={() => {
                        const h = Math.max(0, inactivityDuration.getHours() - 1);
                        const d = new Date(); d.setHours(h, inactivityDuration.getMinutes(), 0, 0);
                        handleDurationChange(d);
                      }}><Text style={styles.stepperBtnText}>−</Text></Pressable>
                      <Text style={styles.stepperValue}>{inactivityDuration.getHours()}</Text>
                      <Pressable style={styles.stepperBtn} onPress={() => {
                        const h = Math.min(23, inactivityDuration.getHours() + 1);
                        const d = new Date(); d.setHours(h, inactivityDuration.getMinutes(), 0, 0);
                        handleDurationChange(d);
                      }}><Text style={styles.stepperBtnText}>+</Text></Pressable>
                    </View>
                  </View>
                  <View style={styles.stepper}>
                    <Text style={styles.stepperLabel}>Minutes</Text>
                    <View style={styles.stepperControls}>
                      <Pressable style={styles.stepperBtn} onPress={() => {
                        const m = Math.max(0, inactivityDuration.getMinutes() - 15);
                        const d = new Date(); d.setHours(inactivityDuration.getHours(), m, 0, 0);
                        handleDurationChange(d);
                      }}><Text style={styles.stepperBtnText}>−</Text></Pressable>
                      <Text style={styles.stepperValue}>{String(inactivityDuration.getMinutes()).padStart(2, '0')}</Text>
                      <Pressable style={styles.stepperBtn} onPress={() => {
                        const m = Math.min(45, inactivityDuration.getMinutes() + 15);
                        const d = new Date(); d.setHours(inactivityDuration.getHours(), m, 0, 0);
                        handleDurationChange(d);
                      }}><Text style={styles.stepperBtnText}>+</Text></Pressable>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          <View style={styles.settingRow}>
            <View style={styles.settingLabel}>
              <Text style={styles.settingTitle}>Daily Reminder</Text>
              <Text style={styles.settingSubtitle}>Scheduled notification each day</Text>
            </View>
            <Switch
              value={notifDaily}
              onValueChange={toggleDaily}
              trackColor={{ false: '#333', true: '#6366f1' }}
              thumbColor="#fff"
            />
          </View>

          {notifDaily && (
            <View style={styles.timeRow}>
              <View style={styles.editRow}>
                <Text style={styles.settingTitle}>Reminder Time: <Text style={styles.timeValue}>{timeLabel}</Text></Text>
                <Pressable onPress={() => setEditingTime(e => !e)}>
                  <Text style={styles.editBtn}>{editingTime ? 'Done' : 'Edit'}</Text>
                </Pressable>
              </View>
              {editingTime && Platform.OS === 'android' && (
                <Pressable style={styles.timeBtn} onPress={() => setShowTimePicker(true)}>
                  <Text style={styles.timeBtnText}>{timeLabel}</Text>
                </Pressable>
              )}
              {editingTime && (Platform.OS === 'ios' || showTimePicker) && (
                <DateTimePicker
                  value={dailyTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'compact' : 'default'}
                  themeVariant="dark"
                  onChange={(event, date) => {
                    setShowTimePicker(false);
                    if (date) handleTimeChange(date);
                  }}
                />
              )}
            </View>
          )}
        </SafeAreaView>
      </Modal>

      <Modal visible={showForm} transparent animationType="slide">
        <View style={styles.overlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.form}>
            <Text style={styles.formTitle}>Add Food</Text>
            <TextInput
              style={styles.input}
              placeholder="Food name"
              placeholderTextColor="#555"
              value={form.name}
              onChangeText={v => setForm(f => ({ ...f, name: v }))}
            />
            {suggestions.length > 0 && (
              <View style={styles.suggestions}>
                {suggestions.map(f => (
                  <Pressable key={f.id} style={styles.suggestion} onPress={() => fillFromSuggestion(f)}>
                    <Text style={styles.suggestionText}>{f.name}</Text>
                  </Pressable>
                ))}
              </View>
            )}
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
            <Pressable style={styles.submitBtn} onPress={handleAdd}>
              <Text style={styles.submitBtnText}>Add</Text>
            </Pressable>
            <Pressable onPress={() => { setShowForm(false); setForm(EMPTY_FORM); }}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#0f0f0f' },
  scroll:           { alignItems: 'center', paddingHorizontal: 16, paddingBottom: 24 },
  title:            { fontSize: 28, fontWeight: 'bold', marginTop: 16, marginBottom: 8, color: '#f0f0f0' },
  hamburger:        { position: 'absolute', top: 12, left: 16, zIndex: 30, padding: 8 },
  hamburgerIcon:    { fontSize: 24, color: '#f0f0f0' },
  subheader:        { fontSize: 20, fontWeight: '600', color: '#f0f0f0' },
  date:             { fontSize: 14, marginBottom: 24, color: '#888' },
  grid:             { width: '100%', flexDirection: 'row', flexWrap: 'wrap', height: 240 },
  box:              { width: '50%', height: '50%', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#2a2a2a', backgroundColor: '#1a1a1a' },
  macroLabel:       { fontSize: 13, fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 },
  macroValue:       { fontSize: 28, fontWeight: '700', marginTop: 6 },
  macroUnit:        { fontSize: 12, color: '#555', marginTop: 2 },
  top5Label:        { alignSelf: 'flex-start', fontSize: 18, fontWeight: '700', marginTop: 24, marginBottom: 10, color: '#f0f0f0' },
  addBtn:           { backgroundColor: '#6366f1', borderRadius: 10, minHeight: 52, paddingHorizontal: 32, marginTop: 24, justifyContent: 'center', alignItems: 'center', width: '100%' },
  addBtnText:       { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  backdrop:         { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 10 },
  drawer:           { position: 'absolute', top: 0, left: 0, bottom: 0, width: DRAWER_WIDTH, backgroundColor: '#161616', zIndex: 20, paddingTop: 60, paddingHorizontal: 24, shadowColor: '#000', shadowOffset: { width: 4, height: 0 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 12 },
  drawerHeading:    { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#f0f0f0' },
  drawerDivider:    { height: 1, backgroundColor: '#2a2a2a', marginBottom: 20 },
  drawerSection:    { fontSize: 12, fontWeight: '600', color: '#555', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
  settingRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  settingLabel:     { flex: 1, paddingRight: 12 },
  settingTitle:     { fontSize: 15, fontWeight: '500', color: '#f0f0f0' },
  settingSubtitle:  { fontSize: 12, color: '#888', marginTop: 2 },
  timeRow:          { marginTop: 4, marginBottom: 20, gap: 10 },
  timeBtn:          { borderWidth: 1, borderColor: '#2a2a2a', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, alignSelf: 'flex-start', backgroundColor: '#242424' },
  timeBtnText:      { fontSize: 15, color: '#f0f0f0' },
  editRow:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  timeValue:        { fontWeight: '400', color: '#888' },
  editBtn:          { fontSize: 14, color: '#818cf8', fontWeight: '600' },
  stepperRow:       { flexDirection: 'row', gap: 16, marginTop: 8 },
  stepper:          { flex: 1, alignItems: 'center', gap: 6 },
  stepperLabel:     { fontSize: 12, fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 },
  stepperControls:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepperBtn:       { width: 36, height: 36, borderWidth: 1, borderColor: '#2a2a2a', borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#242424' },
  stepperBtnText:   { fontSize: 20, color: '#f0f0f0' },
  stepperValue:     { fontSize: 20, fontWeight: '600', minWidth: 28, textAlign: 'center', color: '#f0f0f0' },
  overlay:          { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  form:             { backgroundColor: '#1a1a1a', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 24, gap: 12 },
  formTitle:        { fontSize: 20, fontWeight: 'bold', marginBottom: 4, color: '#f0f0f0' },
  input:            { borderWidth: 1, borderColor: '#2a2a2a', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, backgroundColor: '#242424', color: '#f0f0f0' },
  suggestions:      { borderWidth: 1, borderColor: '#2a2a2a', borderRadius: 8, overflow: 'hidden' },
  suggestion:       { minHeight: 50, justifyContent: 'center', paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#2a2a2a', backgroundColor: '#1a1a1a' },
  suggestionText:   { fontSize: 14, color: '#f0f0f0' },
  submitBtn:        { backgroundColor: '#6366f1', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  submitBtnText:    { color: '#fff', fontSize: 16, fontWeight: '700' },
  cancelText:       { textAlign: 'center', color: '#555', fontSize: 14, paddingVertical: 4 },
  emptyState:       { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyIcon:        { fontSize: 48, marginBottom: 16 },
  emptyTitle:       { fontSize: 20, fontWeight: '700', marginBottom: 8, color: '#f0f0f0' },
  emptySubtitle:    { fontSize: 14, color: '#888', textAlign: 'center' },

  drawerRow:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 4 },
  drawerRowText:    { fontSize: 16, color: '#f0f0f0' },
  drawerRowChevron: { fontSize: 20, color: '#555' },

  notifScreen:      { flex: 1, paddingHorizontal: 16, backgroundColor: '#0f0f0f' },
  notifClose:       { marginTop: 12, marginBottom: 8, alignSelf: 'flex-start', padding: 8 },
  notifCloseText:   { fontSize: 20, color: '#f0f0f0' },
  notifHeading:     { fontSize: 22, fontWeight: '700', marginBottom: 12, color: '#f0f0f0' },
});

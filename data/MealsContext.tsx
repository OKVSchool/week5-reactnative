import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { SEED_MEALS, Meal } from './meals';
import { useError } from './ErrorContext';
import { scheduleInactivityReminder } from '../utils/notifications';

const STORAGE_KEY = 'meals_v3';

type MealsContextType = {
  meals: Meal[];
  addMeal: (meal: Meal) => void;
};

const MealsContext = createContext<MealsContextType>({ meals: SEED_MEALS, addMeal: () => {} });

export function MealsProvider({ children }: { children: ReactNode }) {
  const [meals, setMeals] = useState<Meal[]>(SEED_MEALS);
  const { setStorageError } = useError();

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(data => {
      if (data) setMeals(JSON.parse(data));
    });
  }, []);

  function addMeal(meal: Meal) {
    setMeals(prev => {
      const updated = [...prev, meal];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        .catch(() => setStorageError('Save Error. Re-enter meal'));
      return updated;
    });
    Notifications.cancelAllScheduledNotificationsAsync()
      .then(() => scheduleInactivityReminder());
  }

  return <MealsContext.Provider value={{ meals, addMeal }}>{children}</MealsContext.Provider>;
}

export function useMeals() { return useContext(MealsContext); }

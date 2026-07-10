import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useError } from './ErrorContext';

export type FoodTemplate = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  usageCount: number;
};

type FoodsContextType = {
  foods: FoodTemplate[];
  addOrIncrementFood: (food: Omit<FoodTemplate, 'id' | 'usageCount'>) => void;
  editFood: (id: string, updates: Partial<Omit<FoodTemplate, 'id' | 'usageCount'>>) => void;
  deleteFood: (id: string) => void;
};

const FoodsContext = createContext<FoodsContextType>({
  foods: [],
  addOrIncrementFood: () => {},
  editFood: () => {},
  deleteFood: () => {},
});

export function FoodsProvider({ children }: { children: ReactNode }) {
  const [foods, setFoods] = useState<FoodTemplate[]>([]);
  const { setStorageError } = useError();

  useEffect(() => {
    AsyncStorage.getItem('foods').then(data => {
      if (data) setFoods(JSON.parse(data));
    });
  }, []);

  function save(updated: FoodTemplate[]) {
    AsyncStorage.setItem('foods', JSON.stringify(updated))
      .catch(() => setStorageError('Save Error. Re-enter food data'));
  }

  function addOrIncrementFood(food: Omit<FoodTemplate, 'id' | 'usageCount'>) {
    const existing = foods.find(f => f.name.toLowerCase() === food.name.toLowerCase());
    const updated = existing
      ? foods.map(f => f.id === existing.id ? { ...f, usageCount: f.usageCount + 1 } : f)
      : [...foods, { ...food, id: Date.now().toString(), usageCount: 1 }];
    setFoods(updated);
    save(updated);
  }

  function editFood(id: string, updates: Partial<Omit<FoodTemplate, 'id' | 'usageCount'>>) {
    const updated = foods.map(f => f.id === id ? { ...f, ...updates } : f);
    setFoods(updated);
    save(updated);
  }

  function deleteFood(id: string) {
    const updated = foods.filter(f => f.id !== id);
    setFoods(updated);
    save(updated);
  }

  return (
    <FoodsContext.Provider value={{ foods, addOrIncrementFood, editFood, deleteFood }}>
      {children}
    </FoodsContext.Provider>
  );
}

export function useFoods() { return useContext(FoodsContext); }

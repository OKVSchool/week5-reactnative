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
    setFoods(prev => {
      const existing = prev.find(f => f.name.toLowerCase() === food.name.toLowerCase());
      const updated = existing
        ? prev.map(f => f.id === existing.id ? { ...f, usageCount: f.usageCount + 1 } : f)
        : [...prev, { ...food, id: Date.now().toString(), usageCount: 1 }];
      save(updated);
      return updated;
    });
  }

  function editFood(id: string, updates: Partial<Omit<FoodTemplate, 'id' | 'usageCount'>>) {
    setFoods(prev => {
      const updated = prev.map(f => f.id === id ? { ...f, ...updates } : f);
      save(updated);
      return updated;
    });
  }

  function deleteFood(id: string) {
    setFoods(prev => {
      const updated = prev.filter(f => f.id !== id);
      save(updated);
      return updated;
    });
  }

  return (
    <FoodsContext.Provider value={{ foods, addOrIncrementFood, editFood, deleteFood }}>
      {children}
    </FoodsContext.Provider>
  );
}

export function useFoods() { return useContext(FoodsContext); }

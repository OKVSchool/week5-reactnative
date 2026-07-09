import { createContext, useContext, useState, ReactNode } from 'react';
import { SEED_MEALS, Meal } from './meals';

type MealsContextType = { meals: Meal[]; addMeal: (meal: Meal) => void };

const MealsContext = createContext<MealsContextType>({ meals: SEED_MEALS, addMeal: () => {} });

export function MealsProvider({ children }: { children: ReactNode }) {
  const [meals, setMeals] = useState<Meal[]>(SEED_MEALS);
  function addMeal(meal: Meal) { setMeals(prev => [...prev, meal]); }
  return <MealsContext.Provider value={{ meals, addMeal }}>{children}</MealsContext.Provider>;
}

export function useMeals() { return useContext(MealsContext); }

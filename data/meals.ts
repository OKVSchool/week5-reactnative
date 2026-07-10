export type Meal = {
  id: string;
  name: string;
  date: string;
  time: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

export const SEED_MEALS: Meal[] = [];

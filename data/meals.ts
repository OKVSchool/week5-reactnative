export type Meal = {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD local
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

function localDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

export const SEED_MEALS: Meal[] = [
  // 6 days ago
  { id: '1',  name: 'Oatmeal',                date: localDate(6), calories: 350, protein: 12, fat: 8,  carbs: 55 },
  { id: '2',  name: 'Chicken Salad',           date: localDate(6), calories: 450, protein: 40, fat: 15, carbs: 20 },
  { id: '3',  name: 'Pasta Bolognese',         date: localDate(6), calories: 620, protein: 28, fat: 18, carbs: 82 },
  // 5 days ago
  { id: '4',  name: 'Greek Yogurt',            date: localDate(5), calories: 180, protein: 17, fat: 4,  carbs: 20 },
  { id: '5',  name: 'Turkey Wrap',             date: localDate(5), calories: 520, protein: 35, fat: 16, carbs: 58 },
  { id: '6',  name: 'Salmon & Rice',           date: localDate(5), calories: 580, protein: 42, fat: 14, carbs: 65 },
  // 4 days ago
  { id: '7',  name: 'Scrambled Eggs',          date: localDate(4), calories: 280, protein: 20, fat: 18, carbs: 4  },
  { id: '8',  name: 'Caesar Salad',            date: localDate(4), calories: 380, protein: 15, fat: 22, carbs: 30 },
  { id: '9',  name: 'Beef Stir Fry',           date: localDate(4), calories: 640, protein: 38, fat: 20, carbs: 72 },
  // 3 days ago
  { id: '10', name: 'Protein Shake',           date: localDate(3), calories: 220, protein: 30, fat: 5,  carbs: 18 },
  { id: '11', name: 'BLT Sandwich',            date: localDate(3), calories: 490, protein: 22, fat: 24, carbs: 50 },
  { id: '12', name: 'Grilled Chicken & Veg',  date: localDate(3), calories: 540, protein: 48, fat: 12, carbs: 45 },
  // 2 days ago
  { id: '13', name: 'Avocado Toast',           date: localDate(2), calories: 310, protein: 10, fat: 18, carbs: 32 },
  { id: '14', name: 'Tuna Sandwich',           date: localDate(2), calories: 420, protein: 32, fat: 10, carbs: 48 },
  { id: '15', name: 'Pork Tenderloin',         date: localDate(2), calories: 580, protein: 44, fat: 16, carbs: 58 },
  // yesterday
  { id: '16', name: 'Banana & Peanut Butter', date: localDate(1), calories: 300, protein: 8,  fat: 16, carbs: 38 },
  { id: '17', name: 'Grilled Cheese',          date: localDate(1), calories: 460, protein: 18, fat: 26, carbs: 44 },
  { id: '18', name: 'Vegetable Curry',         date: localDate(1), calories: 520, protein: 16, fat: 18, carbs: 75 },
  // today
  { id: '19', name: 'Overnight Oats',          date: localDate(0), calories: 380, protein: 14, fat: 10, carbs: 62 },
  { id: '20', name: 'Quinoa Bowl',             date: localDate(0), calories: 510, protein: 24, fat: 14, carbs: 72 },
  { id: '21', name: 'Grilled Salmon',          date: localDate(0), calories: 520, protein: 46, fat: 18, carbs: 28 },
];

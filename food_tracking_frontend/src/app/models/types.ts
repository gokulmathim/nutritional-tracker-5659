export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface UserCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends UserCredentials {
  name?: string;
}

export interface AuthResponse {
  token: string;
  user?: {
    id?: string;
    email: string;
    name?: string;
  };
}

export interface Food {
  id?: string;
  name: string;
  calories: number; // per 100g or per serving depending on backend; UI will display as provided
  protein: number;
  carbs: number;
  fat: number;
  servingSize?: number; // optional
  unit?: string; // optional: g, ml, piece, etc.
}

export interface FoodEntry {
  id?: string;
  date: string; // ISO yyyy-MM-dd
  mealType: MealType;
  foodId?: string; // set if selecting from food database
  foodName?: string; // for custom/manual entries
  quantity: number; // grams or unit count per backend expectation
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface DailySummary {
  date: string; // ISO yyyy-MM-dd
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

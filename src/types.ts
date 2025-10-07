export interface Nutrients {
  calories?: string;
  carbohydrateContent?: string;
  cholesterolContent?: string;
  fiberContent?: string;
  proteinContent?: string;
  saturatedFatContent?: string;
  sodiumContent?: string;
  sugarContent?: string;
  fatContent?: string;
  unsaturatedFatContent?: string;
}

export interface Recipe {
  id: string;
  title: string;
  cuisine: string;
  rating: number | null;
  prep_time: number | null;
  cook_time: number | null;
  total_time: number | null;
  description: string;
  nutrients: Nutrients;
  serves: string;
  calories_int: number | null;
  url?: string;
  country_state?: string;
  continent?: string;
  ingredients?: string[];
  instructions?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface RecipeFilters {
  title: string;
  cuisine: string;
  rating: string;
  total_time: string;
  calories: string;
}

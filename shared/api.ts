/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Nutrition API types
 */
export interface NutritionSearchResult {
  fdcId: number;
  description: string;
  brandOwner?: string;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  servingSize?: number;
  servingSizeUnit?: string;
}

export interface NutritionSearchResponse {
  foods: NutritionSearchResult[];
  totalPages: number;
  currentPage: number;
}

export interface FoodNutrients {
  fdcId: number;
  description: string;
  nutrients: {
    name: string;
    amount: number;
    unit: string;
  }[];
}

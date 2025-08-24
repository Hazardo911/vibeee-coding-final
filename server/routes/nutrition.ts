import { RequestHandler } from "express";
import { NutritionSearchResponse, FoodNutrients } from "@shared/api";

const USDA_API_KEY = process.env.USDA_API_KEY || "DEMO_KEY";
const USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1";

// Helper function to extract nutrition values
function extractNutrientValue(nutrients: any[], nutrientName: string): number | undefined {
  const nutrient = nutrients.find((n: any) => 
    n.nutrient.name.toLowerCase().includes(nutrientName.toLowerCase())
  );
  return nutrient ? nutrient.amount : undefined;
}

// Search for foods
export const searchFoods: RequestHandler = async (req, res) => {
  try {
    const { query, pageSize = 25, pageNumber = 1 } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const searchParams = new URLSearchParams({
      api_key: USDA_API_KEY,
      query: query,
      pageSize: pageSize.toString(),
      pageNumber: pageNumber.toString(),
      dataType: 'Foundation,SR Legacy', // Focus on reliable nutrition data
    });

    const response = await fetch(`${USDA_BASE_URL}/foods/search?${searchParams}`);
    
    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status}`);
    }

    const data = await response.json();

    const foods = data.foods?.map((food: any) => {
      const nutrients = food.foodNutrients || [];
      
      return {
        fdcId: food.fdcId,
        description: food.description,
        brandOwner: food.brandOwner,
        calories: extractNutrientValue(nutrients, 'energy'),
        protein: extractNutrientValue(nutrients, 'protein'),
        carbohydrates: extractNutrientValue(nutrients, 'carbohydrate'),
        fat: extractNutrientValue(nutrients, 'total lipid'),
        fiber: extractNutrientValue(nutrients, 'fiber'),
        sugar: extractNutrientValue(nutrients, 'sugars'),
        sodium: extractNutrientValue(nutrients, 'sodium'),
        servingSize: food.servingSize,
        servingSizeUnit: food.servingSizeUnit,
      };
    }) || [];

    const result: NutritionSearchResponse = {
      foods,
      totalPages: Math.ceil((data.totalHits || 0) / parseInt(pageSize.toString())),
      currentPage: parseInt(pageNumber.toString()),
    };

    res.json(result);
  } catch (error) {
    console.error('Nutrition search error:', error);
    res.status(500).json({ 
      error: 'Failed to search foods',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get detailed nutrition info for a specific food
export const getFoodDetails: RequestHandler = async (req, res) => {
  try {
    const { fdcId } = req.params;

    if (!fdcId) {
      return res.status(400).json({ error: 'Food ID is required' });
    }

    const response = await fetch(`${USDA_BASE_URL}/food/${fdcId}?api_key=${USDA_API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status}`);
    }

    const data = await response.json();

    const result: FoodNutrients = {
      fdcId: data.fdcId,
      description: data.description,
      nutrients: (data.foodNutrients || []).map((nutrient: any) => ({
        name: nutrient.nutrient.name,
        amount: nutrient.amount || 0,
        unit: nutrient.nutrient.unitName,
      })),
    };

    res.json(result);
  } catch (error) {
    console.error('Food details error:', error);
    res.status(500).json({ 
      error: 'Failed to get food details',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Apple, Zap, Info } from "lucide-react";
import { NutritionSearchResponse, NutritionSearchResult } from "@shared/api";

interface NutritionSearchProps {
  onFoodSelect?: (food: NutritionSearchResult) => void;
}

export default function NutritionSearch({ onFoodSelect }: NutritionSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const { data, isLoading, error } = useQuery<NutritionSearchResponse>({
    queryKey: ["nutrition-search", activeSearch],
    queryFn: async () => {
      if (!activeSearch.trim()) return { foods: [], totalPages: 0, currentPage: 1 };
      
      const response = await fetch(
        `/api/nutrition/search?query=${encodeURIComponent(activeSearch)}&pageSize=10`
      );
      
      if (!response.ok) {
        throw new Error("Failed to search foods");
      }
      
      return response.json();
    },
    enabled: !!activeSearch,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveSearch(searchQuery.trim());
    }
  };

  const formatNutrient = (value: number | undefined, unit = "g") => {
    if (value === undefined || value === null) return "N/A";
    return `${value.toFixed(1)}${unit}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Apple className="w-5 h-5 mr-2 text-wellness-green" />
          Food Nutrition Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <Input
            placeholder="Search for foods (e.g., 'chicken breast', 'apple', 'rice')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !searchQuery.trim()}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-700 text-sm">
              Failed to search foods. Please try again.
            </p>
          </div>
        )}

        {activeSearch && !isLoading && data?.foods.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Apple className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No foods found for "{activeSearch}"</p>
            <p className="text-sm">Try searching for a different food item</p>
          </div>
        )}

        {data?.foods && data.foods.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <Info className="w-4 h-4 mr-1" />
              Found {data.foods.length} results
            </div>
            
            {data.foods.map((food) => (
              <div
                key={food.fdcId}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 leading-tight">
                      {food.description}
                    </h4>
                    {food.brandOwner && (
                      <p className="text-sm text-gray-600 mt-1">
                        Brand: {food.brandOwner}
                      </p>
                    )}
                  </div>
                  
                  {food.calories !== undefined && (
                    <div className="ml-4 text-center">
                      <div className="flex items-center">
                        <Zap className="w-4 h-4 text-wellness-gold mr-1" />
                        <span className="text-xl font-bold text-wellness-gold">
                          {Math.round(food.calories)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">calories/100g</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {food.protein !== undefined && (
                    <Badge variant="secondary" className="text-xs">
                      Protein: {formatNutrient(food.protein)}
                    </Badge>
                  )}
                  {food.carbohydrates !== undefined && (
                    <Badge variant="secondary" className="text-xs">
                      Carbs: {formatNutrient(food.carbohydrates)}
                    </Badge>
                  )}
                  {food.fat !== undefined && (
                    <Badge variant="secondary" className="text-xs">
                      Fat: {formatNutrient(food.fat)}
                    </Badge>
                  )}
                  {food.fiber !== undefined && (
                    <Badge variant="secondary" className="text-xs">
                      Fiber: {formatNutrient(food.fiber)}
                    </Badge>
                  )}
                </div>

                {onFoodSelect && (
                  <Button
                    size="sm"
                    onClick={() => onFoodSelect(food)}
                    className="w-full"
                  >
                    Select Food
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

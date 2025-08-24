import Navigation from "@/components/Navigation";
import NutritionSearch from "@/components/NutritionSearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import {
  Apple,
  Zap,
  Target,
  Plus,
  Trash2,
  TrendingUp,
  Clock,
} from "lucide-react";
import { NutritionSearchResult } from "@shared/api";

interface ConsumedFood {
  id: string;
  food: NutritionSearchResult;
  amount: number; // in grams
  timestamp: Date;
}

// Mock daily goals
const dailyGoals = {
  calories: 2000,
  protein: 150, // grams
  carbs: 250, // grams
  fat: 65, // grams
};

export default function Nutrition() {
  const [consumedFoods, setConsumedFoods] = useState<ConsumedFood[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  const handleFoodSelect = (food: NutritionSearchResult) => {
    const newFood: ConsumedFood = {
      id: Date.now().toString(),
      food,
      amount: 100, // Default 100g serving
      timestamp: new Date(),
    };
    setConsumedFoods((prev) => [...prev, newFood]);
    setShowSearch(false);
  };

  const removeFoodItem = (id: string) => {
    setConsumedFoods((prev) => prev.filter((food) => food.id !== id));
  };

  const calculateTotalNutrients = () => {
    return consumedFoods.reduce(
      (totals, item) => {
        const multiplier = item.amount / 100; // Convert from 100g base to actual amount
        return {
          calories: totals.calories + (item.food.calories || 0) * multiplier,
          protein: totals.protein + (item.food.protein || 0) * multiplier,
          carbs: totals.carbs + (item.food.carbohydrates || 0) * multiplier,
          fat: totals.fat + (item.food.fat || 0) * multiplier,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
  };

  const totals = calculateTotalNutrients();

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wellness-light-green/20 to-wellness-light-teal/20">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-wellness-green">
            Nutrition Tracker 🍎
          </h1>
          <p className="text-gray-600 mt-2">
            Track your daily nutrition and calorie intake
          </p>
        </div>

        {/* Daily Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calories</CardTitle>
              <Zap className="h-4 w-4 text-wellness-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(totals.calories)}/{dailyGoals.calories}
              </div>
              <p className="text-xs text-muted-foreground">kcal today</p>
              <Progress
                value={getProgressPercentage(
                  totals.calories,
                  dailyGoals.calories,
                )}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Protein</CardTitle>
              <Target className="h-4 w-4 text-wellness-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(totals.protein)}/{dailyGoals.protein}
              </div>
              <p className="text-xs text-muted-foreground">grams today</p>
              <Progress
                value={getProgressPercentage(
                  totals.protein,
                  dailyGoals.protein,
                )}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carbs</CardTitle>
              <Apple className="h-4 w-4 text-wellness-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(totals.carbs)}/{dailyGoals.carbs}
              </div>
              <p className="text-xs text-muted-foreground">grams today</p>
              <Progress
                value={getProgressPercentage(totals.carbs, dailyGoals.carbs)}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fat</CardTitle>
              <TrendingUp className="h-4 w-4 text-wellness-navy" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(totals.fat)}/{dailyGoals.fat}
              </div>
              <p className="text-xs text-muted-foreground">grams today</p>
              <Progress
                value={getProgressPercentage(totals.fat, dailyGoals.fat)}
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Food Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-wellness-green" />
                  Today's Food Log
                </div>
                <Button onClick={() => setShowSearch(!showSearch)} size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Food
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {consumedFoods.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Apple className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No foods logged today</p>
                  <p className="text-sm">Start by adding your first meal</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {consumedFoods.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          {item.food.description}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {item.amount}g •{" "}
                          {Math.round(
                            ((item.food.calories || 0) * item.amount) / 100,
                          )}{" "}
                          cal
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFoodItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Food Search */}
          <div>
            {showSearch ? (
              <NutritionSearch onFoodSelect={handleFoodSelect} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-wellness-green" />
                    Daily Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Calories Goal
                      </p>
                      <p className="text-2xl font-bold text-wellness-gold">
                        {dailyGoals.calories} kcal
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-gray-600">Protein</p>
                        <p className="text-lg font-semibold text-wellness-teal">
                          {dailyGoals.protein}g
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Carbs</p>
                        <p className="text-lg font-semibold text-wellness-green">
                          {dailyGoals.carbs}g
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Fat</p>
                        <p className="text-lg font-semibold text-wellness-navy">
                          {dailyGoals.fat}g
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button
                        onClick={() => setShowSearch(true)}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Food to Log
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

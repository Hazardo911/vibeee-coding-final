import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Apple,
  Droplets,
  Activity,
  Lightbulb,
  RefreshCw,
  Calendar,
  Heart,
  Clock,
  Zap
} from "lucide-react";
import { useState, useEffect } from "react";
import { apiService, NutritionTip } from "@/services/apiService";
import { cn } from "@/lib/utils";

export default function Tips() {
  const [nutritionTips, setNutritionTips] = useState<NutritionTip[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTips = async () => {
    setIsLoading(true);
    try {
      const tips = await apiService.getNutritionTips();
      setNutritionTips(tips);
    } catch (error) {
      console.error('Failed to fetch nutrition tips:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'hydration':
        return Droplets;
      case 'nutrition':
        return Apple;
      case 'exercise':
        return Activity;
      default:
        return Lightbulb;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'hydration':
        return 'text-wellness-blue';
      case 'nutrition':
        return 'text-wellness-green';
      case 'exercise':
        return 'text-wellness-orange';
      default:
        return 'text-wellness-purple';
    }
  };

  const getBadgeColorForType = (type: string) => {
    switch (type) {
      case 'hydration':
        return 'bg-wellness-light-blue';
      case 'nutrition':
        return 'bg-wellness-light-green';
      case 'exercise':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  const addToCalendar = async (tip: NutritionTip) => {
    try {
      await apiService.addToCalendar({
        title: `Wellness Reminder: ${tip.title}`,
        time: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
        type: tip.type
      });
      alert('Reminder added to calendar successfully!');
    } catch (error) {
      console.error('Failed to add to calendar:', error);
      alert('Failed to add reminder to calendar');
    }
  };

  const staticTips = [
    {
      title: "Morning Hydration",
      message: "Start your day with a glass of water to kickstart your metabolism and rehydrate after sleep.",
      icon: Droplets,
      color: "text-wellness-blue",
      badge: "Daily Habit"
    },
    {
      title: "Move Every Hour",
      message: "Set a reminder to stand and move for 2-3 minutes every hour to improve circulation and energy.",
      icon: Activity,
      color: "text-wellness-green",
      badge: "Productivity"
    },
    {
      title: "Deep Breathing",
      message: "Practice 4-7-8 breathing (inhale 4, hold 7, exhale 8) to reduce stress and improve focus.",
      icon: Heart,
      color: "text-wellness-orange",
      badge: "Mindfulness"
    },
    {
      title: "Sleep Schedule",
      message: "Go to bed and wake up at the same time every day to regulate your circadian rhythm.",
      icon: Clock,
      color: "text-wellness-purple",
      badge: "Sleep Health"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-wellness-light-green/20 to-wellness-light-blue/20">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-wellness-green mb-2">Wellness Tips</h1>
            <p className="text-gray-600">
              Personalized recommendations for your health and wellness journey
            </p>
          </div>
          <Button 
            onClick={fetchTips} 
            disabled={isLoading}
            className="mt-4 sm:mt-0"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
            {isLoading ? 'Loading...' : 'Refresh Tips'}
          </Button>
        </div>

        {/* Personalized Nutrition Tips */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-wellness-orange" />
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {nutritionTips.map((tip, index) => {
                  const Icon = getIconForType(tip.type);
                  return (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Icon className={cn("w-5 h-5 mt-0.5", getColorForType(tip.type))} />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold">{tip.title}</h3>
                              <Badge className={getBadgeColorForType(tip.type)}>
                                {tip.type}
                              </Badge>
                              {tip.calories && (
                                <Badge variant="outline">
                                  {tip.calories} cal
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-700 text-sm">{tip.message}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addToCalendar(tip)}
                          className="ml-2"
                        >
                          <Calendar className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* General Wellness Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-wellness-green" />
              Daily Wellness Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {staticTips.map((tip, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <tip.icon className={cn("w-5 h-5", tip.color)} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{tip.title}</h3>
                        <Badge variant="secondary">{tip.badge}</Badge>
                      </div>
                      <p className="text-gray-700 text-sm">{tip.message}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => addToCalendar({
                          title: tip.title,
                          message: tip.message,
                          type: 'nutrition'
                        })}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Set Reminder
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips Categories */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center p-4 hover:shadow-md transition-shadow cursor-pointer">
            <Droplets className="w-8 h-8 text-wellness-blue mx-auto mb-2" />
            <h3 className="font-semibold">Hydration</h3>
            <p className="text-sm text-gray-600">Water & fluid intake</p>
          </Card>
          <Card className="text-center p-4 hover:shadow-md transition-shadow cursor-pointer">
            <Apple className="w-8 h-8 text-wellness-green mx-auto mb-2" />
            <h3 className="font-semibold">Nutrition</h3>
            <p className="text-sm text-gray-600">Healthy eating tips</p>
          </Card>
          <Card className="text-center p-4 hover:shadow-md transition-shadow cursor-pointer">
            <Activity className="w-8 h-8 text-wellness-orange mx-auto mb-2" />
            <h3 className="font-semibold">Exercise</h3>
            <p className="text-sm text-gray-600">Movement & fitness</p>
          </Card>
          <Card className="text-center p-4 hover:shadow-md transition-shadow cursor-pointer">
            <Heart className="w-8 h-8 text-wellness-purple mx-auto mb-2" />
            <h3 className="font-semibold">Mindfulness</h3>
            <p className="text-sm text-gray-600">Mental wellness</p>
          </Card>
        </div>
      </main>
    </div>
  );
}

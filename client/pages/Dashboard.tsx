import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Droplets,
  Activity,
  Moon,
  Target,
  Sun,
  Cloud,
  Quote,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Heart,
  BarChart3,
} from "lucide-react";
import {
  WeeklyProgressChart,
  WaterIntakeChart,
} from "@/components/charts/ProgressCharts";
import WellnessChatbot from "@/components/WellnessChatbot";
import SmartNotifications from "@/components/SmartNotifications";
import { useState, useEffect } from "react";
import {
  apiService,
  Quote as QuoteType,
  WeatherData,
} from "@/services/apiService";

// Mock data - in a real app this would come from APIs and user data
const mockData = {
  user: { name: "Alex", streak: 7 },
  today: {
    water: { current: 6, target: 8, unit: "glasses" },
    exercise: { current: 30, target: 45, unit: "minutes" },
    sleep: { current: 7.5, target: 8, unit: "hours" },
    meditation: { current: 10, target: 15, unit: "minutes" },
  },
  weather: {
    condition: "sunny",
    temperature: 72,
    suggestion: "Perfect weather for outdoor activities!",
    description: "Sunny and warm",
    icon: "☀️",
  },
  quote: {
    text: "The groundwork for all happiness is good health.",
    author: "Leigh Hunt",
  },
};

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quote, setQuote] = useState<QuoteType>(mockData.quote);
  const [weather, setWeather] = useState<WeatherData>(mockData.weather);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Fetch quote on component mount
    const fetchQuote = async () => {
      setIsLoadingQuote(true);
      try {
        const newQuote = await apiService.getQuote();
        setQuote(newQuote);
      } catch (error) {
        console.error("Failed to fetch quote:", error);
      } finally {
        setIsLoadingQuote(false);
      }
    };

    // Fetch weather on component mount
    const fetchWeather = async () => {
      setIsLoadingWeather(true);
      try {
        const newWeather = await apiService.getWeather();
        setWeather(newWeather);
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      } finally {
        setIsLoadingWeather(false);
      }
    };

    fetchQuote();
    fetchWeather();
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const suggestions = [
    {
      icon: Droplets,
      color: "text-wellness-teal",
      title: "Hydration Reminder",
      message: "You're 2 glasses away from your water goal! Drink up! 💧",
      action: "Log Water",
    },
    {
      icon: Sun,
      color: "text-wellness-gold",
      title: "Weather Alert",
      message: weather.suggestion + " Consider a 20-minute walk.",
      action: "Plan Activity",
    },
    {
      icon: Moon,
      color: "text-wellness-navy",
      title: "Sleep Preparation",
      message: "Wind down in 2 hours for optimal sleep quality.",
      action: "Set Reminder",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-wellness-light-green/20 to-wellness-light-teal/20">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-wellness-green">
            {getGreeting()}, {mockData.user.name}! 🌟
          </h1>
          <p className="text-gray-600 mt-2">
            You're on a {mockData.user.streak}-day wellness streak! Keep it up!
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Water Intake
              </CardTitle>
              <Droplets className="h-4 w-4 text-wellness-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockData.today.water.current}/{mockData.today.water.target}
              </div>
              <p className="text-xs text-muted-foreground">glasses today</p>
              <Progress
                value={getProgressPercentage(
                  mockData.today.water.current,
                  mockData.today.water.target,
                )}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exercise</CardTitle>
              <Activity className="h-4 w-4 text-wellness-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockData.today.exercise.current}/
                {mockData.today.exercise.target}
              </div>
              <p className="text-xs text-muted-foreground">minutes today</p>
              <Progress
                value={getProgressPercentage(
                  mockData.today.exercise.current,
                  mockData.today.exercise.target,
                )}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sleep</CardTitle>
              <Moon className="h-4 w-4 text-wellness-navy" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockData.today.sleep.current}/{mockData.today.sleep.target}
              </div>
              <p className="text-xs text-muted-foreground">hours last night</p>
              <Progress
                value={getProgressPercentage(
                  mockData.today.sleep.current,
                  mockData.today.sleep.target,
                )}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meditation</CardTitle>
              <Heart className="h-4 w-4 text-wellness-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockData.today.meditation.current}/
                {mockData.today.meditation.target}
              </div>
              <p className="text-xs text-muted-foreground">minutes today</p>
              <Progress
                value={getProgressPercentage(
                  mockData.today.meditation.current,
                  mockData.today.meditation.target,
                )}
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personalized Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-wellness-green" />
                Personalized Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <suggestion.icon
                    className={`w-5 h-5 mt-0.5 ${suggestion.color}`}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{suggestion.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {suggestion.message}
                    </p>
                    <Button size="sm" variant="outline" className="mt-2">
                      {suggestion.action}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Daily Quote & Weather */}
          <div className="space-y-6">
            {/* Daily Quote */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Quote className="w-5 h-5 mr-2 text-wellness-navy" />
                  Daily Inspiration
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingQuote ? (
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ) : (
                  <>
                    <blockquote className="italic text-gray-700 text-lg">
                      "{quote.text}"
                    </blockquote>
                    <cite className="text-sm text-gray-500 mt-2 block">
                      — {quote.author}
                    </cite>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Weather Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sun className="w-5 h-5 mr-2 text-wellness-gold" />
                  Weather & Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingWeather ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{weather.icon}</span>
                        <div>
                          <p className="font-medium capitalize">
                            {weather.description}
                          </p>
                          <p className="text-sm text-gray-600">
                            {weather.temperature}°F
                          </p>
                        </div>
                      </div>
                      <CheckCircle className="w-6 h-6 text-wellness-green" />
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      {weather.suggestion}
                    </p>
                    <Button size="sm" className="w-full">
                      Plan Outdoor Activity
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Progress Charts */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-wellness-green" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WeeklyProgressChart height={250} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Droplets className="w-5 h-5 mr-2 text-wellness-teal" />
                Water Intake Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WaterIntakeChart height={250} />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-wellness-green" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <Droplets className="w-6 h-6 mb-2 text-wellness-teal" />
                <span>Log Water</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <Activity className="w-6 h-6 mb-2 text-wellness-green" />
                <span>Log Exercise</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => (window.location.href = "/nutrition")}
              >
                <Target className="w-6 h-6 mb-2 text-wellness-gold" />
                <span>Track Food</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <Heart className="w-6 h-6 mb-2 text-wellness-gold" />
                <span>Log Mood</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <Moon className="w-6 h-6 mb-2 text-wellness-navy" />
                <span>Log Sleep</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Smart Notifications */}
        <SmartNotifications
          userHabits={mockData.today}
          onActionClick={(action) => {
            console.log("Notification action clicked:", action);
            // Here you could navigate to different pages or trigger actions
          }}
        />

        {/* Wellness Chatbot */}
        <WellnessChatbot
          userName={mockData.user.name}
          userHabits={mockData.today}
        />
      </main>
    </div>
  );
}

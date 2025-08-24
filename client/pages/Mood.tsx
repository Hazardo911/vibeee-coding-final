import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart,
  Smile,
  Frown,
  Meh,
  Zap,
  Battery,
  TrendingUp,
  Calendar,
  BookOpen,
  Activity
} from "lucide-react";
import { useState, useEffect } from "react";
import { apiService } from "@/services/apiService";
import { cn } from "@/lib/utils";
import RelaxationGame from "@/components/RelaxationGame";

const moods = [
  { id: 'happy', label: 'Happy', icon: '😊', color: 'text-wellness-green', bgColor: 'bg-wellness-light-green' },
  { id: 'sad', label: 'Sad', icon: '😢', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { id: 'stressed', label: 'Stressed', icon: '😰', color: 'text-red-600', bgColor: 'bg-red-100' },
  { id: 'energetic', label: 'Energetic', icon: '⚡', color: 'text-wellness-orange', bgColor: 'bg-orange-100' },
  { id: 'tired', label: 'Tired', icon: '😴', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  { id: 'calm', label: 'Calm', icon: '😌', color: 'text-wellness-blue', bgColor: 'bg-wellness-light-blue' },
  { id: 'anxious', label: 'Anxious', icon: '😟', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  { id: 'excited', label: 'Excited', icon: '🤩', color: 'text-wellness-purple', bgColor: 'bg-purple-100' }
];

// Mock mood history data
const moodHistory = [
  { date: 'Mon', mood: 'happy', energy: 80 },
  { date: 'Tue', mood: 'tired', energy: 50 },
  { date: 'Wed', mood: 'stressed', energy: 40 },
  { date: 'Thu', mood: 'calm', energy: 70 },
  { date: 'Fri', mood: 'energetic', energy: 90 },
  { date: 'Sat', mood: 'happy', energy: 85 },
  { date: 'Sun', mood: 'calm', energy: 75 }
];

export default function Mood() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [currentEnergy, setCurrentEnergy] = useState(50);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [moodLogged, setMoodLogged] = useState(false);
  const [showRelaxationGame, setShowRelaxationGame] = useState(false);

  const logMood = async () => {
    if (!selectedMood) return;

    setIsLoadingSuggestions(true);
    try {
      const moodSuggestions = await apiService.getMoodSuggestions(selectedMood);
      setSuggestions(moodSuggestions);
      setMoodLogged(true);
    } catch (error) {
      console.error('Failed to get mood suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const resetMoodLog = () => {
    setSelectedMood(null);
    setCurrentEnergy(50);
    setSuggestions([]);
    setMoodLogged(false);
  };

  const getMoodEmoji = (moodId: string) => {
    return moods.find(m => m.id === moodId)?.icon || '😐';
  };

  const getMoodColor = (moodId: string) => {
    return moods.find(m => m.id === moodId)?.color || 'text-gray-600';
  };

  const averageEnergy = moodHistory.reduce((sum, day) => sum + day.energy, 0) / moodHistory.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-wellness-light-green/20 to-wellness-light-blue/20">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-wellness-green mb-2">Mood Tracker</h1>
          <p className="text-gray-600">
            Track your emotional wellness and receive personalized suggestions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mood Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-wellness-green" />
                How are you feeling today?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {moods.map((mood) => (
                  <Button
                    key={mood.id}
                    variant={selectedMood === mood.id ? "default" : "outline"}
                    className={cn(
                      "h-16 flex flex-col items-center justify-center transition-all",
                      selectedMood === mood.id && mood.bgColor
                    )}
                    onClick={() => setSelectedMood(mood.id)}
                  >
                    <span className="text-2xl mb-1">{mood.icon}</span>
                    <span className="text-sm">{mood.label}</span>
                  </Button>
                ))}
              </div>

              {/* Energy Level */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Energy Level</label>
                  <span className="text-sm text-gray-600">{currentEnergy}%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Battery className="w-4 h-4 text-gray-400" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentEnergy}
                    onChange={(e) => setCurrentEnergy(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <Zap className="w-4 h-4 text-wellness-orange" />
                </div>
                <Progress value={currentEnergy} className="mt-2" />
              </div>

              <Button 
                onClick={logMood} 
                disabled={!selectedMood || isLoadingSuggestions}
                className="w-full"
              >
                {isLoadingSuggestions ? 'Getting suggestions...' : 'Log Mood & Get Tips'}
              </Button>

              {moodLogged && (
                <Button 
                  variant="outline" 
                  onClick={resetMoodLog}
                  className="w-full mt-2"
                >
                  Log Different Mood
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-wellness-green" />
                Personalized Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {suggestions.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">
                      {selectedMood ? getMoodEmoji(selectedMood) : '😐'}
                    </span>
                    <div>
                      <p className="font-medium">
                        Feeling {selectedMood ? moods.find(m => m.id === selectedMood)?.label : 'neutral'}
                      </p>
                      <p className="text-sm text-gray-600">Energy: {currentEnergy}%</p>
                    </div>
                  </div>
                  
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-700">{suggestion}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Select your mood and energy level to get personalized wellness suggestions.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Mood History */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-wellness-green" />
              This Week's Mood & Energy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-4 mb-6">
              {moodHistory.map((day, index) => (
                <div key={index} className="text-center">
                  <p className="text-xs text-gray-600 mb-2">{day.date}</p>
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-2xl mb-2 mx-auto">
                    {getMoodEmoji(day.mood)}
                  </div>
                  <div className="text-xs">
                    <p className="font-medium capitalize">{day.mood}</p>
                    <div className="flex items-center justify-center space-x-1 mt-1">
                      <Battery className="w-3 h-3 text-gray-400" />
                      <span>{day.energy}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Weekly Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-wellness-green">{Math.round(averageEnergy)}%</p>
                <p className="text-sm text-gray-600">Average Energy</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-wellness-blue">5/7</p>
                <p className="text-sm text-gray-600">Positive Days</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-wellness-orange">😊</p>
                <p className="text-sm text-gray-600">Most Common Mood</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mood Insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-wellness-green" />
                Mood Boosters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-wellness-light-green rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-wellness-green" />
                  </div>
                  <span className="text-sm">10 minutes of exercise can boost mood for up to 2 hours</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-wellness-light-blue rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-wellness-blue" />
                  </div>
                  <span className="text-sm">Deep breathing for 5 minutes reduces stress hormones</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Smile className="w-4 h-4 text-wellness-orange" />
                  </div>
                  <span className="text-sm">Gratitude journaling improves overall well-being</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-wellness-green" />
                Mood Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Best time of day</span>
                  <Badge className="bg-wellness-light-green text-wellness-green">Morning</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Energy dip</span>
                  <Badge variant="outline">Mid-afternoon</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sleep correlation</span>
                  <Badge className="bg-wellness-light-blue text-wellness-blue">Strong</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Exercise impact</span>
                  <Badge className="bg-orange-100 text-orange-800">High</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

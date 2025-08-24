import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Droplets, 
  Activity, 
  Moon, 
  Heart,
  Plus,
  CheckCircle,
  Circle,
  Flame,
  TrendingUp,
  Calendar,
  Target,
  Clock
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock habit data
const initialHabits = [
  {
    id: 1,
    name: "Drink 8 glasses of water",
    icon: Droplets,
    color: "text-wellness-blue",
    bgColor: "bg-wellness-light-blue",
    target: 8,
    current: 6,
    unit: "glasses",
    streak: 7,
    completed: false,
    category: "Health"
  },
  {
    id: 2,
    name: "Exercise for 45 minutes",
    icon: Activity,
    color: "text-wellness-green",
    bgColor: "bg-wellness-light-green",
    target: 45,
    current: 30,
    unit: "minutes",
    streak: 5,
    completed: false,
    category: "Fitness"
  },
  {
    id: 3,
    name: "Meditate",
    icon: Heart,
    color: "text-wellness-orange",
    bgColor: "bg-wellness-light-green",
    target: 15,
    current: 15,
    unit: "minutes",
    streak: 12,
    completed: true,
    category: "Mindfulness"
  },
  {
    id: 4,
    name: "Get 8 hours of sleep",
    icon: Moon,
    color: "text-wellness-purple",
    bgColor: "bg-wellness-light-blue",
    target: 8,
    current: 7.5,
    unit: "hours",
    streak: 3,
    completed: true,
    category: "Sleep"
  }
];

export default function Habits() {
  const [habits, setHabits] = useState(initialHabits);
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: "",
    target: "",
    unit: "",
    category: ""
  });

  const toggleHabit = (habitId: number) => {
    setHabits(habits.map(habit => 
      habit.id === habitId 
        ? { 
            ...habit, 
            completed: !habit.completed,
            current: habit.completed ? Math.max(0, habit.current - 1) : habit.target,
            streak: habit.completed ? habit.streak : habit.streak + 1
          }
        : habit
    ));
  };

  const updateHabitProgress = (habitId: number, value: number) => {
    setHabits(habits.map(habit => 
      habit.id === habitId 
        ? { 
            ...habit, 
            current: Math.min(value, habit.target),
            completed: value >= habit.target
          }
        : habit
    ));
  };

  const addHabit = () => {
    if (newHabit.name && newHabit.target && newHabit.unit) {
      const habit = {
        id: habits.length + 1,
        name: newHabit.name,
        icon: Target,
        color: "text-wellness-green",
        bgColor: "bg-wellness-light-green",
        target: parseInt(newHabit.target),
        current: 0,
        unit: newHabit.unit,
        streak: 0,
        completed: false,
        category: newHabit.category || "Custom"
      };
      setHabits([...habits, habit]);
      setNewHabit({ name: "", target: "", unit: "", category: "" });
      setIsAddingHabit(false);
    }
  };

  const completedHabits = habits.filter(h => h.completed).length;
  const totalProgress = habits.length > 0 ? (completedHabits / habits.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-wellness-light-green/20 to-wellness-light-blue/20">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-wellness-green mb-2">Daily Habits</h1>
            <p className="text-gray-600">
              Track your progress and build healthy routines
            </p>
          </div>
          <Dialog open={isAddingHabit} onOpenChange={setIsAddingHabit}>
            <DialogTrigger asChild>
              <Button className="mt-4 sm:mt-0">
                <Plus className="w-4 h-4 mr-2" />
                Add Habit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Habit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="habit-name">Habit Name</Label>
                  <Input
                    id="habit-name"
                    placeholder="e.g., Read for 30 minutes"
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="habit-target">Target</Label>
                    <Input
                      id="habit-target"
                      type="number"
                      placeholder="30"
                      value={newHabit.target}
                      onChange={(e) => setNewHabit({...newHabit, target: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="habit-unit">Unit</Label>
                    <Input
                      id="habit-unit"
                      placeholder="minutes"
                      value={newHabit.unit}
                      onChange={(e) => setNewHabit({...newHabit, unit: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="habit-category">Category</Label>
                  <Input
                    id="habit-category"
                    placeholder="e.g., Learning"
                    value={newHabit.category}
                    onChange={(e) => setNewHabit({...newHabit, category: e.target.value})}
                  />
                </div>
                <Button onClick={addHabit} className="w-full">
                  Add Habit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-wellness-green" />
              Today's Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-2xl font-bold">{completedHabits}/{habits.length}</p>
                <p className="text-sm text-gray-600">habits completed</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Overall progress</p>
                <p className="text-lg font-semibold">{Math.round(totalProgress)}%</p>
              </div>
            </div>
            <Progress value={totalProgress} className="h-3" />
          </CardContent>
        </Card>

        {/* Habit Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {habits.map((habit) => {
            const progressPercentage = (habit.current / habit.target) * 100;
            
            return (
              <Card key={habit.id} className={cn(
                "transition-all duration-200 hover:shadow-md",
                habit.completed ? "ring-2 ring-wellness-green/20" : ""
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        habit.bgColor
                      )}>
                        <habit.icon className={cn("w-5 h-5", habit.color)} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{habit.name}</CardTitle>
                        <p className="text-sm text-gray-600">{habit.category}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleHabit(habit.id)}
                      className={cn(
                        "p-1",
                        habit.completed ? "text-wellness-green" : "text-gray-400"
                      )}
                    >
                      {habit.completed ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-gray-600">
                          {habit.current}/{habit.target} {habit.unit}
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>

                    {/* Quick Actions */}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateHabitProgress(habit.id, habit.current + 1)}
                        disabled={habit.current >= habit.target}
                      >
                        +1 {habit.unit}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateHabitProgress(habit.id, Math.max(0, habit.current - 1))}
                        disabled={habit.current <= 0}
                      >
                        -1 {habit.unit}
                      </Button>
                    </div>

                    {/* Streak */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-2">
                        <Flame className="w-4 h-4 text-wellness-orange" />
                        <span className="text-sm font-medium">{habit.streak} day streak</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Daily</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Weekly View */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-wellness-green" />
              This Week's Consistency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={day} className="text-center">
                  <p className="text-xs text-gray-600 mb-2">{day}</p>
                  <div className={cn(
                    "w-8 h-8 rounded-lg mx-auto flex items-center justify-center text-xs",
                    index < 5 ? "bg-wellness-green text-white" : "bg-gray-200 text-gray-500"
                  )}>
                    {index < 5 ? "✓" : "-"}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 text-center">
              5/7 days completed this week. Keep up the great work! 🎉
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

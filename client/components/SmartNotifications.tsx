import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  X, 
  Bell,
  Droplets,
  Activity,
  Coffee,
  Moon,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartNotification {
  id: string;
  type: 'reminder' | 'encouragement' | 'tip' | 'check-in';
  title: string;
  message: string;
  icon: any;
  color: string;
  actions?: string[];
}

interface SmartNotificationsProps {
  userHabits?: any;
  onActionClick?: (action: string) => void;
}

export default function SmartNotifications({ userHabits, onActionClick }: SmartNotificationsProps) {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [currentNotification, setCurrentNotification] = useState<SmartNotification | null>(null);

  useEffect(() => {
    // Generate smart notifications based on time and user data
    generateSmartNotifications();
    
    // Set interval to check for new notifications
    const interval = setInterval(generateSmartNotifications, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [userHabits]);

  useEffect(() => {
    // Show next notification if none is currently displayed
    if (!currentNotification && notifications.length > 0) {
      setCurrentNotification(notifications[0]);
      setTimeout(() => {
        setCurrentNotification(null);
        setNotifications(prev => prev.slice(1));
      }, 8000); // Show for 8 seconds
    }
  }, [notifications, currentNotification]);

  const generateSmartNotifications = () => {
    const now = new Date();
    const hour = now.getHours();
    const newNotifications: SmartNotification[] = [];

    // Morning reminders (7-10 AM)
    if (hour >= 7 && hour <= 10) {
      if (userHabits?.water?.current < 2) {
        newNotifications.push({
          id: 'morning-water',
          type: 'reminder',
          title: 'Good morning!',
          message: 'Have you had your morning glass of water yet? Start your day hydrated! 💧',
          icon: Droplets,
          color: 'text-wellness-blue',
          actions: ['Log Water', 'Remind Later']
        });
      }

      if (!userHabits?.breakfast) {
        newNotifications.push({
          id: 'breakfast-reminder',
          type: 'reminder',
          title: 'Breakfast Time!',
          message: 'Fuel your body with a healthy breakfast. Have you eaten yet today? 🍳',
          icon: Coffee,
          color: 'text-wellness-orange',
          actions: ['Logged Breakfast', 'Get Tips']
        });
      }
    }

    // Midday check-ins (12-2 PM)
    if (hour >= 12 && hour <= 14) {
      if (userHabits?.exercise?.current < 15) {
        newNotifications.push({
          id: 'midday-movement',
          type: 'check-in',
          title: 'Movement Break!',
          message: 'How about a quick 10-minute walk? Your body will thank you! 🚶‍♀️',
          icon: Activity,
          color: 'text-wellness-green',
          actions: ['Log Activity', 'Set Reminder']
        });
      }
    }

    // Afternoon motivation (3-5 PM)
    if (hour >= 15 && hour <= 17) {
      newNotifications.push({
        id: 'afternoon-boost',
        type: 'encouragement',
        title: 'You\'re doing great!',
        message: 'Afternoon energy dip? Try some deep breathing or check your hydration! ✨',
        icon: Heart,
        color: 'text-wellness-purple',
        actions: ['Breathing Exercise', 'Mood Check']
      });
    }

    // Evening wind-down (8-10 PM)
    if (hour >= 20 && hour <= 22) {
      newNotifications.push({
        id: 'evening-reflection',
        type: 'check-in',
        title: 'Evening Reflection',
        message: 'How did your wellness goals go today? Time to wind down for quality sleep! 🌙',
        icon: Moon,
        color: 'text-wellness-blue',
        actions: ['Review Day', 'Sleep Tips']
      });
    }

    // Only add notifications that aren't already in queue
    const uniqueNotifications = newNotifications.filter(
      newNotif => !notifications.some(existing => existing.id === newNotif.id)
    );

    if (uniqueNotifications.length > 0) {
      setNotifications(prev => [...prev, ...uniqueNotifications]);
    }
  };

  const dismissNotification = () => {
    setCurrentNotification(null);
    setNotifications(prev => prev.slice(1));
  };

  const handleActionClick = (action: string) => {
    onActionClick?.(action);
    dismissNotification();
  };

  if (!currentNotification) return null;

  return (
    <div className="fixed top-20 right-6 w-80 z-40 animate-fade-in">
      <Card className="shadow-lg border-l-4 border-l-wellness-green bg-white/95 backdrop-blur-sm">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className={cn(
                "p-2 rounded-lg bg-wellness-light-green",
              )}>
                <currentNotification.icon className={cn("w-5 h-5", currentNotification.color)} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {currentNotification.title}
                </h4>
                <p className="text-sm text-gray-700 mb-3">
                  {currentNotification.message}
                </p>
                
                {currentNotification.actions && (
                  <div className="flex space-x-2">
                    {currentNotification.actions.map((action, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant={index === 0 ? "default" : "outline"}
                        onClick={() => handleActionClick(action)}
                        className="text-xs"
                      >
                        {action}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={dismissNotification}
              className="p-1 h-6 w-6"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

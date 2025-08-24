import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  X, 
  Send,
  Bot,
  User,
  Heart,
  Sparkles,
  Coffee,
  Moon,
  Sun,
  Droplets,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiService } from "@/services/apiService";

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface WellnessChatbotProps {
  userHabits?: any;
  userName?: string;
}

export default function WellnessChatbot({ userName = "friend", userHabits }: WellnessChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
    }
  }, [isOpen]);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getContextualPrompts = () => {
    const hour = new Date().getHours();
    const prompts = [];

    if (hour >= 6 && hour <= 10) {
      prompts.push(
        "Have you had your morning glass of water yet? 💧",
        "Did you log your breakfast today? 🍳",
        "How are you feeling this morning? Ready to tackle your goals? ✨"
      );
    } else if (hour >= 11 && hour <= 14) {
      prompts.push(
        "Time for a mid-day check-in! How's your energy level? ⚡",
        "Have you taken a movement break today? 🚶‍♀️",
        "Remember to stay hydrated! How many glasses of water so far? 💧"
      );
    } else if (hour >= 15 && hour <= 18) {
      prompts.push(
        "Afternoon slump? Try some deep breathing or a quick walk! 🫁",
        "How's your mood today? Need any wellness tips? 😊",
        "Have you completed your exercise goal for today? 💪"
      );
    } else {
      prompts.push(
        "How did your wellness goals go today? 🌟",
        "Time to wind down! Have you logged your evening routine? 🌙",
        "Preparing for good sleep? Remember your 8-hour goal! 😴"
      );
    }

    return prompts;
  };

  const initializeChat = async () => {
    const greeting = getTimeBasedGreeting();
    const prompts = getContextualPrompts();
    
    setIsTyping(true);
    setTimeout(async () => {
      const initialMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: `${greeting}, ${userName}! 🌟 I'm your wellness assistant. ${prompts[0]}`,
        timestamp: new Date(),
        suggestions: [
          "Show my progress",
          "Give me a tip",
          "Check my habits",
          "Motivational quote"
        ]
      };
      
      setMessages([initialMessage]);
      setIsTyping(false);
      
      // Add a follow-up message with quote
      setTimeout(async () => {
        setIsTyping(true);
        try {
          const quote = await apiService.getQuote();
          setTimeout(() => {
            const quoteMessage: Message = {
              id: (Date.now() + 1).toString(),
              type: 'bot',
              content: `Here's your daily inspiration: "${quote.text}" - ${quote.author} ✨`,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, quoteMessage]);
            setIsTyping(false);
          }, 1500);
        } catch (error) {
          setIsTyping(false);
        }
      }, 3000);
    }, 1000);
  };

  const getBotResponse = async (userMessage: string): Promise<string> => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('water') || message.includes('hydrat')) {
      return "Great question! Aim for 8 glasses of water daily. Try adding lemon or cucumber for variety! 💧 You can log your water intake on the Dashboard.";
    }
    
    if (message.includes('exercise') || message.includes('workout') || message.includes('activity')) {
      return "Exercise is amazing! Even 10 minutes makes a difference. Try the Habits page to track your daily movement goals! 💪";
    }
    
    if (message.includes('sleep') || message.includes('tired')) {
      return "Quality sleep is crucial! Aim for 7-9 hours. Try winding down 30 minutes before bed with no screens. 😴";
    }
    
    if (message.includes('stress') || message.includes('anxious') || message.includes('calm')) {
      return "I hear you! Try the breathing exercise in the Mood tracker - it's proven to reduce stress in just 5 minutes. 🫁";
    }
    
    if (message.includes('mood') || message.includes('feeling')) {
      return "Your emotional wellness matters! Check out the Mood page to track how you're feeling and get personalized suggestions. 😊";
    }
    
    if (message.includes('habit') || message.includes('goal')) {
      return "Building habits is a journey! The Habits page helps you track daily goals and build streaks. Small steps lead to big changes! 🎯";
    }
    
    if (message.includes('tip') || message.includes('advice')) {
      const tips = [
        "Start your day with a glass of water to boost metabolism! 💧",
        "Take a 2-minute breathing break every hour for better focus. 🫁",
        "Move your body for just 10 minutes to boost energy levels! ⚡",
        "Practice gratitude by writing down 3 good things daily. ✨",
        "Stay hydrated - your brain is 75% water! 🧠"
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }
    
    if (message.includes('quote') || message.includes('inspiration') || message.includes('motivat')) {
      try {
        const quote = await apiService.getQuote();
        return `Here's some inspiration: "${quote.text}" - ${quote.author} ✨`;
      } catch {
        return "Here's a thought: 'Your body can stand almost anything. It's your mind that you have to convince.' 💪";
      }
    }
    
    if (message.includes('progress') || message.includes('stats')) {
      return "Check your Dashboard for a complete overview of your wellness journey! You can see charts, streaks, and achievements there. 📊";
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return `${getTimeBasedGreeting()}! I'm here to help with your wellness journey. What would you like to know? 😊`;
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      return "You're so welcome! I'm here whenever you need wellness support. Keep up the great work! 🌟";
    }
    
    // Default responses
    const defaultResponses = [
      "I'm here to help with your wellness journey! Try asking about habits, tips, or your progress. 😊",
      "Great question! You can explore the Dashboard, Habits, Tips, and Mood pages for comprehensive wellness tracking. 🌟",
      "I'd love to help! Try asking me about water intake, exercise, sleep, or mood tracking. 💙",
      "Wellness is a journey! Let me know if you need tips for hydration, movement, sleep, or stress management. ✨"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(async () => {
      const botResponse = await getBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        suggestions: Math.random() > 0.5 ? [
          "Give me another tip",
          "Check my mood",
          "Show habits page",
          "More inspiration"
        ] : undefined
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, Math.random() * 1000 + 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage();
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50 transition-all",
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-wellness-green hover:bg-wellness-green/90"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 z-40 animate-fade-in">
          <Card className="h-full flex flex-col shadow-xl border-2 border-wellness-green/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Bot className="w-5 h-5 mr-2 text-wellness-green" />
                Wellness Assistant
                <Sparkles className="w-4 h-4 ml-auto text-wellness-orange" />
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-64">
                {messages.map((message) => (
                  <div key={message.id} className={cn(
                    "flex",
                    message.type === 'user' ? "justify-end" : "justify-start"
                  )}>
                    <div className={cn(
                      "max-w-[80%] rounded-lg p-3 text-sm",
                      message.type === 'user' 
                        ? "bg-wellness-green text-white" 
                        : "bg-gray-100 text-gray-800"
                    )}>
                      <div className="flex items-start space-x-2">
                        {message.type === 'bot' && (
                          <Bot className="w-4 h-4 mt-0.5 text-wellness-green flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p>{message.content}</p>
                          {message.suggestions && (
                            <div className="mt-2 space-y-1">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="h-6 text-xs mr-1 mb-1"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-wellness-green" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about wellness tips..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    disabled={!inputValue.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

// API service for external integrations

export interface Quote {
  text: string;
  author: string;
}

export interface WeatherData {
  condition: string;
  temperature: number;
  description: string;
  suggestion: string;
  icon: string;
}

export interface NutritionTip {
  title: string;
  message: string;
  calories?: number;
  type: "hydration" | "nutrition" | "exercise";
}

// Mock API calls with realistic data
// In a real app, these would call actual APIs

export const apiService = {
  // Motivational quotes API
  async getQuote(): Promise<Quote> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const quotes = [
      {
        text: "The groundwork for all happiness is good health.",
        author: "Leigh Hunt",
      },
      {
        text: "Take care of your body. It's the only place you have to live.",
        author: "Jim Rohn",
      },
      {
        text: "Health is a state of complete harmony of the body, mind and spirit.",
        author: "B.K.S. Iyengar",
      },
      { text: "The first wealth is health.", author: "Ralph Waldo Emerson" },
      {
        text: "Your body can stand almost anything. It's your mind that you have to convince.",
        author: "Unknown",
      },
      {
        text: "A healthy outside starts from the inside.",
        author: "Robert Urich",
      },
      {
        text: "Exercise is king. Nutrition is queen. Put them together and you've got a kingdom.",
        author: "Jack LaLanne",
      },
      {
        text: "The doctor of the future will give no medicines, but will interest his patients in the care of the human frame, in diet, and in the cause and prevention of disease.",
        author: "Thomas Edison",
      },
      {
        text: "Wellness is the complete integration of body, mind, and spirit.",
        author: "Greg Anderson",
      },
      {
        text: "To keep the body in good health is a duty... otherwise we shall not be able to keep our mind strong and clear.",
        author: "Buddha",
      },
    ];

    return quotes[Math.floor(Math.random() * quotes.length)];
  },

  // Weather API (simulated)
  async getWeather(): Promise<WeatherData> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const weatherConditions = [
      {
        condition: "sunny",
        temperature: 72,
        description: "Sunny and warm",
        suggestion:
          "Perfect weather for outdoor activities! Consider a 30-minute walk or jog.",
        icon: "☀️",
      },
      {
        condition: "cloudy",
        temperature: 65,
        description: "Partly cloudy",
        suggestion:
          "Great weather for outdoor exercises. Maybe try some yoga in the park?",
        icon: "⛅",
      },
      {
        condition: "rainy",
        temperature: 58,
        description: "Light rain",
        suggestion:
          "Indoor day! Perfect time for meditation, stretching, or home workouts.",
        icon: "🌧️",
      },
      {
        condition: "cold",
        temperature: 45,
        description: "Cold and crisp",
        suggestion:
          "Bundle up for a brisk walk, or enjoy a warm herbal tea while doing indoor exercises.",
        icon: "🌡️",
      },
    ];

    return weatherConditions[
      Math.floor(Math.random() * weatherConditions.length)
    ];
  },

  // Nutrition tips API (simulated)
  async getNutritionTips(habitData?: any): Promise<NutritionTip[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const tips = [
      {
        title: "Hydration Boost",
        message:
          "Start your day with a glass of warm lemon water to boost metabolism and hydration.",
        type: "hydration" as const,
      },
      {
        title: "Protein Power",
        message:
          "Include a palm-sized portion of protein in each meal to maintain stable energy levels.",
        calories: 150,
        type: "nutrition" as const,
      },
      {
        title: "Green Fuel",
        message:
          "Add a handful of spinach to your smoothie for iron, folate, and antioxidants.",
        calories: 25,
        type: "nutrition" as const,
      },
      {
        title: "Pre-Workout Snack",
        message:
          "Have a banana 30 minutes before exercise for quick, natural energy.",
        calories: 105,
        type: "exercise" as const,
      },
      {
        title: "Evening Wind-Down",
        message:
          "Chamomile tea before bed can improve sleep quality and reduce inflammation.",
        type: "hydration" as const,
      },
      {
        title: "Omega-3 Boost",
        message:
          "Include walnuts or chia seeds in your breakfast for brain health and inflammation reduction.",
        calories: 180,
        type: "nutrition" as const,
      },
      {
        title: "Mindful Eating",
        message:
          "Eat slowly and chew thoroughly to improve digestion and feel more satisfied.",
        type: "nutrition" as const,
      },
      {
        title: "Post-Workout Recovery",
        message:
          "Chocolate milk is an excellent post-workout recovery drink with the perfect protein-carb ratio.",
        calories: 160,
        type: "exercise" as const,
      },
    ];

    // Return 2-3 random tips
    const shuffled = [...tips].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 2) + 2);
  },

  // Calendar integration (mock)
  async addToCalendar(event: {
    title: string;
    time: string;
    type: string;
  }): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simulate successful calendar addition
    console.log(`Added to calendar: ${event.title} at ${event.time}`);
    return true;
  },

  // Mood tracking suggestions
  async getMoodSuggestions(mood: string): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const suggestions: Record<string, string[]> = {
      happy: [
        "Keep the momentum going with a fun outdoor activity!",
        "Share your positive energy by helping someone today.",
        "Journal about what made you happy to remember later.",
      ],
      sad: [
        "Try 10 minutes of deep breathing or meditation.",
        "Listen to uplifting music or call a friend.",
        "Go for a gentle walk in nature if possible.",
      ],
      stressed: [
        "Practice the 4-7-8 breathing technique for instant calm.",
        "Take a 5-minute break to stretch or move your body.",
        "Write down your worries to get them out of your head.",
      ],
      energetic: [
        "Channel that energy into a workout or dance session!",
        "Tackle a task you've been putting off.",
        "Do some creative work or start a new project.",
      ],
      tired: [
        "Make sure you're staying hydrated throughout the day.",
        "Consider a 10-20 minute power nap if possible.",
        "Check if you need more sleep or better sleep quality.",
      ],
    };

    return suggestions[mood] || suggestions.stressed;
  },
};

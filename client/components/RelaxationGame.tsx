import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Heart, Sparkles, Waves } from "lucide-react";
import { cn } from "@/lib/utils";

interface RelaxationGameProps {
  onComplete?: () => void;
}

type GamePhase = "inhale" | "hold" | "exhale" | "pause";

export default function RelaxationGame({ onComplete }: RelaxationGameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<GamePhase>("inhale");
  const [cycleCount, setCycleCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(4);
  const [totalTime, setTotalTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 4-7-8 breathing pattern (4 seconds inhale, 7 seconds hold, 8 seconds exhale)
  const breathingPattern = {
    inhale: 4,
    hold: 7,
    exhale: 8,
    pause: 1,
  };

  const phaseInstructions = {
    inhale: "Breathe in slowly...",
    hold: "Hold your breath...",
    exhale: "Breathe out gently...",
    pause: "Relax...",
  };

  const phaseColors = {
    inhale: "from-wellness-blue to-wellness-light-blue",
    hold: "from-wellness-green to-wellness-light-green",
    exhale: "from-wellness-purple to-purple-300",
    pause: "from-gray-400 to-gray-300",
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Move to next phase
            setCurrentPhase((currentPhase) => {
              const phases: GamePhase[] = ["inhale", "hold", "exhale", "pause"];
              const currentIndex = phases.indexOf(currentPhase);
              const nextPhase = phases[(currentIndex + 1) % phases.length];

              if (nextPhase === "inhale") {
                setCycleCount((count) => count + 1);
              }

              return nextPhase;
            });
            return breathingPattern[getNextPhase()];
          }
          return prev - 1;
        });
        setTotalTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentPhase]);

  const getNextPhase = (): GamePhase => {
    const phases: GamePhase[] = ["inhale", "hold", "exhale", "pause"];
    const currentIndex = phases.indexOf(currentPhase);
    return phases[(currentIndex + 1) % phases.length];
  };

  const toggleGame = () => {
    setIsPlaying(!isPlaying);
  };

  const resetGame = () => {
    setIsPlaying(false);
    setCurrentPhase("inhale");
    setCycleCount(0);
    setTimeRemaining(4);
    setTotalTime(0);
  };

  const handleComplete = () => {
    setIsPlaying(false);
    onComplete?.();
  };

  // Generate floating particles
  const particles = Array.from({ length: 6 }, (_, i) => (
    <div
      key={i}
      className={cn(
        "absolute w-2 h-2 bg-white/30 rounded-full animate-pulse",
        isPlaying && "animate-bounce",
      )}
      style={{
        left: `${20 + i * 15}%`,
        top: `${30 + (i % 2) * 20}%`,
        animationDelay: `${i * 0.5}s`,
        animationDuration: `${2 + i * 0.3}s`,
      }}
    />
  ));

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-center">
          <Heart className="w-5 h-5 mr-2 text-wellness-green" />
          Breathing Relaxation
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        {/* Breathing Circle Animation */}
        <div className="relative w-48 h-48 mx-auto">
          <div
            className={cn(
              "absolute inset-0 rounded-full bg-gradient-to-br transition-all duration-1000 flex items-center justify-center shadow-lg",
              phaseColors[currentPhase],
              isPlaying && currentPhase === "inhale" && "scale-110",
              isPlaying && currentPhase === "hold" && "scale-110",
              isPlaying && currentPhase === "exhale" && "scale-90",
              isPlaying && currentPhase === "pause" && "scale-100",
            )}
          >
            {particles}
            <div className="text-white text-center">
              <div className="text-3xl font-bold">{timeRemaining}</div>
              <div className="text-sm opacity-90">
                {phaseInstructions[currentPhase]}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Info */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Cycles completed:</span>
            <span className="font-medium">{cycleCount}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Time:</span>
            <span className="font-medium">
              {Math.floor(totalTime / 60)}:
              {(totalTime % 60).toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={toggleGame}
            className={cn(
              "flex items-center space-x-2",
              isPlaying
                ? "bg-wellness-orange hover:bg-wellness-orange/90"
                : "bg-wellness-green hover:bg-wellness-green/90",
            )}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isPlaying ? "Pause" : "Start"}</span>
          </Button>

          <Button
            onClick={resetGame}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </Button>
        </div>

        {/* Achievement */}
        {cycleCount >= 3 && (
          <div className="bg-wellness-light-green p-4 rounded-lg text-center animate-fade-in">
            <Sparkles className="w-6 h-6 text-wellness-green mx-auto mb-2" />
            <p className="text-sm text-wellness-green font-medium">
              Great job! You've completed {cycleCount} breathing cycles.
              {cycleCount >= 5 &&
                " You're doing amazing - your mind should feel calmer now! 🌟"}
            </p>
            {cycleCount >= 5 && (
              <Button
                onClick={handleComplete}
                className="mt-3 bg-wellness-green hover:bg-wellness-green/90"
                size="sm"
              >
                I feel better now! ✨
              </Button>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>🫁 Follow the 4-7-8 breathing pattern</p>
          <p>🧘‍♀️ Complete 5 cycles for maximum relaxation</p>
          <p>💙 Focus on the circle and let your thoughts drift</p>
        </div>
      </CardContent>
    </Card>
  );
}

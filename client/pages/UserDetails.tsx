import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User,
  Scale,
  Ruler,
  Calendar,
  Target,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface UserData {
  name: string;
  age: string;
  weight: string;
  height: string;
  fitnessGoal: string;
}

interface ValidationErrors {
  name?: string;
  age?: string;
  weight?: string;
  height?: string;
  fitnessGoal?: string;
}

const fitnessGoals = [
  { value: "weight-loss", label: "Weight Loss" },
  { value: "weight-gain", label: "Weight Gain" },
  { value: "maintenance", label: "Weight Maintenance" },
  { value: "muscle-gain", label: "Muscle Gain" },
  { value: "endurance", label: "Improve Endurance" },
  { value: "strength", label: "Build Strength" },
  { value: "flexibility", label: "Increase Flexibility" },
  { value: "general-health", label: "General Health & Wellness" }
];

export default function UserDetails() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserData>({
    name: "",
    age: "",
    weight: "",
    height: "",
    fitnessGoal: ""
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Check if user already has data
  useEffect(() => {
    const existingData = localStorage.getItem('wellness-user-data');
    if (existingData) {
      try {
        const userData = JSON.parse(existingData);
        setFormData(userData);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Age validation
    if (!formData.age) {
      newErrors.age = "Age is required";
    } else {
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 13 || age > 120) {
        newErrors.age = "Please enter a valid age (13-120)";
      }
    }

    // Weight validation
    if (!formData.weight) {
      newErrors.weight = "Weight is required";
    } else {
      const weight = parseFloat(formData.weight);
      if (isNaN(weight) || weight < 30 || weight > 500) {
        newErrors.weight = "Please enter a valid weight (30-500 lbs)";
      }
    }

    // Height validation
    if (!formData.height) {
      newErrors.height = "Height is required";
    } else {
      const height = parseFloat(formData.height);
      if (isNaN(height) || height < 36 || height > 96) {
        newErrors.height = "Please enter a valid height (36-96 inches)";
      }
    }

    // Fitness goal validation
    if (!formData.fitnessGoal) {
      newErrors.fitnessGoal = "Please select a fitness goal";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage (in real app, this would be an API call)
      localStorage.setItem('wellness-user-data', JSON.stringify(formData));
      
      setIsSubmitted(true);
      
      // Redirect to dashboard after showing success message
      setTimeout(() => {
        navigate('/');
      }, 2500);
      
    } catch (error) {
      console.error('Error saving user data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getHeightInFeet = (inches: string) => {
    const totalInches = parseFloat(inches);
    if (isNaN(totalInches)) return "";
    const feet = Math.floor(totalInches / 12);
    const remainingInches = totalInches % 12;
    return `${feet}' ${remainingInches}"`;
  };

  const getSelectedGoalLabel = () => {
    const goal = fitnessGoals.find(g => g.value === formData.fitnessGoal);
    return goal ? goal.label : "";
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wellness-light-green/20 to-wellness-light-blue/20">
        <Navigation />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="mb-6">
                <CheckCircle className="w-16 h-16 text-wellness-green mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-wellness-green mb-2">
                  Welcome, {formData.name}! 🎉
                </h1>
                <p className="text-lg text-gray-700 mb-4">
                  Your profile has been successfully created!
                </p>
              </div>
              
              <div className="bg-wellness-light-green/30 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-wellness-green mb-2">Your Profile Summary:</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><strong>Name:</strong> {formData.name}</p>
                  <p><strong>Age:</strong> {formData.age} years old</p>
                  <p><strong>Weight:</strong> {formData.weight} lbs</p>
                  <p><strong>Height:</strong> {getHeightInFeet(formData.height)} ({formData.height} inches)</p>
                  <p><strong>Fitness Goal:</strong> {getSelectedGoalLabel()}</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                Redirecting you to your personalized dashboard...
              </p>
              
              <div className="animate-pulse">
                <div className="w-8 h-8 bg-wellness-green rounded-full mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wellness-light-green/20 to-wellness-light-blue/20">
      <Navigation />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-wellness-green mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            Tell us about yourself to get personalized wellness recommendations
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-wellness-green" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={cn(errors.name && "border-red-500")}
                />
                {errors.name && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.name}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age" className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className={cn(errors.age && "border-red-500")}
                  min="13"
                  max="120"
                />
                {errors.age && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.age}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Weight and Height Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Weight */}
                <div className="space-y-2">
                  <Label htmlFor="weight" className="flex items-center">
                    <Scale className="w-4 h-4 mr-2" />
                    Weight (lbs)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="150"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className={cn(errors.weight && "border-red-500")}
                    min="30"
                    max="500"
                    step="0.1"
                  />
                  {errors.weight && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.weight}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Height */}
                <div className="space-y-2">
                  <Label htmlFor="height" className="flex items-center">
                    <Ruler className="w-4 h-4 mr-2" />
                    Height (inches)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="68"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className={cn(errors.height && "border-red-500")}
                    min="36"
                    max="96"
                    step="0.5"
                  />
                  {formData.height && !errors.height && (
                    <p className="text-sm text-gray-500">
                      That's {getHeightInFeet(formData.height)}
                    </p>
                  )}
                  {errors.height && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.height}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              {/* Fitness Goal */}
              <div className="space-y-2">
                <Label htmlFor="fitnessGoal" className="flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Primary Fitness Goal
                </Label>
                <Select 
                  value={formData.fitnessGoal} 
                  onValueChange={(value) => handleInputChange('fitnessGoal', value)}
                >
                  <SelectTrigger className={cn(errors.fitnessGoal && "border-red-500")}>
                    <SelectValue placeholder="Select your primary fitness goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {fitnessGoals.map((goal) => (
                      <SelectItem key={goal.value} value={goal.value}>
                        {goal.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fitnessGoal && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.fitnessGoal}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving Profile...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Profile & Start Wellness Journey
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Your information is stored securely and used only to personalize your wellness experience.
          </p>
        </div>
      </main>
    </div>
  );
}

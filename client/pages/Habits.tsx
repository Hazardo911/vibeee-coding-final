import Navigation from "@/components/Navigation";

export default function Habits() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wellness-light-green/20 to-wellness-light-blue/20">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-wellness-green mb-4">Habit Tracker</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track your daily habits and build healthy routines. This page will be implemented with habit logging functionality.
          </p>
          <div className="mt-8 p-8 bg-white/80 backdrop-blur-sm rounded-lg border border-wellness-light-green/20">
            <p className="text-gray-500">
              Habit tracking functionality coming soon! This will include daily habit logging, streak tracking, and progress visualization.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

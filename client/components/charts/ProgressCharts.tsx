import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

// Mock data for different chart types
const weeklyProgressData = [
  { day: 'Mon', water: 8, exercise: 45, meditation: 15, sleep: 8 },
  { day: 'Tue', water: 6, exercise: 30, meditation: 10, sleep: 7 },
  { day: 'Wed', water: 7, exercise: 60, meditation: 20, sleep: 8 },
  { day: 'Thu', water: 8, exercise: 45, meditation: 15, sleep: 7.5 },
  { day: 'Fri', water: 5, exercise: 30, meditation: 10, sleep: 6 },
  { day: 'Sat', water: 9, exercise: 90, meditation: 25, sleep: 9 },
  { day: 'Sun', water: 8, exercise: 60, meditation: 20, sleep: 8.5 }
];

const monthlyStreakData = [
  { week: 'Week 1', streaks: 3 },
  { week: 'Week 2', streaks: 5 },
  { week: 'Week 3', streaks: 4 },
  { week: 'Week 4', streaks: 6 }
];

const habitCompletionData = [
  { name: 'Water', value: 85, color: '#3B82F6' },
  { name: 'Exercise', value: 70, color: '#10B981' },
  { name: 'Meditation', value: 90, color: '#F59E0B' },
  { name: 'Sleep', value: 75, color: '#8B5CF6' }
];

interface ProgressChartsProps {
  type: 'weekly' | 'monthly' | 'habits';
  height?: number;
}

export function WeeklyProgressChart({ height = 300 }: { height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={weeklyProgressData}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis 
          dataKey="day" 
          tick={{ fontSize: 12 }}
          stroke="#6B7280"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="#6B7280"
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="water" 
          stroke="#3B82F6" 
          strokeWidth={2}
          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
          name="Water (glasses)"
        />
        <Line 
          type="monotone" 
          dataKey="exercise" 
          stroke="#10B981" 
          strokeWidth={2}
          dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
          name="Exercise (minutes)"
        />
        <Line 
          type="monotone" 
          dataKey="meditation" 
          stroke="#F59E0B" 
          strokeWidth={2}
          dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
          name="Meditation (minutes)"
        />
        <Line 
          type="monotone" 
          dataKey="sleep" 
          stroke="#8B5CF6" 
          strokeWidth={2}
          dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
          name="Sleep (hours)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function StreakChart({ height = 250 }: { height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={monthlyStreakData}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis 
          dataKey="week" 
          tick={{ fontSize: 12 }}
          stroke="#6B7280"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="#6B7280"
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Bar 
          dataKey="streaks" 
          fill="#10B981"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function HabitCompletionChart({ height = 250 }: { height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={habitCompletionData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={40}
          paddingAngle={5}
          dataKey="value"
        >
          {habitCompletionData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [`${value}%`, 'Completion Rate']}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function WaterIntakeChart({ height = 200 }: { height?: number }) {
  const waterData = weeklyProgressData.map(day => ({
    day: day.day,
    intake: day.water,
    target: 8
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={waterData}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis 
          dataKey="day" 
          tick={{ fontSize: 12 }}
          stroke="#6B7280"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="#6B7280"
          domain={[0, 10]}
        />
        <Tooltip 
          formatter={(value, name) => [
            `${value} glasses`, 
            name === 'intake' ? 'Actual' : 'Target'
          ]}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="intake" 
          stroke="#3B82F6" 
          fill="#3B82F6"
          fillOpacity={0.3}
          strokeWidth={2}
        />
        <Line 
          type="monotone" 
          dataKey="target" 
          stroke="#EF4444" 
          strokeWidth={2}
          strokeDasharray="5 5"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function ProgressCharts({ type, height = 300 }: ProgressChartsProps) {
  switch (type) {
    case 'weekly':
      return <WeeklyProgressChart height={height} />;
    case 'monthly':
      return <StreakChart height={height} />;
    case 'habits':
      return <HabitCompletionChart height={height} />;
    default:
      return <WeeklyProgressChart height={height} />;
  }
}

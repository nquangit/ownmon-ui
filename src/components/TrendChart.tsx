import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TimelineStats } from '../types';

interface TrendChartProps {
  data: TimelineStats[];
}

export function TrendChart({ data }: TrendChartProps) {
  // Transform data for chart
  const chartData = data.map(stat => ({
    date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    'Focus (hrs)': Number((stat.focus_secs / 3600).toFixed(1)),
    'Keystrokes (k)': Number((stat.keystrokes / 1000).toFixed(1)),
    'Clicks (k)': Number((stat.clicks / 1000).toFixed(1)),
  }));

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold text-brand-text mb-4">Activity Trends</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f1f28" />
          <XAxis 
            dataKey="date" 
            stroke="#a1a1aa"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#a1a1aa"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#13131a',
              border: '1px solid #1f1f28',
              borderRadius: '8px',
              color: '#e4e4e7'
            }}
          />
          <Legend 
            wrapperStyle={{ color: '#e4e4e7' }}
          />
          <Line 
            type="monotone" 
            dataKey="Focus (hrs)" 
            stroke="#F59E0B" 
            strokeWidth={2}
            dot={{ fill: '#F59E0B', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="Keystrokes (k)" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ fill: '#3B82F6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="Clicks (k)" 
            stroke="#10B981" 
            strokeWidth={2}
            dot={{ fill: '#10B981', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

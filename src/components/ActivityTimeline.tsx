import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { HourlyStats } from '../types';

interface ActivityTimelineProps {
  data: HourlyStats[];
}

export function ActivityTimeline({ data }: ActivityTimelineProps) {
  // Transform data for chart
  const chartData = data.map(stat => ({
    hour: `${stat.hour}:00`,
    Keystrokes: stat.keystrokes,
    Clicks: stat.clicks,
    'Focus (min)': Math.round(stat.focus_secs / 60),
  }));

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold text-brand-text mb-4">Hourly Activity</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f1f28" />
          <XAxis 
            dataKey="hour" 
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
          <Bar dataKey="Keystrokes" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Clicks" fill="#10B981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Focus (min)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

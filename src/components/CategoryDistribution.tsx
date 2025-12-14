import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { Category } from '../types';
import { formatTimeSeconds } from '../utils';

interface CategoryData {
  category: Category;
  focusTime: number;
}

interface CategoryDistributionProps {
  data: CategoryData[];
}

export function CategoryDistribution({ data }: CategoryDistributionProps) {
  const totalTime = data.reduce((sum, item) => sum + item.focusTime, 0);
  
  const chartData = data.map(item => ({
    name: item.category.name,
    value: item.focusTime,
    color: item.category.color,
    icon: item.category.icon,
    percentage: totalTime > 0 ? Math.round((item.focusTime / totalTime) * 100) : 0,
  }));

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold text-brand-text mb-4">Category Distribution</h2>
      
      {data.length === 0 ? (
        <p className="text-brand-text-muted text-sm">No category data available</p>
      ) : (
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(31, 31, 40, 0.98)',
                  border: '1px solid rgba(228, 228, 231, 0.2)',
                  borderRadius: '8px',
                  color: '#e4e4e7',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                }}
                labelStyle={{
                  color: '#e4e4e7',
                  fontWeight: 600,
                }}
                itemStyle={{
                  color: '#e4e4e7',
                }}
                formatter={(value: number) => formatTimeSeconds(value)}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div className="flex-1 space-y-2 w-full">
            {chartData.map((item, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-brand-surface/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-brand-text text-sm font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-brand-text text-sm font-semibold">
                    {formatTimeSeconds(item.value)}
                  </p>
                  <p className="text-brand-text-muted text-xs">
                    {item.percentage}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

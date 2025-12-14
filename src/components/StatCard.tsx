import { LucideIcon } from 'lucide-react';
import { cn } from '../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      'glass-card stat-card-glow p-6 transition-all duration-300 hover:scale-[1.02]',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-brand-text-muted text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-brand-text">{value}</p>
          
          {trend && (
            <div className={cn(
              'mt-2 text-sm font-medium flex items-center gap-1',
              trend.isPositive ? 'text-green-500' : 'text-red-500'
            )}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <Icon className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

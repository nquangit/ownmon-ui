import type { AppStats } from '../types';
import { formatTimeSeconds, formatNumber, getAppDisplayName } from '../utils';

interface TopAppsProps {
  apps: AppStats[];
}

export function TopApps({ apps }: TopAppsProps) {
  const maxFocusTime = Math.max(...apps.map(app => app.focus_time_secs), 1);

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold text-brand-text mb-4">Top Applications</h2>
      <div className="space-y-4">
        {apps.length === 0 ? (
          <p className="text-brand-text-muted text-sm">No application data available</p>
        ) : (
          apps.map((app, index) => {
            const percentage = (app.focus_time_secs / maxFocusTime) * 100;
            
            return (
              <div key={app.process_name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-brand-text-muted text-sm font-medium w-6">
                      #{index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-brand-text font-medium">
                        {getAppDisplayName(app.process_name)}
                      </p>
                      <p className="text-brand-text-muted text-xs">
                        {formatNumber(app.keystrokes)} keystrokes • {formatNumber(app.clicks)} clicks
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-brand-text font-semibold">
                      {formatTimeSeconds(app.focus_time_secs)}
                    </p>
                    <p className="text-brand-text-muted text-xs">
                      {app.session_count} sessions
                    </p>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="h-2 bg-brand-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Calendar, TrendingUp, Activity, Users } from 'lucide-react';
import { getTimelineStats, getCategories, getSessions } from '../services/api';
import { TrendChart } from '../components/TrendChart';
import { CategoryDistribution } from '../components/CategoryDistribution';
import { StatCard } from '../components/StatCard';
import type { TimelineStats, Category, Session } from '../types';

export function AnalyticsPage() {
  const [timelineData, setTimelineData] = useState<TimelineStats[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedDays, setSelectedDays] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedDays]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [timeline, cats, sessionsData] = await Promise.all([
        getTimelineStats(selectedDays),
        getCategories(),
        getSessions({ limit: 1000, order: 'desc' }),
      ]);

      setTimelineData(timeline);
      setCategories(cats);
      setSessions(sessionsData.sessions);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate category distribution
  const categoryDistribution = categories.map(category => {
    const categoryTime = sessions
      .filter(s => s.category.id === category.id)
      .reduce((sum, s) => sum + s.duration_secs, 0);
    
    return {
      category,
      focusTime: categoryTime,
    };
  }).filter(item => item.focusTime > 0);

  // Calculate total stats
  const totalSessions = sessions.length;
  const totalFocusTime = sessions.reduce((sum, s) => sum + s.duration_secs, 0);
  const avgSessionDuration = totalSessions > 0 ? totalFocusTime / totalSessions : 0;
  const uniqueApps = new Set(sessions.map(s => s.process_name)).size;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brand-text-muted">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-brand-text">Analytics</h1>
          <p className="text-brand-text-muted">Detailed insights and trends</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {[7, 14, 30].map(days => (
            <button
              key={days}
              onClick={() => setSelectedDays(days)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedDays === days
                  ? 'bg-blue-500 text-white'
                  : 'glass-card text-brand-text-muted hover:text-brand-text'
              }`}
            >
              {days} days
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Sessions"
          value={totalSessions}
          icon={Activity}
        />
        <StatCard
          title="Total Focus Time"
          value={`${Math.round(totalFocusTime / 3600)}h`}
          icon={TrendingUp}
        />
        <StatCard
          title="Avg Session Duration"
          value={`${Math.round(avgSessionDuration / 60)}m`}
          icon={Calendar}
        />
        <StatCard
          title="Unique Apps"
          value={uniqueApps}
          icon={Users}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <TrendChart data={timelineData} />
        </div>
        <div className="lg:col-span-2">
          <CategoryDistribution data={categoryDistribution} />
        </div>
      </div>

      {/* Productivity Insights */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-brand-text mb-4">Productivity Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <p className="text-sm text-brand-text-muted mb-1">Most Active Day</p>
            <p className="text-2xl font-bold text-brand-text">
              {timelineData.length > 0
                ? new Date(
                    timelineData.reduce((max, day) =>
                      day.focus_secs > max.focus_secs ? day : max
                    ).date
                  ).toLocaleDateString('en-US', { weekday: 'long' })
                : 'N/A'}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <p className="text-sm text-brand-text-muted mb-1">Avg Daily Sessions</p>
            <p className="text-2xl font-bold text-brand-text">
              {timelineData.length > 0
                ? Math.round(
                    timelineData.reduce((sum, day) => sum + day.sessions, 0) /
                      timelineData.length
                  )
                : 0}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <p className="text-sm text-brand-text-muted mb-1">Avg Daily Focus</p>
            <p className="text-2xl font-bold text-brand-text">
              {timelineData.length > 0
                ? `${Math.round(
                    timelineData.reduce((sum, day) => sum + day.focus_secs, 0) /
                      timelineData.length /
                      3600
                  )}h`
                : '0h'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

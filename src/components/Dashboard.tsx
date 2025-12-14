import { useEffect, useState, useMemo } from 'react';
import { Clock, Activity, Keyboard, Mouse, Calendar } from 'lucide-react';
import { StatCard } from './StatCard';
import { ActivityTimeline } from './ActivityTimeline';
import { TopApps } from './TopApps';
import { CategoryDistribution } from './CategoryDistribution';
import { CurrentActivity } from './CurrentActivity';
import { MediaPlayer } from './MediaPlayer';
import { TrendChart } from './TrendChart';
import { SessionList } from './SessionList';
import { ActivityFlowChart } from './ActivityFlowChart';
import {
  getDailyStats,
  getHourlyStats,
  getTopApps,
  getTimelineStats,
  getSessions,
  getCategories,
} from '../services/api';
import { websocketService } from '../services/websocket';
import type {
  DailyStats,
  HourlyStats,
  AppStats,
  TimelineStats,
  Session,
  Category,
  WebSocketMessage,
} from '../types';
import { formatTimeSeconds, formatNumber, getToday } from '../utils';

export function Dashboard() {
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [hourlyStats, setHourlyStats] = useState<HourlyStats[]>([]);
  const [topApps, setTopApps] = useState<AppStats[]>([]);
  const [trendData, setTrendData] = useState<TimelineStats[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    
    // Subscribe to WebSocket for initial state stats
    const unsubscribe = websocketService.subscribe((message: WebSocketMessage) => {
      if (message.type === 'initial_state' && message.data.stats) {
        // Update daily stats with initial state if available
        setDailyStats({
          sessions: message.data.stats.sessions,
          unique_apps: 0, // Not provided in initial_state
          keystrokes: message.data.stats.keystrokes,
          clicks: message.data.stats.clicks,
          focus_time_secs: message.data.stats.focus_time_secs,
          media_time_secs: 0, // Not provided in initial_state
        });
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [
        statsData,
        hourlyData,
        appsData,
        timelineData,
        sessionsData,
        categoriesData,
      ] = await Promise.all([
        getDailyStats(),
        getHourlyStats(getToday()),
        getTopApps(),
        getTimelineStats(7),
        getSessions({ limit: 10, order: 'desc' }),
        getCategories(),
      ]);

      setDailyStats(statsData);
      setHourlyStats(hourlyData);
      setTopApps(appsData.slice(0, 5));
      setTrendData(timelineData);
      setSessions(sessionsData.sessions);
      setSessionTotal(sessionsData.total);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate category distribution from sessions
  const categoryDistribution = useMemo(() => {
    if (!categories.length || !sessions.length) return [];
    
    // Map category ID to total focus time
    const categoryMap = new Map<number, number>();
    
    sessions.forEach(session => {
      const categoryId = session.category.id;
      const currentTime = categoryMap.get(categoryId) || 0;
      categoryMap.set(categoryId, currentTime + session.duration_secs);
    });

    // Create category data array
    return categories
      .map(category => ({
        category,
        focusTime: categoryMap.get(category.id) || 0,
      }))
      .filter(item => item.focusTime > 0)
      .sort((a, b) => b.focusTime - a.focusTime); // Sort by focus time descending
  }, [categories, sessions]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brand-text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-brand-text">
          OwnMon Dashboard
        </h1>
        <p className="text-brand-text-muted flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Focus Time"
          value={dailyStats ? formatTimeSeconds(dailyStats.focus_time_secs) : '0h'}
          icon={Clock}
        />
        <StatCard
          title="Active Sessions"
          value={dailyStats?.sessions || 0}
          icon={Activity}
        />
        <StatCard
          title="Keystrokes"
          value={dailyStats ? formatNumber(dailyStats.keystrokes) : '0'}
          icon={Keyboard}
        />
        <StatCard
          title="Mouse Clicks"
          value={dailyStats ? formatNumber(dailyStats.clicks) : '0'}
          icon={Mouse}
        />
      </div>

      {/* Activity Flow Timeline - Moved to top for visibility */}
      <ActivityFlowChart />

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityTimeline data={hourlyStats} />
        </div>
        <div>
          <CurrentActivity />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendChart data={trendData} />
        </div>
        <div>
          <MediaPlayer />
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopApps apps={topApps} />
        <CategoryDistribution data={categoryDistribution} />
      </div>

      {/* Sessions List */}
      <SessionList 
        sessions={sessions} 
        total={sessionTotal}
        hasMore={sessions.length < sessionTotal}
        onLoadMore={() => {
          // Load more sessions
          getSessions({ 
            limit: 10, 
            offset: sessions.length, 
            order: 'desc' 
          }).then(data => {
            setSessions(prev => [...prev, ...data.sessions]);
          });
        }}
      />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Clock, Music } from 'lucide-react';
import { getSessions, getMedia } from '../services/api';
import type { Session, Media } from '../types';
import { getAppDisplayName, formatTimeSeconds, getToday } from '../utils';

interface TimelineBlock {
  type: 'session' | 'media';
  startTime: Date;
  endTime: Date;
  data: Session | Media;
}

export function ActivityFlowChart() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredBlock, setHoveredBlock] = useState<TimelineBlock | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchTimelineData();
  }, []);

  const fetchTimelineData = async () => {
    try {
      setLoading(true);
      const today = getToday();
      
      const [sessionsData, mediaData] = await Promise.all([
        getSessions({ date: today, limit: 2000, order: 'asc' }),
        getMedia({ date: today, limit: 2000, order: 'asc' }),
      ]);

      setSessions(sessionsData.sessions);
      setMediaItems(mediaData.history);
    } catch (error) {
      console.error('Error fetching timeline data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate active time range (truncate empty periods)
  const getActiveTimeRange = () => {
    const allTimes: Date[] = [];
    
    sessions.forEach(session => {
      allTimes.push(new Date(session.start_time));
      if (session.end_time) allTimes.push(new Date(session.end_time));
    });
    
    mediaItems.forEach(media => {
      allTimes.push(new Date(media.start_time));
      if (media.end_time) allTimes.push(new Date(media.end_time));
    });

    if (allTimes.length === 0) {
      // Default to current hour if no data
      const now = new Date();
      return {
        startHour: now.getHours(),
        endHour: now.getHours() + 1,
      };
    }

    const minTime = new Date(Math.min(...allTimes.map(d => d.getTime())));
    const maxTime = new Date(Math.max(...allTimes.map(d => d.getTime())));

    // Round down start hour, round up end hour, add 1 hour padding
    const startHour = Math.max(0, minTime.getHours() - 1);
    const endHour = Math.min(23, maxTime.getHours() + 1);

    return { startHour, endHour };
  };

  const { startHour, endHour } = getActiveTimeRange();
  const hourRange = endHour - startHour + 1;

  // Calculate position and width for timeline blocks (adjusted for truncated range)
  const getBlockStyle = (startTime: Date, endTime: Date) => {
    const rangeStartMs = new Date(startTime).setHours(startHour, 0, 0, 0);
    const rangeEndMs = new Date(startTime).setHours(endHour, 59, 59, 999);

    const totalRangeMs = rangeEndMs - rangeStartMs;
    const blockStartMs = startTime.getTime() - rangeStartMs;
    const blockDurationMs = endTime.getTime() - startTime.getTime();

    const left = (blockStartMs / totalRangeMs) * 100;
    const width = (blockDurationMs / totalRangeMs) * 100;

    return {
      left: `${Math.max(0, left)}%`,
      width: `${Math.max(width, 0.1)}%`, // Minimum width for visibility
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  if (loading) {
    return (
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-brand-text mb-4">Activity Flow</h2>
        <div className="flex items-center justify-center h-40">
          <div className="text-brand-text-muted text-sm">Loading timeline...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card p-6" onMouseMove={handleMouseMove}>
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-bold text-brand-text">Activity Flow</h2>
        </div>

      {/* Time labels - showing only active hours */}
      <div className="relative mb-2">
        <div className="flex justify-between text-xs text-brand-text-muted px-1">
          {Array.from({ length: hourRange }, (_, i) => {
            const hour = startHour + i;
            return (
              <span key={hour} className="text-center flex-1">
                {i % 2 === 0 ? `${hour}:00` : ''}
              </span>
            );
          })}
        </div>
      </div>

      {/* Sessions Timeline */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded bg-blue-500" />
          <span className="text-sm text-brand-text-muted">Applications</span>
        </div>
        <div className="relative h-20 bg-brand-border rounded-lg overflow-hidden">
          {sessions.map((session, idx) => {
            if (!session.end_time) return null;
            
            const startTime = new Date(session.start_time);
            const endTime = new Date(session.end_time);
            const style = getBlockStyle(startTime, endTime);

            return (
              <div
                key={`session-${idx}`}
                className={`absolute h-full cursor-pointer transition-opacity ${
                  session.is_idle ? 'opacity-30' : 'hover:opacity-80'
                }`}
                style={{
                  ...style,
                  backgroundColor: session.is_idle ? '#6B7280' : session.category.color,
                }}
                onMouseEnter={() => setHoveredBlock({ type: 'session', startTime, endTime, data: session })}
                onMouseLeave={() => setHoveredBlock(null)}
              />
            );
          })}
        </div>
      </div>

      {/* Media Timeline */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Music className="w-3 h-3 text-purple-400" />
          <span className="text-sm text-brand-text-muted">Media Playback</span>
        </div>
        <div className="relative h-20 bg-brand-border rounded-lg overflow-hidden">
          {mediaItems.map((media, idx) => {
            if (!media.end_time) return null;
            
            const startTime = new Date(media.start_time);
            const endTime = new Date(media.end_time);
            const style = getBlockStyle(startTime, endTime);

            return (
              <div
                key={`media-${idx}`}
                className="absolute h-full cursor-pointer transition-opacity hover:opacity-80"
                style={{
                  ...style,
                  background: 'linear-gradient(90deg, #9333ea 0%, #ec4899 100%)',
                }}
                onMouseEnter={() => setHoveredBlock({ type: 'media', startTime, endTime, data: media })}
                onMouseLeave={() => setHoveredBlock(null)}
              />
            );
          })}
        </div>
      </div>
    </div>

      {/* Hover Tooltip - Rendered outside container to avoid z-index issues */}
      {hoveredBlock && (
        <div
          className="fixed glass-card p-3 border border-brand-border shadow-2xl max-w-xs pointer-events-none"
          style={{
            left: `${mousePosition.x + 15}px`,
            top: `${mousePosition.y + 15}px`,
            zIndex: 99999,
          }}
        >
          {hoveredBlock.type === 'session' ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: (hoveredBlock.data as Session).is_idle ? '#6B7280' : (hoveredBlock.data as Session).category.color }}
                />
                <span className="text-sm font-semibold text-brand-text">
                  {(hoveredBlock.data as Session).is_idle 
                    ? '💤 Idle Time' 
                    : getAppDisplayName((hoveredBlock.data as Session).process_name)}
                </span>
              </div>
              {!(hoveredBlock.data as Session).is_idle && (
                <p className="text-xs text-brand-text-muted line-clamp-2">
                  {(hoveredBlock.data as Session).window_title}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-brand-text-muted pt-1">
                <span>{hoveredBlock.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                <span>→</span>
                <span>{hoveredBlock.endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-xs text-brand-text">
                Duration: {formatTimeSeconds((hoveredBlock.data as Session).duration_secs)}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Music className="w-3 h-3 text-purple-400" />
                <span className="text-sm font-semibold text-brand-text">
                  {(hoveredBlock.data as Media).title}
                </span>
              </div>
              <p className="text-xs text-brand-text-muted">
                {(hoveredBlock.data as Media).artist}
              </p>
              {(hoveredBlock.data as Media).album && (
                <p className="text-xs text-brand-text-muted">
                  {(hoveredBlock.data as Media).album}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-brand-text-muted pt-1">
                <span>{hoveredBlock.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                <span>→</span>
                <span>{hoveredBlock.endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

import { Clock, Keyboard, Mouse, ChevronRight } from 'lucide-react';
import type { Session } from '../types';
import { formatTimeSeconds, getAppDisplayName } from '../utils';

interface SessionListProps {
  sessions: Session[];
  total: number;
  hasMore: boolean;
  onLoadMore: () => void;
}

export function SessionList({ sessions, total, hasMore, onLoadMore }: SessionListProps) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-brand-text">Recent Sessions</h2>
        <span className="text-sm text-brand-text-muted">{total} total</span>
      </div>

      <div className="space-y-3">
        {sessions.length === 0 ? (
          <p className="text-brand-text-muted text-sm text-center py-8">
            No sessions found
          </p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={`p-4 rounded-lg border transition-all hover:bg-brand-surface/30 ${
                session.is_idle 
                  ? 'border-gray-600 opacity-50' 
                  : 'border-brand-border hover:border-blue-500/30'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: session.is_idle ? '#6B7280' : session.category.color }}
                    />
                    <div>
                      <h3 className="text-brand-text font-medium">
                        {session.is_idle ? '💤 Idle Time' : getAppDisplayName(session.process_name)}
                      </h3>
                      {!session.is_idle && (
                        <p className="text-xs text-brand-text-muted line-clamp-1">
                          {session.window_title}
                        </p>
                      )}
                    </div>
                  </div>
                  <div
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: session.is_idle ? '#6B728020' : `${session.category.color}20`,
                      color: session.is_idle ? '#9CA3AF' : session.category.color,
                    }}
                  >
                    {session.is_idle ? 'Idle' : `${session.category.icon} ${session.category.name}`}
                  </div>
                </div>

                {/* Time Range */}
                <div className="flex items-center gap-2 text-xs text-brand-text-muted">
                  <span>
                    {new Date(session.start_time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <ChevronRight className="w-3 h-3" />
                  <span>
                    {session.end_time
                      ? new Date(session.end_time).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Ongoing'}
                  </span>
                </div>

                {/* Stats */}
                {!session.is_idle && (
                  <div className="flex items-center gap-4 text-xs text-brand-text-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeSeconds(session.duration_secs)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Keyboard className="w-3 h-3" />
                      {session.keystrokes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mouse className="w-3 h-3" />
                      {session.clicks}
                    </span>
                  </div>
                )}

                {/* Idle session stats */}
                {session.is_idle && (
                  <div className="flex items-center gap-2 text-xs text-brand-text-muted">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeSeconds(session.duration_secs)} away</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <button
          onClick={onLoadMore}
          className="w-full mt-4 px-4 py-2 rounded-lg bg-brand-surface hover:bg-brand-border text-brand-text transition-colors"
        >
          Load More
        </button>
      )}
    </div>
  );
}

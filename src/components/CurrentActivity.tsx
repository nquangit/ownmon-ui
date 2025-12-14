import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { websocketService } from '../services/websocket';
import type { WebSocketMessage } from '../types';
import { getAppDisplayName } from '../utils';

export function CurrentActivity() {
  const [currentSession, setCurrentSession] = useState<{
    processName: string;
    windowTitle: string;
    timestamp: string;
  } | null>(null);
  
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Connect to WebSocket
    websocketService.connect();

    // Subscribe to session changes
    const unsubscribe = websocketService.subscribe((message: WebSocketMessage) => {
      // Handle initial state message
      if (message.type === 'initial_state' && message.data.session) {
        const startTime = new Date(message.data.session.start_time);
        const now = new Date();
        const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        
        setCurrentSession({
          processName: message.data.session.process_name,
          windowTitle: message.data.session.window_title,
          timestamp: message.data.session.start_time,
        });
        setDuration(Math.max(0, elapsedSeconds)); // Set to actual elapsed time
      }
      // Handle session change updates
      else if (message.type === 'session_change' && message.data.process_name) {
        setCurrentSession({
          processName: message.data.process_name,
          windowTitle: message.data.window_title || '',
          timestamp: message.timestamp,
        });
        setDuration(0); // Reset duration for new session
      }
    });

    // Cleanup
    return () => {
      unsubscribe();
    };
  }, []);

  // Update duration counter
  useEffect(() => {
    if (!currentSession) return;

    const interval = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSession]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-blue-400" />
        <h2 className="text-xl font-bold text-brand-text">Current Activity</h2>
        {websocketService.isConnected() && (
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-brand-text-muted">Live</span>
          </div>
        )}
      </div>

      {currentSession ? (
        <div className="space-y-3">
          <div>
            <p className="text-brand-text-muted text-sm">Application</p>
            <p className="text-brand-text font-semibold text-lg">
              {getAppDisplayName(currentSession.processName)}
            </p>
          </div>
          
          <div>
            <p className="text-brand-text-muted text-sm">Window Title</p>
            <p className="text-brand-text text-sm line-clamp-2">
              {currentSession.windowTitle || 'N/A'}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-brand-border">
            <span className="text-brand-text-muted text-sm">Duration</span>
            <span className="text-brand-text font-mono text-lg font-semibold">
              {formatDuration(duration)}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-brand-text-muted mx-auto mb-2 opacity-50" />
          <p className="text-brand-text-muted text-sm">
            Waiting for activity...
          </p>
        </div>
      )}
    </div>
  );
}

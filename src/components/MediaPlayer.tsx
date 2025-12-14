import { useEffect, useState } from 'react';
import { Music, Play, Pause } from 'lucide-react';
import { websocketService } from '../services/websocket';
import { getMedia } from '../services/api';
import type { CurrentMedia, Media, WebSocketMessage } from '../types';
import { formatTimeSeconds } from '../utils';

export function MediaPlayer() {
  const [currentMedia, setCurrentMedia] = useState<CurrentMedia | null>(null);
  const [recentMedia, setRecentMedia] = useState<Media[]>([]);

  useEffect(() => {
    // Fetch initial media data
    fetchMediaData();

    // Connect to WebSocket
    websocketService.connect();

    // Subscribe to media updates
    const unsubscribe = websocketService.subscribe((message: WebSocketMessage) => {
      // Handle initial state message
      if (message.type === 'initial_state' && message.data.media) {
        setCurrentMedia({
          title: message.data.media.title,
          artist: message.data.media.artist,
          album: message.data.media.album,
          source_app: 'Unknown', // Not provided in initial_state
          start_time: message.data.media.start_time,
          duration_secs: 0, // Not provided in initial_state
          is_playing: message.data.media.is_playing,
        });
      }
      // Handle media update messages (fetch full data)
      else if (message.type === 'media_update') {
        fetchMediaData();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchMediaData = async () => {
    try {
      const data = await getMedia({ limit: 5 });
      setCurrentMedia(data.current);
      setRecentMedia(data.history);
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Music className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-bold text-brand-text">Media Player</h2>
      </div>

      {currentMedia ? (
        <div className="space-y-4">
          {/* Currently Playing */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                {currentMedia.is_playing ? (
                  <Play className="w-8 h-8 text-white fill-white" />
                ) : (
                  <Pause className="w-8 h-8 text-white" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-brand-text font-semibold truncate">
                  {currentMedia.title}
                </p>
                <p className="text-brand-text-muted text-sm truncate">
                  {currentMedia.artist}
                </p>
                {currentMedia.album && (
                  <p className="text-brand-text-muted text-xs truncate">
                    {currentMedia.album}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                    {currentMedia.source_app}
                  </span>
                  <span className="text-xs text-brand-text-muted">
                    {formatTimeSeconds(currentMedia.duration_secs)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Tracks */}
          {recentMedia.length > 0 && (
            <div>
              <p className="text-brand-text-muted text-sm font-medium mb-2">Recent</p>
              <div className="space-y-2">
                {recentMedia.slice(0, 3).map((media) => (
                  <div 
                    key={media.id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-brand-surface/30 transition-colors"
                  >
                    <Music className="w-4 h-4 text-brand-text-muted flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-brand-text text-sm truncate">
                        {media.title}
                      </p>
                      <p className="text-brand-text-muted text-xs truncate">
                        {media.artist}
                      </p>
                    </div>
                    <span className="text-xs text-brand-text-muted flex-shrink-0">
                      {formatTimeSeconds(media.duration_secs)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Music className="w-12 h-12 text-brand-text-muted mx-auto mb-2 opacity-50" />
          <p className="text-brand-text-muted text-sm">
            No media playing
          </p>
        </div>
      )}
    </div>
  );
}

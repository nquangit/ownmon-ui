// TypeScript types for OwnMon API

export interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
}

export interface Session {
  id: number;
  process_name: string;
  window_title: string;
  start_time: string;
  end_time: string | null;
  keystrokes: number;
  clicks: number;
  scrolls: number;
  duration_secs: number;
  is_idle: boolean;
  category: Category;
}

export interface SessionsResponse {
  sessions: Session[];
  total: number;
  limit: number;
  offset: number;
}

export interface Media {
  id: number;
  title: string;
  artist: string;
  album: string | null;
  source_app: string;
  start_time: string;
  end_time: string | null;
  duration_secs: number;
}

export interface CurrentMedia {
  title: string;
  artist: string;
  album: string | null;
  source_app: string;
  start_time: string;
  duration_secs: number;
  is_playing: boolean;
}

export interface MediaResponse {
  current: CurrentMedia | null;
  history: Media[];
  total: number;
  limit: number;
  offset: number;
}

export interface DailyStats {
  sessions: number;
  unique_apps: number;
  keystrokes: number;
  clicks: number;
  focus_time_secs: number;
  media_time_secs: number;
}

export interface DailyStatsResponse {
  date: string;
  keystrokes: number;
  clicks: number;
  focus_secs: number;
}

export interface HourlyStats {
  hour: number;
  keystrokes: number;
  clicks: number;
  sessions: number;
  focus_secs: number;
}

export interface TimelineStats {
  date: string;
  keystrokes: number;
  clicks: number;
  sessions: number;
  focus_secs: number;
}

export interface AppStats {
  process_name: string;
  focus_time_secs: number;
  keystrokes: number;
  clicks: number;
  session_count: number;
}

export interface ConfigSetting {
  key: string;
  value: string;
  description: string;
}

export interface ConfigResponse {
  settings: ConfigSetting[];
}

export interface HealthResponse {
  status: string;
  version: string;
}

export interface WebSocketMessage {
  type: 'initial_state' | 'session_change' | 'media_update';
  data: {
    // For initial_state
    session?: {
      process_name: string;
      window_title: string;
      start_time: string;
    };
    media?: {
      title: string;
      artist: string;
      album: string | null;
      is_playing: boolean;
      start_time: string;
    };
    stats?: {
      sessions: number;
      keystrokes: number;
      clicks: number;
      focus_time_secs: number;
    };
    // For session_change and media_update
    process_name?: string;
    window_title?: string;
    title?: string;
    artist?: string;
    album?: string;
  };
  timestamp: string;
}

// Query parameter types
export interface SessionQueryParams {
  date?: string;
  from?: string;
  to?: string;
  app?: string;
  category?: number;
  limit?: number;
  offset?: number;
  order?: 'asc' | 'desc';
}

export interface MediaQueryParams {
  date?: string;
  from?: string;
  to?: string;
  artist?: string;
  source_app?: string;
  limit?: number;
  offset?: number;
  order?: 'asc' | 'desc';
}

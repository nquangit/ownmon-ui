import type {
  SessionsResponse,
  MediaResponse,
  DailyStats,
  DailyStatsResponse,
  HourlyStats,
  TimelineStats,
  AppStats,
  Category,
  HealthResponse,
  SessionQueryParams,
  MediaQueryParams,
  ConfigResponse,
} from '../types';

const BASE_URL = 'http://127.0.0.1:13234';

/**
 * Build query string from params object
 */
function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
  try {
    const queryString = params ? `?${buildQueryString(params)}` : '';
    const response = await fetch(`${BASE_URL}${endpoint}${queryString}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Health check
 */
export async function checkHealth(): Promise<HealthResponse> {
  return fetchAPI<HealthResponse>('/health');
}

/**
 * Get sessions with optional filtering
 */
export async function getSessions(params?: SessionQueryParams): Promise<SessionsResponse> {
  return fetchAPI<SessionsResponse>('/api/sessions', params);
}

/**
 * Get media history with optional filtering
 */
export async function getMedia(params?: MediaQueryParams): Promise<MediaResponse> {
  return fetchAPI<MediaResponse>('/api/media', params);
}

/**
 * Get today's live stats (from memory)
 */
export async function getDailyStats(): Promise<DailyStats> {
  return fetchAPI<DailyStats>('/api/stats');
}

/**
 * Get aggregated stats for a specific date (from database)
 */
export async function getDailyStatsForDate(date?: string): Promise<DailyStatsResponse> {
  return fetchAPI<DailyStatsResponse>('/api/stats/daily', date ? { date } : undefined);
}

/**
 * Get hourly breakdown for charts
 */
export async function getHourlyStats(date?: string): Promise<HourlyStats[]> {
  return fetchAPI<HourlyStats[]>('/api/stats/hourly', date ? { date } : undefined);
}

/**
 * Get timeline data for trend charts
 */
export async function getTimelineStats(days: number = 7): Promise<TimelineStats[]> {
  return fetchAPI<TimelineStats[]>('/api/stats/timeline', { days });
}

/**
 * Get top apps ranked by focus time
 */
export async function getTopApps(): Promise<AppStats[]> {
  return fetchAPI<AppStats[]>('/api/apps');
}

/**
 * Get category for a specific app
 */
export async function getAppCategory(appName: string): Promise<Category> {
  return fetchAPI<Category>(`/api/apps/${encodeURIComponent(appName)}/category`);
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  return fetchAPI<Category[]>('/api/categories');
}

/**
 * Get configuration settings
 */
export async function getConfig(): Promise<ConfigResponse> {
  return fetchAPI<ConfigResponse>('/api/config');
}

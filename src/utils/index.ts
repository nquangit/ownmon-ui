import { intervalToDuration } from 'date-fns';

/**
 * Format seconds to a human-readable duration string
 * Examples: "2h 30m", "45m 12s", "8s"
 */
export function formatTimeSeconds(seconds: number): string {
  if (seconds === 0) return '0s';
  
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
  
  const parts: string[] = [];
  if (duration.hours) parts.push(`${duration.hours}h`);
  if (duration.minutes) parts.push(`${duration.minutes}m`);
  if (duration.seconds && !duration.hours) parts.push(`${duration.seconds}s`);
  
  return parts.join(' ') || '0s';
}

/**
 * Format a large number with commas
 * Example: 1234567 -> "1,234,567"
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Get a readable app name from process name
 * Example: "chrome.exe" -> "Chrome"
 */
export function getAppDisplayName(processName: string): string {
  return processName
    .replace(/\.exe$/i, '')
    .replace(/\.app$/i, '')
    .replace(/[_-]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get color from category color string (handles both hex and named colors)
 */
export function getCategoryColor(color: string): string {
  return color.startsWith('#') ? color : `var(--category-${color})`;
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getToday(): string {
  return formatDate(new Date());
}

/**
 * Get date N days ago in YYYY-MM-DD format
 */
export function getDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatDate(date);
}

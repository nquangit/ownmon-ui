import { useEffect, useState } from 'react';
import { Search, Filter, Calendar, Download } from 'lucide-react';
import { getSessions, getCategories } from '../services/api';
import { SessionList } from '../components/SessionList';
import type { Session, Category } from '../types';
import { getToday, getDaysAgo } from '../utils';

export function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState('today');
  const [currentOffset, setCurrentOffset] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [dateRange, selectedCategory, currentOffset]);

  useEffect(() => {
    applyFilters();
  }, [sessions, searchQuery]);

  const fetchCategories = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const params: any = {
        limit: 50,
        offset: currentOffset,
        order: 'desc' as const,
      };

      if (dateRange === 'today') {
        params.date = getToday();
      } else if (dateRange === '7days') {
        params.from = new Date(getDaysAgo(7)).toISOString();
      } else if (dateRange === '30days') {
        params.from = new Date(getDaysAgo(30)).toISOString();
      }

      if (selectedCategory !== null) {
        params.category = selectedCategory;
      }

      const data = await getSessions(params);
      setSessions(data.sessions);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...sessions];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        s =>
          s.process_name.toLowerCase().includes(query) ||
          s.window_title.toLowerCase().includes(query)
      );
    }

    setFilteredSessions(filtered);
  };

  const loadMore = async () => {
    const newOffset = currentOffset + 50;
    setCurrentOffset(newOffset);
    
    const params: any = {
      limit: 50,
      offset: newOffset,
      order: 'desc' as const,
    };

    if (dateRange === 'today') {
      params.date = getToday();
    }
    if (selectedCategory !== null) {
      params.category = selectedCategory;
    }

    const data = await getSessions(params);
    setSessions([...sessions, ...data.sessions]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-brand-text">Sessions</h1>
        <p className="text-brand-text-muted">Browse and search your activity history</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search */}
          <div className="md:col-span-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
              <input
                type="text"
                placeholder="Search apps or window titles..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-brand-surface border border-brand-border rounded-lg text-brand-text placeholder:text-brand-text-muted focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
              <select
                value={selectedCategory ?? ''}
                onChange={e => {
                  setSelectedCategory(e.target.value ? Number(e.target.value) : null);
                  setCurrentOffset(0);
                }}
                className="w-full pl-10 pr-4 py-2 bg-brand-surface border border-brand-border rounded-lg text-brand-text focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Range */}
          <div className="md:col-span-3">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
              <select
                value={dateRange}
                onChange={e => {
                  setDateRange(e.target.value);
                  setCurrentOffset(0);
                }}
                className="w-full pl-10 pr-4 py-2 bg-brand-surface border border-brand-border rounded-lg text-brand-text focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="today">Today</option>
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="all">All time</option>
              </select>
            </div>
          </div>

          {/* Export Button */}
          <div className="md:col-span-1">
            <button
              onClick={() => alert('Export functionality coming soon!')}
              className="w-full h-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              title="Export sessions"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-brand-text-muted">
        <span>
          Showing {filteredSessions.length} of {total} sessions
        </span>
        {searchQuery && (
          <span>Filtered by: "{searchQuery}"</span>
        )}
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brand-text-muted">Loading sessions...</p>
        </div>
      ) : (
        <SessionList
          sessions={filteredSessions}
          total={total}
          hasMore={sessions.length < total}
          onLoadMore={loadMore}
        />
      )}
    </div>
  );
}

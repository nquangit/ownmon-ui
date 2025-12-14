import { useEffect, useState } from 'react';
import { RefreshCw, Tag } from 'lucide-react';
import { getCategories } from '../services/api';
import type { Category } from '../types';

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const cats = await getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-brand-text">Categories</h1>
        <p className="text-brand-text-muted">Manage activity categories and their colors</p>
      </div>

      {/* Categories Section */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-brand-text">All Categories</h2>
            <p className="text-sm text-brand-text-muted">Activity categories for session organization</p>
          </div>
          <button
            onClick={fetchCategories}
            className="flex items-center gap-2 px-4 py-2 bg-brand-surface hover:bg-brand-border rounded-lg text-brand-text transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-brand-text-muted">Loading categories...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map(category => (
              <div
                key={category.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-brand-border hover:bg-brand-surface/30 transition-colors"
              >
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-2xl">{category.icon}</span>
                <div className="flex-1">
                  <p className="text-brand-text font-medium">{category.name}</p>
                  <p className="text-xs text-brand-text-muted">ID: {category.id}</p>
                </div>
                <div
                  className="px-3 py-1 rounded-full text-xs font-medium font-mono"
                  style={{
                    backgroundColor: `${category.color}20`,
                    color: category.color,
                  }}
                >
                  {category.color}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="glass-card p-4 border-l-4 border-blue-500">
        <div className="flex items-start gap-3">
          <Tag className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-brand-text font-medium mb-1">Category Management</p>
            <p className="text-xs text-brand-text-muted">
              Categories are automatically assigned to applications based on their behavior and usage patterns. 
              Category colors are used throughout the dashboard for consistent visual identification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

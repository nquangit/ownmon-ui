import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  List, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity
} from 'lucide-react';
import { cn } from '../utils/cn';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Sessions', href: '/sessions', icon: List },
  { name: 'Categories', href: '/categories', icon: Activity },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  return (
    <div
      className={cn(
        'flex flex-col h-screen glass-card border-r border-brand-border transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-brand-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl font-bold text-brand-text">OwnMon</h1>
          </div>
        )}
        {isCollapsed && (
          <Activity className="w-6 h-6 text-purple-400 mx-auto" />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200',
                'hover:bg-brand-surface/50',
                isActive
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-brand-text border border-blue-500/30'
                  : 'text-brand-text-muted hover:text-brand-text',
                isCollapsed && 'justify-center'
              )
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center p-4 border-t border-brand-border hover:bg-brand-surface/30 transition-colors"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-5 h-5 text-brand-text-muted" />
        ) : (
          <div className="flex items-center gap-2 text-brand-text-muted">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Collapse</span>
          </div>
        )}
      </button>
    </div>
  );
}

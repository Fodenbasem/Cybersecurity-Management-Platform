import { LayoutDashboard, FileText, Activity, AlertTriangle, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/auth-context';
import { DashboardView } from './dashboard';

interface DashboardSidebarProps {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  id: DashboardView;
  label: string;
  icon: React.ElementType;
  allowedRoles: string[];
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['admin', 'soc-analyst', 'pentester', 'client'],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
    allowedRoles: ['admin', 'soc-analyst', 'pentester', 'client'],
  },
  {
    id: 'threats',
    label: 'Threat Monitor',
    icon: Activity,
    allowedRoles: ['admin', 'soc-analyst'],
  },
  {
    id: 'incidents',
    label: 'Incidents',
    icon: AlertTriangle,
    allowedRoles: ['admin', 'soc-analyst', 'pentester'],
  },
  {
    id: 'admin',
    label: 'Admin Panel',
    icon: Settings,
    allowedRoles: ['admin'],
  },
];

export function DashboardSidebar({ activeView, onViewChange, collapsed, onToggleCollapse }: DashboardSidebarProps) {
  const { user } = useAuth();

  if (!user) return null;

  const visibleItems = navItems.filter(item => item.allowedRoles.includes(user.role));

  return (
    <aside
      className={`fixed left-0 top-[73px] h-[calc(100vh-73px)] bg-slate-900 border-r border-slate-800 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <nav className="p-4">
        <ul className="space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  } ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? item.label : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={onToggleCollapse}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 p-2 bg-slate-800 hover:bg-slate-750 rounded-lg transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-slate-400" />
        )}
      </button>
    </aside>
  );
}

import { useState } from 'react';
import { useAuth } from '../../context/auth-context';
import { DashboardHeader } from './dashboard-header';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardHome } from './dashboard-home';
import { ReportsSection } from '../reports/reports-section';
import { AdminPanel } from '../admin/admin-panel';
import { ThreatMonitor } from '../threat-monitor';
import { IncidentManagement } from '../incident-management';

export type DashboardView = 'home' | 'reports' | 'threats' | 'incidents' | 'admin';

export function Dashboard() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<DashboardView>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950">
      <DashboardHeader />
      
      <div className="flex">
        <DashboardSidebar
          activeView={activeView}
          onViewChange={setActiveView}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="p-8">
            {activeView === 'home' && <DashboardHome />}
            {activeView === 'reports' && <ReportsSection />}
            {activeView === 'threats' && <ThreatMonitor />}
            {activeView === 'incidents' && <IncidentManagement />}
            {activeView === 'admin' && user.role === 'admin' && <AdminPanel />}
          </div>
        </main>
      </div>

      {/* Guardian Status Indicator */}
      <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-slate-900 border border-emerald-500/30 rounded-lg px-4 py-2 shadow-lg backdrop-blur-sm">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-emerald-400 font-medium">Guardian Active</span>
      </div>
    </div>
  );
}

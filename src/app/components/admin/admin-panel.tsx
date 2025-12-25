import { Users, Shield, Activity, Settings as SettingsIcon, UserCheck, UserX } from 'lucide-react';
import { useAuth } from '../../context/auth-context';
import { useReports } from '../../context/reports-context';

export function AdminPanel() {
  const { user } = useAuth();
  const { reports } = useReports();

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Access Denied: Administrator privileges required</p>
      </div>
    );
  }

  const totalReports = reports.length;
  const pendingReview = reports.filter(r => r.status === 'submitted' || r.status === 'under-review').length;
  const approvedReports = reports.filter(r => r.status === 'approved').length;
  const rejectedReports = reports.filter(r => r.status === 'rejected').length;

  // Mock user data
  const mockUsers = [
    { id: '1', name: 'System Administrator', email: 'admin@zerosight.com', role: 'admin', status: 'active', lastLogin: '2 hours ago' },
    { id: '2', name: 'Sarah Chen', email: 'analyst@zerosight.com', role: 'soc-analyst', status: 'active', lastLogin: '5 min ago' },
    { id: '3', name: 'Alex Rodriguez', email: 'pentester@zerosight.com', role: 'pentester', status: 'active', lastLogin: '1 hour ago' },
    { id: '4', name: 'John Smith', email: 'client@techcorp.com', role: 'client', status: 'active', lastLogin: '3 hours ago' },
    { id: '5', name: 'Mike Johnson', email: 'mike@zerosight.com', role: 'soc-analyst', status: 'inactive', lastLogin: '2 days ago' },
  ];

  const roleColors: Record<string, string> = {
    admin: 'text-red-400 bg-red-500/20',
    'soc-analyst': 'text-blue-400 bg-blue-500/20',
    pentester: 'text-purple-400 bg-purple-500/20',
    client: 'text-emerald-400 bg-emerald-500/20',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Administration Panel</h2>
        <p className="text-slate-400 mt-1">System configuration and user management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value="5" color="blue" />
        <StatCard icon={Shield} label="Total Reports" value={String(totalReports)} color="emerald" />
        <StatCard icon={Activity} label="Pending Review" value={String(pendingReview)} color="yellow" />
        <StatCard icon={UserCheck} label="Approved" value={String(approvedReports)} color="emerald" />
      </div>

      {/* User Management */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">User Management</h3>
            <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm">
              Add User
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {mockUsers.map((mockUser) => (
                <tr key={mockUser.id} className="hover:bg-slate-800/30">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-white">{mockUser.name}</p>
                      <p className="text-xs text-slate-400">{mockUser.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${roleColors[mockUser.role]}`}>
                      {mockUser.role.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      mockUser.status === 'active' 
                        ? 'text-emerald-400 bg-emerald-500/20' 
                        : 'text-slate-400 bg-slate-500/20'
                    }`}>
                      {mockUser.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{mockUser.lastLogin}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-sm text-blue-400 hover:text-blue-300">Edit</button>
                      <span className="text-slate-600">•</span>
                      <button className="text-sm text-red-400 hover:text-red-300">
                        {mockUser.status === 'active' ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            System Configuration
          </h3>
          <div className="space-y-3">
            <SettingItem label="Two-Factor Authentication" enabled={true} />
            <SettingItem label="IP Whitelist" enabled={false} />
            <SettingItem label="Auto-Approve Reports" enabled={false} />
            <SettingItem label="Email Notifications" enabled={true} />
            <SettingItem label="Audit Logging" enabled={true} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Admin Actions</h3>
          <div className="space-y-3">
            <ActionItem action="Report RPT-2024-001 approved" time="10 min ago" />
            <ActionItem action="User 'Mike Johnson' status changed to inactive" time="2 hours ago" />
            <ActionItem action="System settings updated" time="5 hours ago" />
            <ActionItem action="New user 'John Smith' created" time="1 day ago" />
            <ActionItem action="Report RPT-2024-002 submitted" time="1 day ago" />
          </div>
        </div>
      </div>

      {/* Report Statistics */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Report Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-slate-800/50 rounded-lg">
            <p className="text-2xl font-bold text-white">{totalReports}</p>
            <p className="text-sm text-slate-400">Total</p>
          </div>
          <div className="text-center p-4 bg-slate-800/50 rounded-lg">
            <p className="text-2xl font-bold text-slate-400">{reports.filter(r => r.status === 'draft').length}</p>
            <p className="text-sm text-slate-400">Drafts</p>
          </div>
          <div className="text-center p-4 bg-slate-800/50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-400">{pendingReview}</p>
            <p className="text-sm text-slate-400">Pending</p>
          </div>
          <div className="text-center p-4 bg-slate-800/50 rounded-lg">
            <p className="text-2xl font-bold text-emerald-400">{approvedReports}</p>
            <p className="text-sm text-slate-400">Approved</p>
          </div>
          <div className="text-center p-4 bg-slate-800/50 rounded-lg">
            <p className="text-2xl font-bold text-red-400">{rejectedReports}</p>
            <p className="text-sm text-slate-400">Rejected</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: 'blue' | 'emerald' | 'yellow' | 'red';
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    red: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <div className={`p-2 rounded-lg ${colorClasses[color]} w-fit mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}

function SettingItem({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
      <span className="text-sm text-slate-300">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked={enabled} />
        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
      </label>
    </div>
  );
}

function ActionItem({ action, time }: { action: string; time: string }) {
  return (
    <div className="flex items-center justify-between p-2 bg-slate-800/30 rounded">
      <span className="text-sm text-slate-300">{action}</span>
      <span className="text-xs text-slate-500">{time}</span>
    </div>
  );
}

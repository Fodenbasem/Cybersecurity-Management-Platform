import { Shield, AlertTriangle, CheckCircle, Activity, TrendingUp, FileText, Users, Clock } from 'lucide-react';
import { useAuth } from '../../context/auth-context';
import { useReports } from '../../context/reports-context';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const threatData = [
  { time: '00:00', threats: 12 },
  { time: '04:00', threats: 8 },
  { time: '08:00', threats: 24 },
  { time: '12:00', threats: 45 },
  { time: '16:00', threats: 32 },
  { time: '20:00', threats: 18 },
];

const incidentsByType = [
  { name: 'Malware', value: 35, color: '#ef4444' },
  { name: 'Phishing', value: 28, color: '#f59e0b' },
  { name: 'DDoS', value: 15, color: '#10b981' },
  { name: 'Unauthorized', value: 22, color: '#3b82f6' },
];

export function DashboardHome() {
  const { user } = useAuth();
  const { reports, getReportsByRole } = useReports();

  if (!user) return null;

  const userReports = getReportsByRole(user.id, user.role);
  const pendingReports = reports.filter(r => r.status === 'submitted' || r.status === 'under-review').length;
  const criticalReports = userReports.filter(r => r.severity === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold text-white">
          Welcome back, {user.name.split(' ')[0]}
        </h2>
        <p className="text-slate-400 mt-1">
          {user.role === 'admin' && 'System administrator dashboard - Full access to all security operations'}
          {user.role === 'soc-analyst' && 'SOC analyst dashboard - Monitor threats and manage incidents'}
          {user.role === 'pentester' && 'Pentester dashboard - View reports and security findings'}
          {user.role === 'client' && 'Client dashboard - Access your security reports and status'}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Shield}
          label="Active Threats"
          value="18"
          trend="-12%"
          trendUp={false}
          color="emerald"
        />
        <MetricCard
          icon={AlertTriangle}
          label={user.role === 'admin' ? 'Pending Review' : 'Open Incidents'}
          value={user.role === 'admin' ? String(pendingReports) : '7'}
          trend="+3"
          trendUp={true}
          color="red"
        />
        <MetricCard
          icon={FileText}
          label="Your Reports"
          value={String(userReports.length)}
          trend={criticalReports > 0 ? `${criticalReports} critical` : 'Up to date'}
          trendUp={criticalReports === 0}
          color="blue"
        />
        <MetricCard
          icon={Activity}
          label="System Health"
          value="98.7%"
          trend="+0.3%"
          trendUp={true}
          color="emerald"
        />
      </div>

      {/* Charts */}
      {(user.role === 'admin' || user.role === 'soc-analyst') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Threat Activity */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h3 className="font-semibold text-white mb-4">Threat Activity (24h)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={threatData}>
                <defs>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="threats" stroke="#10b981" fillOpacity={1} fill="url(#colorThreats)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Incidents by Type */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h3 className="font-semibold text-white mb-4">Incidents by Type</h3>
            <div className="flex items-center justify-between">
              <ResponsiveContainer width="50%" height={250}>
                <PieChart>
                  <Pie
                    data={incidentsByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {incidentsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {incidentsByType.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-slate-300">{item.name}</span>
                    <span className="text-sm text-slate-400">({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Reports */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Recent Reports</h3>
          <button className="text-sm text-emerald-400 hover:text-emerald-300">View All</button>
        </div>
        <div className="space-y-3">
          {userReports.slice(0, 5).map((report) => (
            <div key={report.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  report.severity === 'critical' ? 'text-red-400 bg-red-500/20' :
                  report.severity === 'high' ? 'text-orange-400 bg-orange-500/20' :
                  report.severity === 'medium' ? 'text-yellow-400 bg-yellow-500/20' :
                  'text-blue-400 bg-blue-500/20'
                }`}>
                  {report.severity.toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">{report.title}</p>
                  <p className="text-xs text-slate-400">{report.id} • {report.authorName}</p>
                </div>
              </div>
              <span className={`text-xs font-medium ${
                report.status === 'draft' ? 'text-slate-400' :
                report.status === 'submitted' ? 'text-yellow-400' :
                report.status === 'approved' ? 'text-emerald-400' :
                'text-blue-400'
              }`}>
                {report.status.charAt(0).toUpperCase() + report.status.slice(1).replace('-', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  color: 'emerald' | 'red' | 'blue' | 'amber';
}

function MetricCard({ icon: Icon, label, value, trend, trendUp, color }: MetricCardProps) {
  const colorClasses = {
    emerald: 'bg-emerald-500/20 text-emerald-400',
    red: 'bg-red-500/20 text-red-400',
    blue: 'bg-blue-500/20 text-blue-400',
    amber: 'bg-amber-500/20 text-amber-400',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`text-sm ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend}
        </span>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}

import { AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/auth-context';

export function IncidentManagement() {
  const { user } = useAuth();

  if (!user || (user.role !== 'admin' && user.role !== 'soc-analyst' && user.role !== 'pentester')) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Access Denied: Analyst privileges required</p>
      </div>
    );
  }

  const mockIncidents = [
    {
      id: 'INC-2024-001',
      title: 'SQL Injection Attack Detected',
      severity: 'critical',
      status: 'investigating',
      assignee: 'Sarah Chen',
      created: '2 hours ago',
    },
    {
      id: 'INC-2024-002',
      title: 'Suspicious Network Traffic',
      severity: 'high',
      status: 'open',
      assignee: 'Mike Johnson',
      created: '4 hours ago',
    },
    {
      id: 'INC-2024-003',
      title: 'Malware on Workstation',
      severity: 'high',
      status: 'mitigated',
      assignee: 'Alex Rodriguez',
      created: '1 day ago',
    },
  ];

  const severityColors: Record<string, string> = {
    critical: 'text-red-400 bg-red-500/20 border-red-500/30',
    high: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
    medium: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
  };

  const statusColors: Record<string, string> = {
    open: 'text-red-400',
    investigating: 'text-orange-400',
    mitigated: 'text-blue-400',
    resolved: 'text-emerald-400',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Incident Management</h2>
        <p className="text-slate-400 mt-1">Track and manage security incidents</p>
      </div>

      <div className="space-y-3">
        {mockIncidents.map((incident) => (
          <div key={incident.id} className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-emerald-500/50 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-slate-400">{incident.id}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${severityColors[incident.severity]}`}>
                  {incident.severity.toUpperCase()}
                </span>
              </div>
              <span className={`text-xs font-medium ${statusColors[incident.status]}`}>
                {incident.status.toUpperCase()}
              </span>
            </div>
            <h3 className="font-semibold text-white mb-2">{incident.title}</h3>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>Assigned: {incident.assignee}</span>
              <span>Created: {incident.created}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

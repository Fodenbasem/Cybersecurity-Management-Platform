import { Activity, Globe, Shield, Zap, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/auth-context';

export function ThreatMonitor() {
  const { user } = useAuth();

  if (!user || (user.role !== 'admin' && user.role !== 'soc-analyst')) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Access Denied: SOC privileges required</p>
      </div>
    );
  }

  const realTimeThreats = [
    { id: 1, type: 'SQL Injection', source: '185.220.101.45', target: 'Web Server 01', severity: 'critical', time: '2 sec ago' },
    { id: 2, type: 'Port Scan', source: '192.168.1.105', target: 'Database', severity: 'medium', time: '5 sec ago' },
    { id: 3, type: 'Brute Force', source: '203.0.113.78', target: 'SSH Server', severity: 'high', time: '8 sec ago' },
    { id: 4, type: 'DDoS Attempt', source: 'Multiple IPs', target: 'Load Balancer', severity: 'high', time: '12 sec ago' },
    { id: 5, type: 'Malware Detected', source: 'WS-042', target: 'Endpoint', severity: 'critical', time: '15 sec ago' },
  ];

  const severityColors: Record<string, string> = {
    critical: 'text-red-400 bg-red-500/20 border-red-500/50',
    high: 'text-orange-400 bg-orange-500/20 border-orange-500/50',
    medium: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50',
    low: 'text-blue-400 bg-blue-500/20 border-blue-500/50',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Real-Time Threat Monitor</h2>
          <p className="text-slate-400 mt-1">Live security threat detection and analysis</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-3 py-2">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-sm text-emerald-400">Live Monitoring</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={AlertCircle} label="Active Threats" value="18" color="red" />
        <StatCard icon={Shield} label="Blocked Attacks" value="342" color="emerald" />
        <StatCard icon={Zap} label="Threat Score" value="72/100" color="orange" />
        <StatCard icon={Globe} label="Attack Sources" value="156" color="blue" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h3 className="font-semibold text-white mb-4">Real-Time Threat Feed</h3>
        <div className="space-y-2">
          {realTimeThreats.map((threat) => (
            <div
              key={threat.id}
              className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors border-l-2 border-transparent hover:border-l-emerald-500"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`px-2 py-1 rounded text-xs font-medium border ${severityColors[threat.severity]}`}>
                  {threat.severity.toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{threat.type}</p>
                  <p className="text-xs text-slate-400">
                    <span className="text-red-400">{threat.source}</span> → <span className="text-blue-400">{threat.target}</span>
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-500">{threat.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: 'red' | 'emerald' | 'orange' | 'blue';
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    red: 'bg-red-500/20 text-red-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    orange: 'bg-orange-500/20 text-orange-400',
    blue: 'bg-blue-500/20 text-blue-400',
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

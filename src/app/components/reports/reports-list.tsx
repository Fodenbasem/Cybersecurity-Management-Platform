import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Report, ReportStatus, ReportSeverity } from '../../context/reports-context';

interface ReportsListProps {
  reports: Report[];
  selectedReportId: string | null;
  onSelectReport: (id: string) => void;
}

export function ReportsList({ reports, selectedReportId, onSelectReport }: ReportsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<ReportStatus | 'all'>('all');
  const [filterSeverity, setFilterSeverity] = useState<ReportSeverity | 'all'>('all');

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || report.severity === filterSeverity;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const statusColors: Record<ReportStatus, string> = {
    'draft': 'text-slate-400 bg-slate-500/20',
    'submitted': 'text-yellow-400 bg-yellow-500/20',
    'under-review': 'text-blue-400 bg-blue-500/20',
    'approved': 'text-emerald-400 bg-emerald-500/20',
    'rejected': 'text-red-400 bg-red-500/20',
    'closed': 'text-slate-400 bg-slate-500/20',
  };

  const severityColors: Record<ReportSeverity, string> = {
    'critical': 'text-red-400 border-red-500/50',
    'high': 'text-orange-400 border-orange-500/50',
    'medium': 'text-yellow-400 border-yellow-500/50',
    'low': 'text-blue-400 border-blue-500/50',
    'informational': 'text-slate-400 border-slate-500/50',
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ReportStatus | 'all')}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="under-review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as ReportSeverity | 'all')}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="informational">Info</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-2 max-h-[calc(100vh-350px)] overflow-y-auto pr-2">
        {filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No reports found</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <button
              key={report.id}
              onClick={() => onSelectReport(report.id)}
              className={`w-full text-left p-4 rounded-lg transition-all border ${
                selectedReportId === report.id
                  ? 'bg-slate-800 border-emerald-500'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-mono text-slate-400">{report.id}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[report.status]}`}>
                  {report.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              <h3 className="text-sm font-medium text-white mb-2 line-clamp-2">{report.title}</h3>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${severityColors[report.severity]}`}>
                  {report.severity.toUpperCase()}
                </span>
                <span className="text-xs text-slate-500">
                  by {report.authorName}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

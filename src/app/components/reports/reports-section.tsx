import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../context/auth-context';
import { useReports } from '../../context/reports-context';
import { ReportsList } from './reports-list';
import { ReportDetail } from './report-detail';
import { CreateReportModal } from './create-report-modal';

export function ReportsSection() {
  const { user } = useAuth();
  const { getReportsByRole } = useReports();
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (!user) return null;

  const userReports = getReportsByRole(user.id, user.role);
  const selectedReport = userReports.find(r => r.id === selectedReportId);

  const canCreateReport = user.role === 'admin' || user.role === 'soc-analyst' || user.role === 'pentester' || user.role === 'client';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Reports Management</h2>
          <p className="text-slate-400 mt-1">
            {user.role === 'admin' && 'Review, approve, and manage all security reports'}
            {user.role === 'soc-analyst' && 'Create and submit security analysis reports'}
            {user.role === 'pentester' && 'Create penetration testing reports and view findings'}
            {user.role === 'client' && 'Create reports and view approved security findings'}
          </p>
        </div>
        {canCreateReport && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            Create Report
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Reports List */}
        <div className="lg:col-span-2">
          <ReportsList
            reports={userReports}
            selectedReportId={selectedReportId}
            onSelectReport={setSelectedReportId}
          />
        </div>

        {/* Report Detail */}
        <div className="lg:col-span-3">
          {selectedReport ? (
            <ReportDetail report={selectedReport} />
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center">
              <div className="text-slate-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-400 mb-2">No Report Selected</h3>
              <p className="text-sm text-slate-500">Select a report from the list to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Report Modal */}
      {isCreateModalOpen && (
        <CreateReportModal
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
}

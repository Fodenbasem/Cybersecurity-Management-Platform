import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../context/auth-context';
import { useReports, ReportSeverity, ReportVisibility } from '../../context/reports-context';

interface CreateReportModalProps {
  onClose: () => void;
}

export function CreateReportModal({ onClose }: CreateReportModalProps) {
  const { user } = useAuth();
  const { createReport } = useReports();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<ReportSeverity>('medium');
  const [visibility, setVisibility] = useState<ReportVisibility>('internal');

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createReport({
      title,
      description,
      severity,
      status: 'draft',
      visibility,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Create New Report</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Report Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              placeholder="Enter a descriptive title for the report"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              placeholder="Provide detailed information about the security findings, vulnerabilities, or incident"
              required
            />
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Severity Level <span className="text-red-400">*</span>
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as ReportSeverity)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="critical">Critical - Immediate action required</option>
              <option value="high">High - Urgent attention needed</option>
              <option value="medium">Medium - Important but not urgent</option>
              <option value="low">Low - Minor issue</option>
              <option value="informational">Informational - For awareness</option>
            </select>
          </div>

          {/* Visibility - Only for Admin */}
          {user.role === 'admin' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Visibility <span className="text-red-400">*</span>
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as ReportVisibility)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="client">Client Visible - Approved reports visible to clients</option>
                <option value="internal">Internal Only - SOC team and pentesters</option>
                <option value="admin">Admin Only - Restricted to administrators</option>
              </select>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-sm text-blue-400">
              <strong>Note:</strong> This report will be created in <strong>Draft</strong> status. 
              {user.role !== 'admin' && ' You can edit it before submitting for review. Once submitted, you will not be able to make changes.'}
              {user.role === 'admin' && ' As an administrator, you can edit and approve reports at any time.'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !description.trim()}
              className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Create Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

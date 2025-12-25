import { useState } from 'react';
import { Edit2, Send, CheckCircle, XCircle, Lock, MessageSquare, Clock, User, Eye, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/auth-context';
import { useReports, Report, ReportSeverity, ReportVisibility } from '../../context/reports-context';

interface ReportDetailProps {
  report: Report;
}

export function ReportDetail({ report }: ReportDetailProps) {
  const { user } = useAuth();
  const { updateReport, submitReport, reviewReport, addComment, canEditReport, deleteReport } = useReports();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(report.title);
  const [editedDescription, setEditedDescription] = useState(report.description);
  const [editedSeverity, setEditedSeverity] = useState<ReportSeverity>(report.severity);
  const [editedVisibility, setEditedVisibility] = useState<ReportVisibility>(report.visibility);
  const [newComment, setNewComment] = useState('');

  if (!user) return null;

  const canEdit = canEditReport(report, user.id, user.role);
  const canReview = user.role === 'admin' && (report.status === 'submitted' || report.status === 'under-review');
  const canSubmit = report.authorId === user.id && report.status === 'draft';
  const canDelete = user.role === 'admin' || (report.authorId === user.id && report.status === 'draft');

  const handleSave = () => {
    updateReport(report.id, {
      title: editedTitle,
      description: editedDescription,
      severity: editedSeverity,
      visibility: editedVisibility,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(report.title);
    setEditedDescription(report.description);
    setEditedSeverity(report.severity);
    setEditedVisibility(report.visibility);
    setIsEditing(false);
  };

  const handleSubmit = () => {
    if (window.confirm('Submit this report for review? You will not be able to edit it after submission.')) {
      submitReport(report.id, user.id, user.name);
    }
  };

  const handleApprove = () => {
    if (window.confirm('Approve this report? It will become visible per visibility settings.')) {
      reviewReport(report.id, true, user.id, user.name);
    }
  };

  const handleReject = () => {
    if (window.confirm('Reject this report? The author will need to revise and resubmit.')) {
      reviewReport(report.id, false, user.id, user.name);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Delete this report permanently? This action cannot be undone.')) {
      deleteReport(report.id);
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(report.id, {
        authorId: user.id,
        authorName: user.name,
        authorRole: user.role,
        content: newComment,
      });
      setNewComment('');
    }
  };

  const statusColors: Record<string, string> = {
    'draft': 'text-slate-400 bg-slate-500/20',
    'submitted': 'text-yellow-400 bg-yellow-500/20',
    'under-review': 'text-blue-400 bg-blue-500/20',
    'approved': 'text-emerald-400 bg-emerald-500/20',
    'rejected': 'text-red-400 bg-red-500/20',
    'closed': 'text-slate-400 bg-slate-500/20',
  };

  const severityColors: Record<string, string> = {
    'critical': 'text-red-400 bg-red-500/20 border-red-500/50',
    'high': 'text-orange-400 bg-orange-500/20 border-orange-500/50',
    'medium': 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50',
    'low': 'text-blue-400 bg-blue-500/20 border-blue-500/50',
    'informational': 'text-slate-400 bg-slate-500/20 border-slate-500/50',
  };

  const visibilityIcons: Record<ReportVisibility, string> = {
    'client': '🌐',
    'internal': '🔒',
    'admin': '🔐',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                placeholder="Report title"
              />
            ) : (
              <h2 className="text-xl font-bold text-white">{report.title}</h2>
            )}
            <p className="text-sm text-slate-400 mt-1 font-mono">{report.id}</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-4">
            {canEdit && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                title="Edit report"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {isEditing && (
              <>
                <button
                  onClick={handleSave}
                  className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm"
                >
                  Cancel
                </button>
              </>
            )}
            {canSubmit && !isEditing && (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm"
                title="Submit for review"
              >
                <Send className="w-4 h-4" />
                Submit
              </button>
            )}
            {canReview && (
              <>
                <button
                  onClick={handleApprove}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm"
                  title="Approve report"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                  title="Reject report"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </>
            )}
            {canDelete && !isEditing && (
              <button
                onClick={handleDelete}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                title="Delete report"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-3 py-1 rounded text-sm font-medium ${statusColors[report.status]}`}>
            {report.status.replace('-', ' ').toUpperCase()}
          </span>
          
          {isEditing ? (
            <select
              value={editedSeverity}
              onChange={(e) => setEditedSeverity(e.target.value as ReportSeverity)}
              className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="critical">CRITICAL</option>
              <option value="high">HIGH</option>
              <option value="medium">MEDIUM</option>
              <option value="low">LOW</option>
              <option value="informational">INFO</option>
            </select>
          ) : (
            <span className={`px-3 py-1 rounded border text-sm font-medium ${severityColors[report.severity]}`}>
              {report.severity.toUpperCase()}
            </span>
          )}

          {(user.role === 'admin' || isEditing) ? (
            isEditing ? (
              <select
                value={editedVisibility}
                onChange={(e) => setEditedVisibility(e.target.value as ReportVisibility)}
                className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="client">Client Visible</option>
                <option value="internal">Internal Only</option>
                <option value="admin">Admin Only</option>
              </select>
            ) : (
              <span className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-400 rounded text-sm font-medium">
                <span>{visibilityIcons[report.visibility]}</span>
                {report.visibility.toUpperCase()}
              </span>
            )
          ) : null}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Description */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Description
            {!canEdit && report.status !== 'draft' && (
              <span className="text-xs text-slate-500">(Read-only)</span>
            )}
          </h3>
          {isEditing ? (
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              rows={6}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              placeholder="Report description"
            />
          ) : (
            <p className="text-slate-300 leading-relaxed">{report.description}</p>
          )}
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-500 mb-1">Author</p>
            <p className="text-white flex items-center gap-2">
              <User className="w-4 h-4" />
              {report.authorName}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">Created</p>
            <p className="text-white flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {new Date(report.createdAt).toLocaleString()}
            </p>
          </div>
          {report.submittedAt && (
            <div>
              <p className="text-sm text-slate-500 mb-1">Submitted</p>
              <p className="text-white">{new Date(report.submittedAt).toLocaleString()}</p>
            </div>
          )}
          {report.reviewedAt && (
            <div>
              <p className="text-sm text-slate-500 mb-1">Reviewed By</p>
              <p className="text-white">{report.reviewedBy}</p>
            </div>
          )}
        </div>

        {/* Activity Log */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Activity Timeline
          </h3>
          <div className="space-y-3">
            {report.activityLog.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">{activity.action}</p>
                  <p className="text-xs text-slate-400">
                    {activity.performedBy} • {new Date(activity.timestamp).toLocaleString()}
                  </p>
                  {activity.details && (
                    <p className="text-xs text-slate-500 mt-1">{activity.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comments Section */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Comments ({report.comments.length})
          </h3>
          
          <div className="space-y-3 mb-4">
            {report.comments.map((comment) => (
              <div key={comment.id} className="bg-slate-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{comment.authorName}</span>
                    <span className="text-xs text-slate-500">{comment.authorRole}</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-slate-300">{comment.content}</p>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              placeholder="Add a comment..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

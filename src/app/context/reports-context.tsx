import { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from './auth-context';

export type ReportStatus = 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected' | 'closed';
export type ReportSeverity = 'critical' | 'high' | 'medium' | 'low' | 'informational';
export type ReportVisibility = 'client' | 'internal' | 'admin';

export interface Report {
  id: string;
  title: string;
  description: string;
  severity: ReportSeverity;
  status: ReportStatus;
  visibility: ReportVisibility;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  reviewedAt?: string;
  closedAt?: string;
  reviewedBy?: string;
  comments: ReportComment[];
  activityLog: ActivityLogEntry[];
  attachments?: string[];
}

export interface ReportComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
}

export interface ActivityLogEntry {
  id: string;
  action: string;
  performedBy: string;
  performedByRole: UserRole;
  timestamp: string;
  details?: string;
}

interface ReportsContextType {
  reports: Report[];
  createReport: (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'activityLog'>) => void;
  updateReport: (id: string, updates: Partial<Report>) => void;
  submitReport: (id: string, userId: string, userName: string) => void;
  reviewReport: (id: string, approved: boolean, reviewerId: string, reviewerName: string) => void;
  deleteReport: (id: string) => void;
  addComment: (reportId: string, comment: Omit<ReportComment, 'id' | 'createdAt'>) => void;
  getReportsByRole: (userId: string, userRole: UserRole) => Report[];
  canEditReport: (report: Report, userId: string, userRole: UserRole) => boolean;
  canViewReport: (report: Report, userId: string, userRole: UserRole) => boolean;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

// Mock initial reports
const INITIAL_REPORTS: Report[] = [
  {
    id: 'RPT-2024-001',
    title: 'SQL Injection Vulnerability in Login Portal',
    description: 'Critical SQL injection vulnerability discovered in the authentication system. Multiple injection points identified that could lead to unauthorized access and data exfiltration.',
    severity: 'critical',
    status: 'approved',
    visibility: 'client',
    authorId: '3',
    authorName: 'Alex Rodriguez',
    authorRole: 'pentester',
    createdAt: '2024-12-20T10:30:00Z',
    updatedAt: '2024-12-21T14:45:00Z',
    submittedAt: '2024-12-20T15:00:00Z',
    reviewedAt: '2024-12-21T14:45:00Z',
    reviewedBy: 'System Administrator',
    comments: [
      {
        id: 'c1',
        authorId: '1',
        authorName: 'System Administrator',
        authorRole: 'admin',
        content: 'Excellent findings. Approved for client visibility.',
        createdAt: '2024-12-21T14:45:00Z',
      },
    ],
    activityLog: [
      {
        id: 'a1',
        action: 'Report Created',
        performedBy: 'Alex Rodriguez',
        performedByRole: 'pentester',
        timestamp: '2024-12-20T10:30:00Z',
      },
      {
        id: 'a2',
        action: 'Report Submitted',
        performedBy: 'Alex Rodriguez',
        performedByRole: 'pentester',
        timestamp: '2024-12-20T15:00:00Z',
      },
      {
        id: 'a3',
        action: 'Report Approved',
        performedBy: 'System Administrator',
        performedByRole: 'admin',
        timestamp: '2024-12-21T14:45:00Z',
      },
    ],
  },
  {
    id: 'RPT-2024-002',
    title: 'Phishing Campaign Analysis Report',
    description: 'Detailed analysis of recent phishing campaign targeting employees. Email templates, indicators of compromise, and recommended mitigation strategies included.',
    severity: 'high',
    status: 'under-review',
    visibility: 'internal',
    authorId: '2',
    authorName: 'Sarah Chen',
    authorRole: 'soc-analyst',
    createdAt: '2024-12-21T09:00:00Z',
    updatedAt: '2024-12-21T11:30:00Z',
    submittedAt: '2024-12-21T11:30:00Z',
    comments: [],
    activityLog: [
      {
        id: 'a4',
        action: 'Report Created',
        performedBy: 'Sarah Chen',
        performedByRole: 'soc-analyst',
        timestamp: '2024-12-21T09:00:00Z',
      },
      {
        id: 'a5',
        action: 'Report Submitted',
        performedBy: 'Sarah Chen',
        performedByRole: 'soc-analyst',
        timestamp: '2024-12-21T11:30:00Z',
      },
    ],
  },
  {
    id: 'RPT-2024-003',
    title: 'Network Vulnerability Assessment - Q4 2024',
    description: 'Comprehensive assessment of network infrastructure identifying potential security weaknesses and configuration issues.',
    severity: 'medium',
    status: 'draft',
    visibility: 'internal',
    authorId: '4',
    authorName: 'John Smith',
    authorRole: 'client',
    createdAt: '2024-12-21T08:00:00Z',
    updatedAt: '2024-12-21T08:00:00Z',
    comments: [],
    activityLog: [
      {
        id: 'a6',
        action: 'Report Created',
        performedBy: 'John Smith',
        performedByRole: 'client',
        timestamp: '2024-12-21T08:00:00Z',
      },
    ],
  },
];

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);

  const createReport = (reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'activityLog'>) => {
    const newReport: Report = {
      ...reportData,
      id: `RPT-2024-${String(reports.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      activityLog: [
        {
          id: `a${Date.now()}`,
          action: 'Report Created',
          performedBy: reportData.authorName,
          performedByRole: reportData.authorRole,
          timestamp: new Date().toISOString(),
        },
      ],
    };
    setReports([...reports, newReport]);
  };

  const updateReport = (id: string, updates: Partial<Report>) => {
    setReports(reports.map(report => {
      if (report.id === id) {
        const updatedReport = {
          ...report,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        return updatedReport;
      }
      return report;
    }));
  };

  const submitReport = (id: string, userId: string, userName: string) => {
    setReports(reports.map(report => {
      if (report.id === id && report.authorId === userId && report.status === 'draft') {
        return {
          ...report,
          status: 'submitted' as ReportStatus,
          submittedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          activityLog: [
            ...report.activityLog,
            {
              id: `a${Date.now()}`,
              action: 'Report Submitted',
              performedBy: userName,
              performedByRole: report.authorRole,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      }
      return report;
    }));
  };

  const reviewReport = (id: string, approved: boolean, reviewerId: string, reviewerName: string) => {
    setReports(reports.map(report => {
      if (report.id === id) {
        const newStatus = approved ? 'approved' : 'rejected';
        return {
          ...report,
          status: newStatus as ReportStatus,
          reviewedAt: new Date().toISOString(),
          reviewedBy: reviewerName,
          updatedAt: new Date().toISOString(),
          activityLog: [
            ...report.activityLog,
            {
              id: `a${Date.now()}`,
              action: approved ? 'Report Approved' : 'Report Rejected',
              performedBy: reviewerName,
              performedByRole: 'admin',
              timestamp: new Date().toISOString(),
              details: approved ? 'Report has been approved and is now visible per visibility settings' : 'Report requires revisions',
            },
          ],
        };
      }
      return report;
    }));
  };

  const deleteReport = (id: string) => {
    setReports(reports.filter(report => report.id !== id));
  };

  const addComment = (reportId: string, commentData: Omit<ReportComment, 'id' | 'createdAt'>) => {
    setReports(reports.map(report => {
      if (report.id === reportId) {
        const newComment: ReportComment = {
          ...commentData,
          id: `c${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        return {
          ...report,
          comments: [...report.comments, newComment],
          updatedAt: new Date().toISOString(),
        };
      }
      return report;
    }));
  };

  const getReportsByRole = (userId: string, userRole: UserRole): Report[] => {
    return reports.filter(report => canViewReport(report, userId, userRole));
  };

  const canViewReport = (report: Report, userId: string, userRole: UserRole): boolean => {
    // Admin can see everything
    if (userRole === 'admin') return true;

    // Author can always see their own reports
    if (report.authorId === userId) return true;

    // SOC Analysts can see internal and admin reports
    if (userRole === 'soc-analyst' && (report.visibility === 'internal' || report.visibility === 'admin')) {
      return true;
    }

    // Pentesters can see approved client-visible reports and internal reports
    if (userRole === 'pentester') {
      if (report.visibility === 'internal') return true;
      if (report.visibility === 'client' && report.status === 'approved') return true;
    }

    // Clients can only see approved reports with client visibility
    if (userRole === 'client' && report.visibility === 'client' && report.status === 'approved') {
      return true;
    }

    return false;
  };

  const canEditReport = (report: Report, userId: string, userRole: UserRole): boolean => {
    // Admin can edit any report
    if (userRole === 'admin') return true;

    // Authors can edit their own drafts
    if (report.authorId === userId && report.status === 'draft') return true;

    return false;
  };

  return (
    <ReportsContext.Provider
      value={{
        reports,
        createReport,
        updateReport,
        submitReport,
        reviewReport,
        deleteReport,
        addComment,
        getReportsByRole,
        canEditReport,
        canViewReport,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
}

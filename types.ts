
export type PerformanceRating = 1 | 2 | 3 | 4 | 5;
export type AccessLevel = 'Admin' | 'Manager' | 'Employee';

export interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  status: 'In Progress' | 'Completed' | 'Pending' | 'Overdue';
}

export interface Review {
  id: string;
  reviewerName: string;
  date: string;
  rating: PerformanceRating;
  comments: string;
  category: 'Annual' | 'Quarterly' | 'Peer' | 'Self';
}

export interface Absence {
  id: string;
  date: string;
  type: 'Sick' | 'Vacation' | 'Personal' | 'Other' | 'Absent' | 'Unauthorized Leave' | 'Unscheduled Leave';
  reason: string;
}

export interface MonthlyAssessment {
  id: string;
  month: string;
  year: number;
  rating: PerformanceRating;
  feedback: string;
}

export interface NoteEntry {
  id: string;
  date: string;
  text: string;
  author: string;
}

export interface Employee {
  id: string;
  name: string;
  username?: string;
  password?: string;
  roleAccess: AccessLevel; // New field for RBAC
  isActive: boolean;
  role: string;
  department: string;
  email: string;
  avatar: string;
  performanceScore: number;
  goals: Goal[];
  reviews: Review[];
  joiningDate: string;
  absences: Absence[];
  monthlyAssessments: MonthlyAssessment[];
  notesHistory: NoteEntry[];
  internalNotes?: string;
}

export interface SystemConfig {
  companyName: string;
  companyLogo: string | null;
  departments: string[];
  dashboardWidgets: {
    charts: boolean;
    stats: boolean;
    aiAudit: boolean;
  };
}

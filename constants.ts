
import { Employee } from './types';

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    username: 'admin',
    password: 'password123',
    roleAccess: 'Admin',
    isActive: true,
    role: 'Senior Software Engineer',
    department: 'Engineering',
    email: 'sarah.chen@performx.ai',
    avatar: 'https://picsum.photos/seed/sarah/200',
    performanceScore: 4.8,
    joiningDate: '2021-03-15',
    absences: [{ id: 'a1', date: '2024-01-10', type: 'Sick', reason: 'Flu symptoms' }],
    monthlyAssessments: [
      { id: 'm1', month: 'January', year: 2024, rating: 5, feedback: 'Strong start to the year leading the AWS migration.' }
    ],
    notesHistory: [{ id: 'n1', date: '2024-02-15', text: 'Won "Innovator of the Month".', author: 'HR' }],
    goals: [
      { id: 'g1', title: 'Implement Microservices', description: 'Transition legacy monolith', progress: 75, dueDate: '2024-06-30', status: 'In Progress' }
    ],
    reviews: []
  },
  {
    id: '2',
    name: 'Marcus Thorne',
    username: 'manager',
    password: 'password123',
    roleAccess: 'Manager',
    isActive: true,
    role: 'Product Designer',
    department: 'Design',
    email: 'marcus.t@performx.ai',
    avatar: 'https://picsum.photos/seed/marcus/200',
    performanceScore: 4.2,
    joiningDate: '2022-08-10',
    absences: [],
    monthlyAssessments: [],
    notesHistory: [],
    goals: [],
    reviews: []
  },
  {
    id: '3',
    name: 'Kevin Smith',
    username: 'ksmith',
    password: 'password123',
    roleAccess: 'Employee',
    isActive: true,
    role: 'Junior Developer',
    department: 'Engineering',
    email: 'kevin@performx.ai',
    avatar: 'https://picsum.photos/seed/kevin/200',
    performanceScore: 3.8,
    joiningDate: '2023-11-01',
    absences: [],
    monthlyAssessments: [{ id: 'm3', month: 'January', year: 2024, rating: 3, feedback: 'Learning the ropes.' }],
    notesHistory: [{ id: 'n2', date: '2024-01-20', text: 'Needs more focus on testing.', author: 'Manager' }],
    goals: [{ id: 'g4', title: 'Complete Onboarding', progress: 100, status: 'Completed', description: 'Internal training modules', dueDate: '2023-12-01' }],
    reviews: []
  }
];

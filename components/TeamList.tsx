
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Employee, AccessLevel } from '../types.ts';
import { Search, Plus, Mail, ChevronRight, X, Filter, MapPin, Briefcase, Calendar, Shield, Lock, Power } from 'lucide-react';

interface TeamListProps {
  employees: Employee[];
  departments: string[];
  onAddEmployee: (emp: Employee) => void;
  onUpdateEmployee: (id: string, updates: Partial<Employee>) => void;
}

const TeamList: React.FC<TeamListProps> = ({ employees, onAddEmployee, onUpdateEmployee, departments }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmp, setNewEmp] = useState({ 
    name: '', role: '', department: 'Engineering', email: '', 
    username: '', password: '', roleAccess: 'Employee' as AccessLevel,
    hireDate: new Date().toISOString().split('T')[0] 
  });

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employee: Employee = {
      id: Math.random().toString(36).substr(2, 9),
      ...newEmp,
      joiningDate: newEmp.hireDate,
      isActive: true,
      avatar: `https://picsum.photos/seed/${newEmp.name.split(' ')[0].toLowerCase()}/200`,
      performanceScore: 3.5,
      goals: [], reviews: [], absences: [], monthlyAssessments: [], notesHistory: []
    };
    onAddEmployee(employee);
    setIsModalOpen(false);
    // Reset form
    setNewEmp({ 
      name: '', role: '', department: 'Engineering', email: '', 
      username: '', password: '', roleAccess: 'Employee' as AccessLevel,
      hireDate: new Date().toISOString().split('T')[0] 
    });
  };

  return (
    <div className="p-5 md:p-10 space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Team Hub</h1>
          <p className="text-slate-500 font-medium text-sm">Managing enterprise workforce.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg">
          <Plus size={20} /> Onboard Member
        </button>
      </header>

      <div className="flex flex-col gap-4 p-2 bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 card-shadow">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" placeholder="Search talent..." className="w-full pl-14 pr-6 py-4 bg-transparent rounded-2xl outline-none font-semibold text-sm"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-2 pb-2 overflow-x-auto no-scrollbar scroll-smooth">
          {['All', ...departments].map(dept => (
            <button key={dept} onClick={() => setSelectedDept(dept)} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${selectedDept === dept ? 'bg-slate-950 text-white shadow-md' : 'text-slate-500 bg-slate-50 hover:bg-slate-100'}`}>
              {dept}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-8">
        {filteredEmployees.map((emp) => (
          <div key={emp.id} className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-6 md:p-8 shadow-sm hover:shadow-xl transition-all group relative">
             <div className="flex justify-between items-start mb-6">
                <img src={emp.avatar} alt="" className="w-16 h-16 md:w-20 md:h-20 rounded-[1.25rem] md:rounded-[1.75rem] shadow-lg border-2 border-white object-cover" />
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${emp.roleAccess === 'Admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>{emp.roleAccess}</span>
                  <div className="text-2xl md:text-3xl font-black text-slate-900 mt-2">{emp.performanceScore}</div>
                </div>
             </div>
             <h3 className="text-xl font-extrabold text-slate-900 mb-0.5 truncate">{emp.name}</h3>
             <p className="text-indigo-600 font-bold text-xs mb-6 truncate">{emp.role}</p>
             <Link to={`/team/${emp.id}`} className="w-full py-3.5 bg-slate-950 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-indigo-600 transition-all">
                Details <ChevronRight size={16} />
             </Link>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl p-6 md:p-10 space-y-6 md:space-y-8 animate-in zoom-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">Onboarding</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input required value={newEmp.name} placeholder="e.g. John Doe" className="w-full bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500/10" onChange={e => setNewEmp({...newEmp, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                <input required type="email" value={newEmp.email} placeholder="e.g. john@performx.ai" className="w-full bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500/10" onChange={e => setNewEmp({...newEmp, email: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Functional Role</label>
                <input required value={newEmp.role} placeholder="e.g. Senior Architect" className="w-full bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500/10" onChange={e => setNewEmp({...newEmp, role: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
                <select className="w-full bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer" value={newEmp.department} onChange={e => setNewEmp({...newEmp, department: e.target.value})}>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Portal Username</label>
                <input required value={newEmp.username} placeholder="Username" className="w-full bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500/10" onChange={e => setNewEmp({...newEmp, username: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
                <input required type="password" value={newEmp.password} placeholder="••••••••" className="w-full bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500/10" onChange={e => setNewEmp({...newEmp, password: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Level</label>
                <select className="w-full bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer" value={newEmp.roleAccess} onChange={e => setNewEmp({...newEmp, roleAccess: e.target.value as AccessLevel})}>
                  <option value="Employee">Employee (Private)</option>
                  <option value="Manager">Manager (Team Control)</option>
                  <option value="Admin">Admin (Full System)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hire Date</label>
                <input required type="date" value={newEmp.hireDate} className="w-full bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500/10" onChange={e => setNewEmp({...newEmp, hireDate: e.target.value})} />
              </div>
              <button type="submit" className="sm:col-span-2 py-4 mt-4 bg-indigo-600 text-white rounded-xl font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all">Onboard Talent</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamList;

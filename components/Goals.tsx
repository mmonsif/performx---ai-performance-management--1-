
import React, { useState } from 'react';
import { Employee, Goal } from '../types.ts';
import { Target, CheckCircle, Clock, MoreHorizontal, Plus, ChevronRight, Sparkles, UserCheck, X } from 'lucide-react';

interface GoalsProps {
  employees: Employee[];
  onUpdateEmployees: (employees: Employee[]) => void;
}

const Goals: React.FC<GoalsProps> = ({ employees, onUpdateEmployees }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', employeeId: employees[0]?.id || '', dueDate: '' });

  const allGoals = employees.flatMap(emp => 
    emp.goals.map(goal => ({ ...goal, employeeName: emp.name, avatar: emp.avatar, dept: emp.department }))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const goal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      title: newGoal.title,
      description: newGoal.description,
      progress: 0,
      dueDate: newGoal.dueDate,
      status: 'In Progress'
    };

    const updatedEmployees = employees.map(emp => 
      emp.id === newGoal.employeeId ? { ...emp, goals: [...emp.goals, goal] } : emp
    );
    
    onUpdateEmployees(updatedEmployees);
    setIsModalOpen(false);
    setNewGoal({ title: '', description: '', employeeId: employees[0]?.id || '', dueDate: '' });
  };

  return (
    <div className="p-10 space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Objectives</h1>
          <p className="text-slate-500 font-medium">Aligning individual tasks with enterprise vision.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-8 py-4 bg-slate-950 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all transform hover:-translate-y-0.5"
        >
          <Plus size={20} strokeWidth={3} />
          Define Milestone
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
        <div className="xl:col-span-3">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
              <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
              Priority Roadmap
            </h3>
            <div className="text-sm font-bold text-slate-400">Showing {allGoals.filter(g => g.status !== 'Completed').length} active items</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {allGoals.filter(g => g.status !== 'Completed').map(goal => (
              <div key={goal.id} className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 card-shadow hover:shadow-2xl transition-all duration-500 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                    goal.status === 'In Progress' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {goal.status}
                  </div>
                </div>

                <div className="flex-1 space-y-3 mb-8">
                  <h4 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">{goal.title}</h4>
                  <p className="text-slate-500 text-sm font-medium line-clamp-2">{goal.description}</p>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-50 mt-auto">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2.5">
                       <img src={goal.avatar} className="w-9 h-9 rounded-xl border-2 border-white shadow-md" alt="" />
                       <div className="text-xs">
                         <div className="font-bold text-slate-900">{goal.employeeName}</div>
                         <div className="text-slate-400 font-medium">{goal.dept}</div>
                       </div>
                     </div>
                   </div>
                   <div className="h-3 bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100">
                     <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-1000" style={{ width: `${goal.progress}%` }} />
                   </div>
                   <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                     <div className="flex items-center gap-1"><Clock size={12} /> Expiring {new Date(goal.dueDate).toLocaleDateString()}</div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-slate-950 to-indigo-950 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <Target size={40} className="mb-6 text-indigo-400 animate-float" />
            <h3 className="text-2xl font-black mb-3 tracking-tight">Q4 Vision</h3>
            <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">System-wide objective alignment is at 84%. Keep pushing for clarity.</p>
            <button className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                <Sparkles size={18} />
                Generate Strategy
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl animate-in zoom-in slide-in-from-top-4 duration-500 overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Define Milestone</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white hover:shadow-md rounded-2xl transition-all text-slate-400">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Goal Title</label>
                <input required value={newGoal.title} onChange={e => setNewGoal({...newGoal, title: e.target.value})} className="w-full bg-slate-50 border border-transparent rounded-[1.25rem] py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all font-semibold" placeholder="e.g. Lead Migration Project" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Assigned Employee</label>
                <select value={newGoal.employeeId} onChange={e => setNewGoal({...newGoal, employeeId: e.target.value})} className="w-full bg-slate-50 border border-transparent rounded-[1.25rem] py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all font-bold cursor-pointer">
                  {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Due Date</label>
                <input type="date" required value={newGoal.dueDate} onChange={e => setNewGoal({...newGoal, dueDate: e.target.value})} className="w-full bg-slate-50 border border-transparent rounded-[1.25rem] py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all font-semibold" />
              </div>
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-lg hover:bg-indigo-700 shadow-2xl transition-all">
                Create Milestone
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;

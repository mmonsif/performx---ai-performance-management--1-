
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Employee, Absence, MonthlyAssessment, NoteEntry, PerformanceRating, SystemConfig } from '../types.ts';
import { 
  ChevronLeft, Mail, MapPin, Calendar, Star, 
  Target, AlertCircle, Save, StickyNote,
  UserX, TrendingUp, BookOpen, Plus, FileBarChart, CheckCircle, ShieldAlert,
  BarChart3, ArrowRight, X, Building, Download, Check, Send, FileDown, Edit3, KeyRound
} from 'lucide-react';

interface EmployeeDetailProps {
  employees: Employee[];
  onUpdateEmployee: (id: string, updates: Partial<Employee>) => void;
  currentUser: Employee;
  config: SystemConfig;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ employees, onUpdateEmployee, currentUser, config }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'attendance' | 'notes' | 'report'>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  // YTD report placeholder (automated report generation removed; keep local state to avoid runtime errors)
  const [ytdReport, setYtdReport] = useState<string | null>(null);
  
  // Form States
  const [editForm, setEditForm] = useState({ name: '', role: '', email: '', department: '' });
  const [newPassword, setNewPassword] = useState('');
  const [monthlyMonth, setMonthlyMonth] = useState('January');
  const [monthlyRating, setMonthlyRating] = useState<PerformanceRating>(4);
  const [monthlyFeedback, setMonthlyFeedback] = useState('');
  const [noteText, setNoteText] = useState('');
  const [absenceDate, setAbsenceDate] = useState('');
  const [absenceReason, setAbsenceReason] = useState('');
  const [absenceType, setAbsenceType] = useState<Absence['type']>('Sick');

  const isManagerOrAdmin = currentUser.roleAccess === 'Admin' || currentUser.roleAccess === 'Manager';
  const isAdmin = currentUser.roleAccess === 'Admin';

  useEffect(() => {
    if (id && employees.length > 0) {
      const found = employees.find(e => String(e.id) === String(id));
      if (found) {
        setEmployee(found);
        setEditForm({ name: found.name, role: found.role, email: found.email, department: found.department });
      }
    }
  }, [id, employees]);

  const orgBenchmarks = useMemo(() => {
    if (employees.length === 0) return { avgScore: 0, avgGoalCompletion: 0 };
    const avgScore = employees.reduce((acc, curr) => acc + curr.performanceScore, 0) / employees.length;
    const allGoals = employees.flatMap(e => e.goals);
    const avgGoalCompletion = allGoals.length > 0 ? allGoals.reduce((acc, curr) => acc + curr.progress, 0) / allGoals.length : 0;
    return { avgScore, avgGoalCompletion };
  }, [employees]);

  const handleUpdate = (updates: Partial<Employee>) => {
    if (!employee) return;
    onUpdateEmployee(employee.id, updates);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdate(editForm);
    setIsEditModalOpen(false);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    handleUpdate({ password: newPassword });
    setIsResetModalOpen(false);
    setNewPassword('');
    alert('Password updated successfully.');
  };





  const logMonthlyAssessment = () => {
    if (!employee || !monthlyFeedback) return;
    const assessment: MonthlyAssessment = {
      id: Math.random().toString(36).substr(2, 9),
      month: monthlyMonth,
      year: 2024,
      rating: monthlyRating,
      feedback: monthlyFeedback
    };
    handleUpdate({ monthlyAssessments: [assessment, ...(employee.monthlyAssessments || [])] });
    setMonthlyFeedback('');
  };

  const logNote = () => {
    if (!employee || !noteText) return;
    const note: NoteEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      text: noteText,
      author: currentUser.name
    };
    handleUpdate({ notesHistory: [note, ...(employee.notesHistory || [])] });
    setNoteText('');
  };

  const logAbsence = () => {
    if (!employee || !absenceDate) return;
    const newAbsence: Absence = {
      id: Math.random().toString(36).substr(2, 9),
      date: absenceDate,
      type: absenceType,
      reason: absenceReason
    };
    handleUpdate({ absences: [newAbsence, ...(employee.absences || [])] });
    setAbsenceDate('');
    setAbsenceReason('');
  };

  const handleExportPDF = () => {
    if (!ytdReport) return;
    window.print();
  };

  if (!employee) return <div className="p-20 text-center text-slate-400 font-bold">Loading Identity...</div>;

  return (
    <div className="p-5 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex justify-between items-center no-print">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors group cursor-pointer p-2 -ml-2 rounded-lg bg-transparent border-none outline-none"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="hidden sm:inline">Back to Directory</span>
          <span className="sm:hidden">Back</span>
        </button>
        <div className="flex gap-3">
          {isManagerOrAdmin && (
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2.5 rounded-2xl font-bold text-sm shadow-sm hover:bg-slate-200 transition-all"
            >
              <Edit3 size={16} /> <span className="hidden sm:inline">Edit Profile</span>
            </button>
          )}
          <button 
            onClick={() => window.location.href = `mailto:${employee.email}?subject=Check-in`}
            className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2.5 rounded-2xl font-bold text-sm shadow-sm hover:bg-indigo-600 hover:text-white transition-all"
          >
            <Send size={16} /> <span className="hidden sm:inline">Compose Email</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-100 card-shadow flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start relative overflow-hidden no-print">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <img src={employee.avatar} alt="" className="w-24 h-24 md:w-32 md:h-32 rounded-[1.5rem] md:rounded-[2rem] shadow-xl ring-4 ring-slate-50 object-cover" />
        <div className="flex-1 text-center md:text-left space-y-3 relative">
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">{employee.name}</h1>
            <p className="text-indigo-600 font-bold text-lg">{employee.role}</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 text-xs md:text-sm text-slate-500 font-medium">
            <span className="flex items-center gap-1.5"><Mail size={14} /> {employee.email}</span>
            <span className="flex items-center gap-1.5"><Building size={14} /> {employee.department}</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} /> Since: {employee.joiningDate}</span>
          </div>
        </div>
        {isManagerOrAdmin && (
          <div className="bg-slate-50 p-5 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 text-center min-w-[140px] relative">
            <div className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase mb-1 tracking-widest">Perform Score</div>
            <div className="text-3xl md:text-5xl font-black text-slate-900 leading-none">{employee.performanceScore}</div>
            <div className="flex justify-center text-amber-400 mt-2">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < Math.floor(employee.performanceScore) ? 'currentColor' : 'none'} className={i < Math.floor(employee.performanceScore) ? '' : 'text-slate-200'} />)}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-1.5 p-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar no-print scroll-smooth">
        {[
          { id: 'overview', label: 'Overview', icon: BookOpen, visible: true },
          { id: 'performance', label: 'Logs', icon: TrendingUp, visible: isManagerOrAdmin },
          { id: 'attendance', label: 'Absences', icon: UserX, visible: true },
          { id: 'notes', label: 'Notes', icon: StickyNote, visible: isManagerOrAdmin },
          { id: 'report', label: 'Report', icon: FileBarChart, visible: isManagerOrAdmin },
        ].filter(t => t.visible).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-950 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 no-print">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          
          {activeTab === 'overview' && (
            <section className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-sm animate-in fade-in">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2"><Target size={18} className="text-indigo-600" /> Milestones</h2>
              <div className="space-y-5">
                {employee.goals.length > 0 ? employee.goals.map(goal => (
                  <div key={goal.id} className="p-5 bg-slate-50 rounded-2xl space-y-3">
                    <div className="flex justify-between font-bold text-sm">
                      <h4 className="text-slate-900">{goal.title}</h4>
                      <span className="text-[9px] uppercase font-black text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md tracking-widest">{goal.status}</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${goal.progress}%` }} />
                    </div>
                  </div>
                )) : <div className="p-10 text-center text-slate-400 font-medium italic">No milestones defined.</div>}
              </div>
            </section>
          )}

          {activeTab === 'performance' && isManagerOrAdmin && (
            <div className="space-y-6 animate-in fade-in">
              <section className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8">
                <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2"><TrendingUp size={18} className="text-indigo-600" /> Post Assessment</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <select value={monthlyMonth} onChange={e => setMonthlyMonth(e.target.value)} className="bg-slate-50 p-4 rounded-xl font-bold border-none text-sm">
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => <option key={m}>{m}</option>)}
                  </select>
                  <div className="flex gap-1.5">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={() => setMonthlyRating(n as any)} className={`flex-1 rounded-xl font-bold text-sm ${monthlyRating === n ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'}`}>{n}</button>
                    ))}
                  </div>
                </div>
                <textarea 
                  value={monthlyFeedback} onChange={e => setMonthlyFeedback(e.target.value)} 
                  placeholder="Record monthly check-in details..." 
                  className="w-full bg-slate-50 p-4 rounded-xl border-none font-medium text-sm h-28 mb-4 outline-none focus:ring-2 focus:ring-indigo-500/10"
                />
                <button onClick={logMonthlyAssessment} className="w-full py-4 bg-slate-950 text-white rounded-xl font-black text-sm">Post Assessment</button>
              </section>

              <div className="space-y-4">
                {employee.monthlyAssessments.map(ma => (
                  <div key={ma.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-start gap-5">
                    <div className="text-center w-12 flex-shrink-0">
                      <div className="text-[9px] font-black uppercase text-indigo-600 truncate">{ma.month.slice(0,3)}</div>
                      <div className="text-2xl font-black">{ma.rating}</div>
                    </div>
                    <p className="text-slate-600 text-sm font-medium leading-relaxed italic">"{ma.feedback}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <section className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-sm animate-in fade-in">
               {isManagerOrAdmin && (
                 <div className="mb-8 space-y-4">
                   <h2 className="text-lg font-black text-slate-900 flex items-center gap-2"><UserX size={18} className="text-rose-500" /> Log Absence</h2>
                   <div className="grid grid-cols-2 gap-4">
                     <input type="date" value={absenceDate} onChange={e => setAbsenceDate(e.target.value)} className="bg-slate-50 p-3 rounded-xl border-none font-bold text-sm" />
                     <select value={absenceType} onChange={e => setAbsenceType(e.target.value as any)} className="bg-slate-50 p-3 rounded-xl border-none font-bold text-sm">
                        <option>Sick</option><option>Vacation</option><option>Absent</option>
                     </select>
                   </div>
                   <input 
                     value={absenceReason} onChange={e => setAbsenceReason(e.target.value)}
                     placeholder="Context for absence..." className="w-full bg-slate-50 p-3 rounded-xl border-none font-bold text-sm" 
                   />
                   <button onClick={logAbsence} className="w-full py-3 bg-rose-500 text-white rounded-xl font-black text-sm shadow-md">Record Entry</button>
                 </div>
               )}
               <table className="w-full text-left">
                  <thead className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <tr><th className="pb-4">Date</th><th className="pb-4">Type</th><th className="pb-4 hidden sm:table-cell">Remarks</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {employee.absences.map(abs => (
                      <tr key={abs.id} className="text-sm">
                        <td className="py-4 font-bold text-slate-700">{abs.date}</td>
                        <td className="py-4"><span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black uppercase">{abs.type}</span></td>
                        <td className="py-4 text-slate-500 font-medium hidden sm:table-cell">{abs.reason || '-'}</td>
                      </tr>
                    ))}
                    {!employee.absences.length && <tr><td colSpan={3} className="py-10 text-center text-slate-400 font-medium italic text-xs">No records found.</td></tr>}
                  </tbody>
               </table>
            </section>
          )}

          {activeTab === 'notes' && isManagerOrAdmin && (
             <div className="space-y-6 animate-in fade-in">
               <section className="bg-amber-50 rounded-[2rem] border border-amber-100 p-6 md:p-8">
                 <h2 className="text-lg font-black text-amber-950 mb-6 flex items-center gap-2"><StickyNote size={18} /> Observation Log</h2>
                 <textarea 
                    value={noteText} onChange={e => setNoteText(e.target.value)} 
                    placeholder="Log private notes about progress, behavior, or coaching points..." 
                    className="w-full bg-white/60 p-4 rounded-xl border border-amber-200 h-28 mb-4 outline-none focus:bg-white transition-all font-medium text-sm"
                 />
                 <button onClick={logNote} className="px-6 py-2.5 bg-amber-900 text-white rounded-xl font-black text-sm">Save Note</button>
               </section>
               <div className="space-y-4">
                  {employee.notesHistory.map(note => (
                    <div key={note.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative group">
                      <div className="flex justify-between items-center mb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <span>{note.date}</span>
                        <span>BY {note.author}</span>
                      </div>
                      <p className="text-slate-700 font-medium text-sm leading-relaxed">{note.text}</p>
                    </div>
                  ))}
               </div>
             </div>
          )}

          {activeTab === 'report' && isManagerOrAdmin && (
            <div className="space-y-6 animate-in fade-in">
              <section className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h2 className="text-lg font-black text-slate-900 mb-4">Reports</h2>
                <p className="text-slate-500 text-sm mb-6">Automated report generation is not available. Use the export option to print or save employee data.</p>
                <div className="flex gap-3">
                  <button onClick={() => window.print()} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black">Export to PDF</button>
                  <button onClick={() => alert('CSV export coming soon')} className="px-6 py-3 bg-slate-50 rounded-2xl font-black">Export CSV</button>
                  <button onClick={() => {
                    // Create a simple local report for printing
                    const report = `Report for ${employee.name}\nRole: ${employee.role} • ${employee.department}\nCompany: ${config.companyName || 'PerformX'}\n\nNotes:\n${employee.notesHistory.map(n => `${n.date} - ${n.author}: ${n.text}`).join('\n')}`;
                    setYtdReport(report);
                    // Scroll to print content on the page so test can find it
                    setTimeout(() => document.getElementById('print-report-content')?.scrollIntoView(), 200);
                  }} className="px-6 py-3 bg-slate-700 text-white rounded-2xl font-black">Generate Report</button>
                </div>
              </section>
            </div>
          )}
        </div>

        <div className="space-y-6 md:space-y-8">
          <section className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="space-y-3">
              <h3 className="text-lg font-bold">System Notes</h3>
              <p className="text-sm text-slate-600">Automated features are not available. You can still export reports and use manual observations and assessments.</p>
            </div>
          </section>

          {isManagerOrAdmin && (
            <section className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System Actions</h3>
              {isAdmin && (
                <button 
                  onClick={() => setIsResetModalOpen(true)}
                  className="w-full p-3.5 bg-indigo-50 text-indigo-600 rounded-xl font-black text-xs flex items-center gap-2.5 hover:bg-indigo-100"
                >
                  <KeyRound size={16} /> Reset Password
                </button>
              )}
              <button onClick={() => alert('Feature coming soon')} className="w-full p-3.5 bg-slate-50 text-slate-600 rounded-xl font-black text-xs flex items-center gap-2.5 hover:bg-slate-100">
                <ArrowRight size={16} /> Transfer Dept
              </button>
              <button onClick={() => handleUpdate({ isActive: !employee.isActive })} className={`w-full p-3.5 rounded-xl font-black text-xs flex items-center gap-2.5 transition-all ${employee.isActive ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                <ShieldAlert size={16} /> {employee.isActive ? 'Suspend Access' : 'Restore Access'}
              </button>
            </section>
          )}
        </div>
      </div>

      {/* Profile Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-md">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl animate-in zoom-in overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900">Edit Profile</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 text-slate-400"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-8 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input required value={editForm.name} className="w-full bg-slate-50 p-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500/10" onChange={e => setEditForm({...editForm, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <input required value={editForm.email} className="w-full bg-slate-50 p-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500/10" onChange={e => setEditForm({...editForm, email: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role</label>
                <input required value={editForm.role} className="w-full bg-slate-50 p-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500/10" onChange={e => setEditForm({...editForm, role: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
                <select value={editForm.department} className="w-full bg-slate-50 p-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500/10" onChange={e => setEditForm({...editForm, department: e.target.value})}>
                  {config.departments.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-sm shadow-xl hover:bg-indigo-700 transition-all">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-md">
          <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl animate-in zoom-in overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-900">Security Override</h2>
              <button onClick={() => setIsResetModalOpen(false)} className="p-2 text-slate-400"><X size={24} /></button>
            </div>
            <form onSubmit={handleResetPassword} className="p-8 space-y-5">
              <div className="space-y-1 text-center mb-4">
                <p className="text-xs text-slate-500 font-medium">Setting new credentials for <span className="font-bold text-indigo-600">{employee.name}</span></p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                <input 
                  required 
                  type="password"
                  value={newPassword} 
                  placeholder="••••••••"
                  className="w-full bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all" 
                  onChange={e => setNewPassword(e.target.value)} 
                />
              </div>
              <button type="submit" className="w-full py-4 bg-slate-950 text-white rounded-xl font-black text-sm shadow-xl hover:bg-slate-800 transition-all">Apply New Password</button>
            </form>
          </div>
        </div>
      )}

      {/* HIDDEN PRINT CONTENT (For PDF Export) */}
      {ytdReport && (
        <div id="print-report-content" className="hidden print:block p-10 bg-white min-h-screen">
          <div className="flex justify-between items-center mb-10 pb-6 border-b-2 border-slate-900">
            <div>
              {config.companyLogo && <img src={config.companyLogo} alt="Logo" className="w-16 h-16 mb-4 object-contain" />}
              <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">{config.companyName || 'PerformX'}</h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Internal Talent Intelligence Report</p>
            </div>
            <div className="text-right text-slate-400 font-black text-[10px] uppercase">
              Confidential Document<br />
              Generated on {new Date().toLocaleDateString()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 mb-10 bg-slate-50 p-8 rounded-3xl">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Subject Profile</label>
              <h2 className="text-2xl font-black text-slate-900">{employee.name}</h2>
              <p className="text-indigo-600 font-bold">{employee.role} • {employee.department}</p>
            </div>
            <div className="text-right">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Performance Score</label>
              <div className="text-5xl font-black text-slate-900">{employee.performanceScore} / 5.0</div>
            </div>
          </div>

          <div className="text-slate-800 whitespace-pre-line leading-relaxed text-lg font-medium">
            {ytdReport}
          </div>

          <div className="mt-20 pt-6 border-t border-slate-100 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            End of Brief • Generated by PerformX
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetail;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell 
} from 'recharts';
import { TrendingUp, Users, Target, CheckCircle, ArrowUpRight, ArrowDownRight, Loader2, Download, Sparkles, ChevronDown, UserPlus, FileText, Zap, Check } from 'lucide-react';
import { Employee, SystemConfig } from '../types.ts';

interface DashboardProps {
  employees: Employee[];
  config: SystemConfig;
}

const Dashboard: React.FC<DashboardProps> = ({ employees, config }) => {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const departmentData = [
    { name: 'Eng', score: 4.5 },
    { name: 'Design', score: 4.2 },
    { name: 'Sales', score: 3.8 },
    { name: 'HR', score: 4.1 },
    { name: 'Mkt', score: 3.5 },
  ];

  const goalProgressData = [
    { month: 'Jan', completed: 12 },
    { month: 'Feb', completed: 18 },
    { month: 'Mar', completed: 25 },
    { month: 'Apr', completed: 20 },
  ];

  const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

  // Dynamically calculate actual system data
  const totalGoals = employees.reduce((acc, emp) => acc + (emp.goals?.length || 0), 0);
  const avgScore = (employees.reduce((acc, curr) => acc + curr.performanceScore, 0) / Math.max(1, employees.length)).toFixed(1);

  const stats = [
    { label: 'Total Talent', value: employees.length, icon: Users, trend: '+4%', color: 'indigo' },
    { label: 'Org Score', value: avgScore, icon: TrendingUp, trend: '+0.2', color: 'emerald' },
    { label: 'Milestones', value: totalGoals, icon: Target, trend: 'Active', color: 'violet' },
    { label: 'Efficiency', value: '92%', icon: CheckCircle, trend: '+5%', color: 'blue' },
  ];

  const handleDownloadExcel = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 1500);
  };

  const quickActions = [
    { label: 'Add Employee', icon: UserPlus, color: 'text-blue-600', path: '/team' },
    { label: 'Start Review', icon: FileText, color: 'text-emerald-600', path: '/reviews' },
    { label: 'Set Goal', icon: Target, color: 'text-indigo-600', path: '/goals' },
    { label: 'Run AI Audit', icon: Zap, color: 'text-amber-600', path: '/analytics' },
  ];

  return (
    <div className="p-5 md:p-10 space-y-8 md:space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[11px] font-bold uppercase tracking-widest mb-2 border border-indigo-100">
            <Sparkles size={12} fill="currentColor" /> Health Optimal
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Organization</h1>
          <p className="text-slate-500 font-medium text-sm">Monitoring performance benchmarks.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 relative">
          <button 
            onClick={handleDownloadExcel}
            className={`flex items-center justify-center gap-2 px-5 py-3.5 border rounded-2xl text-sm font-bold transition-all ${
              downloadSuccess ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-700 border-slate-200 shadow-sm'
            }`}
          >
            {isDownloading ? <Loader2 size={18} className="animate-spin" /> : downloadSuccess ? <Check size={18} /> : <Download size={18} />}
            {downloadSuccess ? 'Exported' : 'Export Data'}
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-950 rounded-2xl text-sm font-bold text-white shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2"
            >
              Actions <ChevronDown size={16} />
            </button>
            {showQuickActions && (
              <div className="absolute right-0 bottom-full sm:bottom-auto sm:top-full mb-3 sm:mb-0 sm:mt-3 w-full sm:w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50">
                {quickActions.map((action, i) => (
                  <button key={i} onClick={() => navigate(action.path)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left">
                    <action.icon size={18} className={action.color} />
                    <span className="text-sm font-bold text-slate-700">{action.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {config.dashboardWidgets.stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-5 md:p-7 rounded-[2rem] border border-slate-100 card-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-indigo-50 text-indigo-600">
                  <stat.icon size={22} className="md:w-[26px] md:h-[26px]" />
                </div>
              </div>
              <div>
                <h3 className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
                <p className="text-xl md:text-3xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {config.dashboardWidgets.charts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 card-shadow">
            <h3 className="text-lg font-extrabold text-slate-900 mb-6 tracking-tight">Perform Spectrum</h3>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f8fafc" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                  <Tooltip cursor={{ fill: '#f8fafc', radius: 10 }} contentStyle={{ border: 'none', borderRadius: '15px', boxShadow: '0 10px 15px rgba(0,0,0,0.05)', fontWeight: 'bold' }} />
                  <Bar dataKey="score" radius={[6, 6, 6, 6]} barSize={window.innerWidth < 768 ? 20 : 40}>
                    {departmentData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 card-shadow">
            <h3 className="text-lg font-extrabold text-slate-900 mb-6 tracking-tight">Goal Velocity</h3>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={goalProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMobile" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                  <Area type="monotone" dataKey="completed" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorMobile)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

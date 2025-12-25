
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import TeamList from './components/TeamList.tsx';
import EmployeeDetail from './components/EmployeeDetail.tsx';
import Goals from './components/Goals.tsx';
import ReviewsPage from './components/ReviewsPage.tsx';
import Analytics from './components/Analytics.tsx';
import Settings from './components/Settings.tsx';
import Login from './components/Login.tsx';
import { Search, Bell, HelpCircle, LogOut, User, ChevronRight, CloudSync } from 'lucide-react';
import { MOCK_EMPLOYEES } from './constants.ts';
import { Employee, SystemConfig } from './types.ts';
import { supabase, syncEmployeeToSupabase, syncConfigToSupabase } from './supabase.ts';

const Header: React.FC<{ user: Employee; employees: Employee[]; onLogout: () => void; isSyncing?: boolean }> = ({ user, employees, onLogout, isSyncing }) => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filtered = query.trim() 
    ? employees.filter(e => e.name.toLowerCase().includes(query.toLowerCase()) || e.role.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : [];

  return (
    <header className="h-16 bg-white/80 border-b border-slate-100 flex items-center justify-between px-6 md:px-8 sticky top-0 z-[60] backdrop-blur-md">
      <div className="flex-1 max-w-xl hidden md:block relative">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search talent or roles..." 
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            className="w-full bg-slate-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>

        {showResults && query && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="p-2">
              {filtered.length > 0 ? filtered.map(emp => (
                <Link 
                  key={emp.id} 
                  to={`/team/${emp.id}`} 
                  onClick={() => { setQuery(''); setShowResults(false); }}
                  className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors group"
                >
                  <img src={emp.avatar} className="w-8 h-8 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-900">{emp.name}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{emp.role}</div>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </Link>
              )) : (
                <div className="p-4 text-center text-xs text-slate-400 font-bold">No matches found</div>
              )}
            </div>
            {filtered.length > 0 && (
              <div className="bg-slate-50 p-2 border-t border-slate-100">
                <Link to="/team" onClick={() => setShowResults(false)} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block text-center py-1">View Full Directory</Link>
              </div>
            )}
          </div>
        )}
        {showResults && query && <div className="fixed inset-0 z-[-1]" onClick={() => setShowResults(false)}></div>}
      </div>
      
      <div className="flex md:hidden items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs">P</div>
        <span className="font-black text-slate-900 tracking-tight">PerformX</span>
      </div>

      <div className="flex items-center gap-4">
        {isSyncing && (
          <div className="flex items-center gap-2 text-indigo-500 animate-pulse">
            <CloudSync size={16} />
            <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Supabase Live</span>
          </div>
        )}
        <div className="flex items-center gap-3 p-1 rounded-lg pr-2 group relative">
          <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full border border-slate-200 object-cover shadow-sm" />
          <div className="hidden sm:block">
            <div className="text-xs font-bold text-slate-900">{user.name}</div>
            <div className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">{user.roleAccess}</div>
          </div>
          <button 
            onClick={onLogout}
            className="ml-2 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

const App: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentUser, setCurrentUser] = useState<Employee | null>(() => {
    const saved = localStorage.getItem('performx_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('performx_employees');
    return saved ? JSON.parse(saved) : MOCK_EMPLOYEES;
  });

  const [config, setConfig] = useState<SystemConfig>(() => {
    const saved = localStorage.getItem('performx_config');
    return saved ? JSON.parse(saved) : {
      companyName: 'PerformX AI',
      companyLogo: null,
      departments: ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Operations'],
      dashboardWidgets: { charts: true, stats: true, aiAudit: true }
    };
  });

  // Fetch from Supabase on load
  useEffect(() => {
    const fetchData = async () => {
      setIsSyncing(true);
      try {
        const { data: empData, error: empError } = await supabase.from('employees').select('data');
        if (!empError && empData && empData.length > 0) {
          setEmployees(empData.map(d => d.data));
        }

        const { data: cfgData, error: cfgError } = await supabase.from('config').select('data').eq('id', 'main_config').single();
        if (!cfgError && cfgData) {
          setConfig(cfgData.data);
        }
      } catch (err) {
        console.error('Supabase fetch error:', err);
      } finally {
        setIsSyncing(false);
      }
    };
    fetchData();
  }, []);

  // Sync to local and Supabase when state changes
  useEffect(() => {
    localStorage.setItem('performx_employees', JSON.stringify(employees));
    localStorage.setItem('performx_config', JSON.stringify(config));
  }, [employees, config]);

  const handleLogin = (user: Employee) => {
    setCurrentUser(user);
    localStorage.setItem('performx_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('performx_user');
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    const updated = employees.map(emp => emp.id === id ? { ...emp, ...updates } : emp);
    setEmployees(updated);
    
    // Persist to Supabase
    const target = updated.find(e => e.id === id);
    if (target) {
      setIsSyncing(true);
      await syncEmployeeToSupabase(target);
      setIsSyncing(false);
    }
  };

  const addEmployee = async (e: Employee) => {
    const newBatch = [e, ...employees];
    setEmployees(newBatch);
    setIsSyncing(true);
    await syncEmployeeToSupabase(e);
    setIsSyncing(false);
  };

  const updateConfig = async (newConfig: SystemConfig) => {
    setConfig(newConfig);
    setIsSyncing(true);
    await syncConfigToSupabase(newConfig);
    setIsSyncing(false);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} employees={employees} />;
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar user={currentUser} config={config} onLogout={handleLogout} />
        <main className="flex-1 ml-0 md:ml-72 min-h-screen flex flex-col pb-24 md:pb-0 transition-all duration-300">
          <Header user={currentUser} employees={employees} onLogout={handleLogout} isSyncing={isSyncing} />
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard employees={employees} config={config} />} />
              <Route path="/team" element={
                currentUser.roleAccess !== 'Employee' ? 
                <TeamList employees={employees} onAddEmployee={addEmployee} onUpdateEmployee={updateEmployee} departments={config.departments} /> :
                <Navigate to={`/team/${currentUser.id}`} />
              } />
              <Route path="/team/:id" element={<EmployeeDetail employees={employees} config={config} onUpdateEmployee={updateEmployee} currentUser={currentUser} />} />
              <Route path="/goals" element={<Goals employees={employees} onUpdateEmployees={async (newEmps) => {
                setEmployees(newEmps);
                // Simple sync for all changed employees (minimal approach)
                setIsSyncing(true);
                for (const emp of newEmps) {
                  await syncEmployeeToSupabase(emp);
                }
                setIsSyncing(false);
              }} />} />
              
              {currentUser.roleAccess !== 'Employee' && (
                <>
                  <Route path="/reviews" element={<ReviewsPage employees={employees} onUpdateEmployees={async (newEmps) => {
                    setEmployees(newEmps);
                    setIsSyncing(true);
                    for (const emp of newEmps) {
                      await syncEmployeeToSupabase(emp);
                    }
                    setIsSyncing(false);
                  }} />} />
                  <Route path="/analytics" element={<Analytics employees={employees} />} />
                </>
              )}

              {currentUser.roleAccess === 'Admin' && (
                <Route path="/settings" element={<Settings config={config} onUpdateConfig={updateConfig} employees={employees} onUpdateEmployees={async (newEmps) => {
                  setEmployees(newEmps);
                  setIsSyncing(true);
                  for (const emp of newEmps) {
                    await syncEmployeeToSupabase(emp);
                  }
                  setIsSyncing(false);
                }} />} />
              )}
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;

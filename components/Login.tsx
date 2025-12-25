
import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, UserCircle, ChevronLeft, User, KeyRound } from 'lucide-react';
import { Employee, AccessLevel } from '../types';

interface LoginProps {
  onLogin: (user: Employee) => void;
  employees: Employee[];
}

const Login: React.FC<LoginProps> = ({ onLogin, employees }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'roles' | 'credentials'>('roles');
  const [selectedRole, setSelectedRole] = useState<AccessLevel | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRoleSelect = (role: AccessLevel) => {
    setSelectedRole(role);
    setView('credentials');
    setError('');
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const user = employees.find(e => 
        e.username === username && 
        e.password === password && 
        e.roleAccess === selectedRole
      );

      if (user) {
        onLogin(user);
      } else {
        setError('Invalid credentials or role mismatch. Try "admin"/"password123"');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
          <div className="bg-indigo-600 p-8 md:p-10 text-white text-center relative">
            {view === 'credentials' && (
              <button 
                onClick={() => setView('roles')}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">PerformX</h1>
            <p className="text-indigo-100 mt-1 text-sm font-medium">Enterprise Intelligence Suite</p>
          </div>

          <div className="p-8 md:p-10 space-y-6">
            {view === 'roles' ? (
              <div className="space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center mb-6">Select Identity</p>
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => handleRoleSelect('Admin')}
                    className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-indigo-50 hover:border-indigo-200 transition-all group"
                  >
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-slate-900 group-hover:text-indigo-600">Administrator</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Control</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => handleRoleSelect('Manager')}
                    className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
                  >
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                      <UserCircle size={20} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-slate-900 group-hover:text-emerald-600">Manager</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Team Operations</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => handleRoleSelect('Employee')}
                    className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-blue-50 hover:border-blue-200 transition-all group"
                  >
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                      <UserCircle size={20} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600">Employee</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Private View</div>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleManualLogin} className="space-y-5 animate-in slide-in-from-right-4">
                <div className="text-center mb-4">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    Logging in as {selectedRole}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input 
                      required
                      type="text" 
                      placeholder="Username" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
                    />
                  </div>
                  <div className="relative group">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input 
                      required
                      type="password" 
                      placeholder="Password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
                    />
                  </div>
                </div>

                {error && <div className="text-rose-500 text-xs font-bold text-center px-2">{error}</div>}

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-slate-950 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign In <ArrowRight size={18} /></>}
                </button>
                
                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                  Secure Enterprise Authentication
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  FileText, 
  TrendingUp, 
  Settings as SettingsIcon,
  LogOut,
  Zap,
  User
} from 'lucide-react';
import { Employee, SystemConfig } from '../types.ts';

interface SidebarProps {
  user: Employee;
  config: SystemConfig;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, config, onLogout }) => {
  const isAdmin = user.roleAccess === 'Admin';
  const isEmployee = user.roleAccess === 'Employee';
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: ['Admin', 'Manager', 'Employee'], mobile: true },
    { icon: Users, label: 'Team', path: '/team', roles: ['Admin', 'Manager'], mobile: true },
    { icon: User, label: 'Profile', path: `/team/${user.id}`, roles: ['Employee'], mobile: true },
    { icon: Target, label: 'Goals', path: '/goals', roles: ['Admin', 'Manager', 'Employee'], mobile: true },
    { icon: FileText, label: 'Evaluations', path: '/reviews', roles: ['Admin', 'Manager'], mobile: false },
    { icon: TrendingUp, label: 'Data Lab', path: '/analytics', roles: ['Admin', 'Manager'], mobile: false },
    { icon: SettingsIcon, label: 'Settings', path: '/settings', roles: ['Admin'], mobile: true },
  ].filter(item => item.roles.includes(user.roleAccess));

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-72 bg-slate-950 text-slate-300 min-h-screen p-6 flex-col fixed left-0 top-0 z-50 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center gap-3 px-2 mb-12 relative">
          {config.companyLogo ? (
            <img src={config.companyLogo} alt="Logo" className="w-10 h-10 rounded-xl object-cover shadow-lg border border-white/20" />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Zap size={22} fill="white" />
            </div>
          )}
          <div>
            <span className="text-xl font-extrabold text-white tracking-tight leading-none truncate block max-w-[160px]">
              {config.companyName || 'PerformX'}
            </span>
            <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-0.5 truncate max-w-[160px]">
              {config.companyLogo ? 'Enterprise Panel' : 'Company Panel'}
            </div>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2 relative">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                ${isActive 
                  ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/20' 
                  : 'hover:bg-white/5 hover:text-white'}
              `}
            >
              <item.icon size={20} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
              <span className="font-semibold text-sm tracking-wide">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800/50 flex flex-col gap-2 relative">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-all duration-300"
          >
            <LogOut size={20} />
            <span className="font-semibold text-sm">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 py-3 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {navItems.filter(item => item.mobile).slice(0, 5).map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 group relative py-1"
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 -translate-y-1' : 'text-slate-400'}`}>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-tighter transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </>
  );
};

export default Sidebar;

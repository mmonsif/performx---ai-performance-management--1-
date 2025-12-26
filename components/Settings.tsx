
import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Shield, Bell, User, Globe, ChevronRight, Check, Plus, Trash2, Database, Download, Upload, Layout, Loader2, Building2, Camera, Save, Terminal, Copy } from 'lucide-react';
import { SystemConfig, Employee } from '../types.ts';

interface SettingsProps {
  config: SystemConfig;
  onUpdateConfig: (config: SystemConfig) => void;
  employees: Employee[];
  onUpdateEmployees: (employees: Employee[]) => void;
}

const Settings: React.FC<SettingsProps> = ({ config, onUpdateConfig, employees, onUpdateEmployees }) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'departments' | 'database' | 'dashboard' | 'company'>('company');
  const [newDept, setNewDept] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Admin Profile Edit States
  const adminUser = employees.find(e => e.roleAccess === 'Admin');
  const [adminName, setAdminName] = useState(adminUser?.name || '');
  const [adminAvatar, setAdminAvatar] = useState(adminUser?.avatar || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Identity draft states to prevent half-saved changes and allow explicit save
  const [companyNameDraft, setCompanyNameDraft] = useState(config.companyName || '');
  const [localLogoDraft, setLocalLogoDraft] = useState<string | null>(config.companyLogo || null);

  useEffect(() => {
    if (adminUser) {
      setAdminName(adminUser.name);
      setAdminAvatar(adminUser.avatar);
    }
  }, [adminUser]);

  useEffect(() => {
    setCompanyNameDraft(config.companyName || '');
    setLocalLogoDraft(config.companyLogo || null);
  }, [config]);

  const addDepartment = () => {
    if (newDept && !config.departments.includes(newDept)) {
      onUpdateConfig({ ...config, departments: [...config.departments, newDept] });
      setNewDept('');
    }
  };

  const removeDepartment = (name: string) => {
    onUpdateConfig({ ...config, departments: config.departments.filter(d => d !== name) });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onUpdateConfig({ ...config, companyLogo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleAdminProfileSave = () => {
    if (!adminUser) return;
    setIsProcessing(true);
    const updatedEmployees = employees.map(e => 
      e.id === adminUser.id ? { ...e, name: adminName, avatar: adminAvatar } : e
    );
    onUpdateEmployees(updatedEmployees);
    
    // Also update current session if needed
    const currentUserStr = localStorage.getItem('performx_user');
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      if (currentUser.id === adminUser.id) {
        localStorage.setItem('performx_user', JSON.stringify({ ...currentUser, name: adminName, avatar: adminAvatar }));
      }
    }

    setTimeout(() => {
      setIsProcessing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 600);
  };

  const backupDatabase = () => {
    setIsProcessing(true);
    const data = { employees, config, timestamp: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `performx_backup_${new Date().getTime()}.json`;
    link.click();
    setTimeout(() => setIsProcessing(false), 1000);
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.employees && data.config) {
          onUpdateEmployees(data.employees);
          onUpdateConfig(data.config);
          alert('System restore successful.');
        }
      } catch (err) {
        alert('Invalid backup file.');
      }
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  const sqlSchema = `-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create config table
CREATE TABLE IF NOT EXISTS config (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & Public Access
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read" ON employees FOR SELECT USING (true);
CREATE POLICY "Public Write" ON employees FOR ALL USING (true);
CREATE POLICY "Public Read Config" ON config FOR SELECT USING (true);
CREATE POLICY "Public Write Config" ON config FOR ALL USING (true);`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-5 md:p-10 max-w-5xl mx-auto space-y-8 md:space-y-10 animate-in fade-in duration-500 pb-20">
      <header>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Configuration</h1>
        <p className="text-slate-500 font-medium mt-1">Enterprise-grade system orchestration.</p>
      </header>

      <div className="flex gap-2 p-1.5 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-x-auto no-scrollbar">
        {[
          { id: 'company', label: 'Identity', icon: Building2 },
          { id: 'departments', label: 'Organization', icon: Globe },
          { id: 'dashboard', label: 'Layout', icon: Layout },
          { id: 'database', label: 'Database', icon: Database },
          { id: 'profile', label: 'Admin Access', icon: User },
        ].map(tab => (
          <button 
            key={tab.id} onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 md:px-6 py-3 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${activeSubTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl p-6 md:p-10 min-h-[400px]">
        {activeSubTab === 'company' && (
          <div className="space-y-8 animate-in slide-in-from-left-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Company Identity</h2>
              <p className="text-slate-500 font-medium">Customize corporate visibility.</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 md:gap-10">
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Logo</label>
                <div className="relative group w-32 h-32 md:w-40 md:h-40">
                  <div className="w-full h-full bg-slate-50 rounded-[2rem] md:rounded-[2.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                    {config.companyLogo ? (
                      <img src={config.companyLogo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 size={40} className="text-slate-300" />
                    )}
                  </div>
                  <label className="absolute inset-0 flex items-center justify-center bg-indigo-600/0 group-hover:bg-indigo-600/80 transition-all rounded-[2rem] md:rounded-[2.5rem] cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </label>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Legal Name</label>
                  <input 
                    type="text"
                    value={config.companyName}
                    onChange={(e) => onUpdateConfig({...config, companyName: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'departments' && (
          <div className="space-y-8 animate-in slide-in-from-left-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Departments</h2>
              <p className="text-slate-500 font-medium">Define functional taxonomies.</p>
            </div>
            <div className="flex gap-4">
              <input 
                value={newDept} onChange={e => setNewDept(e.target.value)}
                placeholder="Name..." className="flex-1 bg-slate-50 p-4 rounded-xl border-none outline-none font-bold text-sm"
              />
              <button onClick={addDepartment} className="px-6 py-4 bg-indigo-600 text-white rounded-xl font-black flex items-center gap-2 text-sm"><Plus size={18} /> Add</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.departments.map(dept => (
                <div key={dept} className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="font-bold text-slate-700 text-sm">{dept}</div>
                  <button onClick={() => removeDepartment(dept)} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'dashboard' && (
          <div className="space-y-8 animate-in slide-in-from-left-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Layout Config</h2>
              <p className="text-slate-500 font-medium">Configure global module visibility.</p>
            </div>
            <div className="space-y-4">
              {Object.entries(config.dashboardWidgets).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
                  <div>
                    <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">{key} Module</div>
                    <div className="text-slate-500 text-xs">Active on Dashboard</div>
                  </div>
                  <button 
                    onClick={() => onUpdateConfig({...config, dashboardWidgets: {...config.dashboardWidgets, [key]: !val}})}
                    className={`w-12 h-6 rounded-full relative transition-all ${val ? 'bg-indigo-600' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${val ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'database' && (
          <div className="space-y-10 animate-in slide-in-from-left-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-8 border-2 border-dashed border-slate-100 rounded-3xl space-y-4 text-center">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-400"><Download size={28} /></div>
                  <h3 className="text-lg font-black text-slate-900">Backup JSON</h3>
                  <button onClick={backupDatabase} className="w-full py-4 bg-slate-950 text-white rounded-xl font-bold flex items-center justify-center gap-2 text-sm">
                    {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                    Export Data
                  </button>
               </div>
               <div className="p-8 border-2 border-dashed border-slate-100 rounded-3xl space-y-4 text-center">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-400"><Upload size={28} /></div>
                  <h3 className="text-lg font-black text-slate-900">Restore System</h3>
                  <label className="block w-full py-4 bg-indigo-600 text-white rounded-xl font-bold cursor-pointer hover:bg-indigo-700 transition-all text-sm">
                    <input type="file" className="hidden" accept=".json" onChange={handleRestore} />
                    Upload Snapshot
                  </label>
               </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
               <div className="flex items-center gap-3 mb-4">
                 <Terminal size={20} className="text-indigo-600" />
                 <h3 className="text-xl font-black text-slate-900">SQL Initialization</h3>
               </div>
               <p className="text-slate-500 text-sm mb-6 font-medium">If this is a new project, run this SQL in your Supabase SQL Editor to create the required tables and security policies.</p>
               <div className="relative group">
                 <pre className="bg-slate-950 text-indigo-400 p-6 rounded-2xl text-[10px] md:text-xs overflow-x-auto font-mono leading-relaxed">
                   {sqlSchema}
                 </pre>
                 <button 
                  onClick={copySql}
                  className={`absolute top-4 right-4 p-2.5 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${copied ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                 >
                   {copied ? <Check size={14} /> : <Copy size={14} />}
                   {copied ? 'Copied' : 'Copy SQL'}
                 </button>
               </div>
            </div>
          </div>
        )}

        {activeSubTab === 'profile' && (
          <div className="space-y-8 animate-in fade-in">
             <div className="flex flex-col items-center gap-4 mb-8">
               <div className="relative group">
                 <img src={adminAvatar} className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-slate-50 shadow-xl object-cover" alt="" />
                 <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer">
                    <Camera size={24} />
                 </div>
               </div>
               <div className="text-center">
                 <h3 className="text-2xl font-black text-slate-900">{adminName}</h3>
                 <p className="text-indigo-600 font-bold uppercase tracking-widest text-[10px] mt-1">Primary Administrator</p>
               </div>
             </div>

             <div className="max-w-md mx-auto space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Display Name</label>
                  <input 
                    value={adminName} 
                    onChange={e => setAdminName(e.target.value)}
                    className="w-full bg-slate-50 p-4 rounded-xl border-none outline-none font-bold text-sm focus:ring-2 focus:ring-indigo-500/10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Avatar Image URL</label>
                  <input 
                    value={adminAvatar} 
                    onChange={e => setAdminAvatar(e.target.value)}
                    className="w-full bg-slate-50 p-4 rounded-xl border-none outline-none font-bold text-sm focus:ring-2 focus:ring-indigo-500/10"
                    placeholder="https://..."
                  />
                </div>
                <button 
                  onClick={handleAdminProfileSave}
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
                    saveSuccess ? 'bg-emerald-500 text-white' : 'bg-slate-950 text-white hover:bg-indigo-600'
                  }`}
                >
                  {isProcessing ? <Loader2 size={18} className="animate-spin" /> : saveSuccess ? <Check size={18} /> : <Save size={18} />}
                  {saveSuccess ? 'Updated' : 'Save Profile Changes'}
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;

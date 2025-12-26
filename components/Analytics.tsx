
import React, { useState } from 'react';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend 
} from 'recharts';
import { Employee } from '../types.ts';
import { Sparkles, TrendingUp, Target } from 'lucide-react';

interface AnalyticsProps {
  employees: Employee[];
}

const Analytics: React.FC<AnalyticsProps> = ({ employees }) => {
  // Compute system metrics from real data
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899'];

  const avgScore = employees.length ? employees.reduce((s, e) => s + e.performanceScore, 0) / employees.length : 0;
  const allGoals = employees.flatMap(e => e.goals || []);
  const avgGoalCompletion = allGoals.length ? allGoals.reduce((s, g) => s + (g.progress || 0), 0) / allGoals.length : 0;
  const activeCount = employees.filter(e => e.isActive !== false).length;
  const retention = employees.length ? Math.round((activeCount / employees.length) * 100) : 0;

  const radarData = [
    { subject: 'Performance', A: Math.round(avgScore * 20), fullMark: 100 },
    { subject: 'Goal Completion', A: Math.round(avgGoalCompletion), fullMark: 100 },
    { subject: 'Retention', A: retention, fullMark: 100 },
    // Add placeholders for other system-derived metrics if available
  ];

  const pieData = [
    { name: 'Exceeds', value: employees.filter(e => e.performanceScore >= 4.5).length },
    { name: 'Meets', value: employees.filter(e => e.performanceScore >= 3.5 && e.performanceScore < 4.5).length },
    { name: 'Developing', value: employees.filter(e => e.performanceScore < 3.5).length },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Advanced Analytics</h1>
        <p className="text-slate-500">Deep-dive into organizational health and trends.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Radar Chart Section */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-900">Competency Distribution</h3>
            <div className="flex gap-2 text-xs font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-indigo-600"><div className="w-2 h-2 rounded-full bg-indigo-600"></div> Current Q</span>
              <span className="flex items-center gap-1.5 text-slate-300"><div className="w-2 h-2 rounded-full bg-slate-300"></div> Previous Q</span>
            </div>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <Radar name="Current" dataKey="B" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                <Radar name="Previous" dataKey="A" stroke="#cbd5e1" fill="#cbd5e1" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Metrics & Pie */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold mb-3">System Audit</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="text-sm text-slate-700">Average Performance Score: <span className="font-bold text-slate-900">{avgScore.toFixed(2)}/5</span></div>
              <div className="text-sm text-slate-700">Average Goal Completion: <span className="font-bold text-slate-900">{avgGoalCompletion.toFixed(0)}%</span></div>
              <div className="text-sm text-slate-700">Retention (Active): <span className="font-bold text-slate-900">{retention}%</span></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6">Rating Distribution</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {pieData.map((d, i) => (
                <div key={i} className="flex justify-between text-xs font-bold text-slate-600">
                  <span>{d.name}</span>
                  <span>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

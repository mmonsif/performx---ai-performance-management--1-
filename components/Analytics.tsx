
import React, { useState } from 'react';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend 
} from 'recharts';
import { Employee } from '../types.ts';
import { Sparkles, TrendingUp, Zap, Target, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface AnalyticsProps {
  employees: Employee[];
}

const Analytics: React.FC<AnalyticsProps> = ({ employees }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState('');

  const radarData = [
    { subject: 'Velocity', A: 120, B: 110, fullMark: 150 },
    { subject: 'Quality', A: 98, B: 130, fullMark: 150 },
    { subject: 'Collaboration', A: 86, B: 130, fullMark: 150 },
    { subject: 'Mentorship', A: 99, B: 100, fullMark: 150 },
    { subject: 'Innovation', A: 85, B: 90, fullMark: 150 },
    { subject: 'Uptime', A: 65, B: 85, fullMark: 150 },
  ];

  const pieData = [
    { name: 'Exceeds', value: 35 },
    { name: 'Meets', value: 45 },
    { name: 'Developing', value: 20 },
  ];
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899'];

  const handleAIAnalyze = async () => {
    setIsAnalyzing(true);
    // Create a new GoogleGenAI instance right before making an API call for optimal context and key handling
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Analyze this organizational snapshot: Avg Performance 4.2/5, Goal completion 92%, Retention 95%. Provide a 2-sentence strategic outlook.",
        config: { temperature: 0.5 }
      });
      setAiInsight(response.text || 'Solid growth trajectory confirmed.');
    } catch (e) {
      setAiInsight('Error generating insights.');
    }
    setIsAnalyzing(false);
  };

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

        {/* AI Insight & Pie */}
        <div className="space-y-8">
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group">
            <Sparkles className="text-indigo-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">AI Org-Audit</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              {aiInsight || "Leverage Gemini to analyze organizational patterns and predict talent flight risks."}
            </p>
            <button 
              onClick={handleAIAnalyze}
              disabled={isAnalyzing}
              className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
            >
              {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
              {isAnalyzing ? 'Processing...' : 'Run Org Audit'}
            </button>
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
                  <span>{d.value}%</span>
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

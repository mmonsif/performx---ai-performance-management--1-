
import React, { useState } from 'react';
import { Employee, Review } from '../types.ts';
import { FileText, Star, Clock, ArrowRight, UserPlus, X } from 'lucide-react';

interface ReviewsPageProps {
  employees: Employee[];
  onUpdateEmployees: (employees: Employee[]) => void;
}

const ReviewsPage: React.FC<ReviewsPageProps> = ({ employees, onUpdateEmployees }) => {
  const [selectedReview, setSelectedReview] = useState<Employee | null>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comments: '', category: 'Quarterly' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReview) return;

    const review: Review = {
      id: Math.random().toString(36).substr(2, 9),
      reviewerName: 'Admin User',
      date: new Date().toISOString().split('T')[0],
      rating: reviewForm.rating as any,
      comments: reviewForm.comments,
      category: reviewForm.category as any
    };

    const updatedEmployees = employees.map(emp => 
      emp.id === selectedReview.id ? { ...emp, reviews: [...emp.reviews, review] } : emp
    );
    
    onUpdateEmployees(updatedEmployees);
    setSelectedReview(null);
    setReviewForm({ rating: 5, comments: '', category: 'Quarterly' });
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Performance Reviews</h1>
          <p className="text-slate-500">Conduct and analyze periodic evaluations.</p>
        </div>
        <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2">
          <UserPlus size={18} />
          Bulk Assign
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((emp, i) => (
          <div key={emp.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <img src={emp.avatar} className="w-12 h-12 rounded-2xl border-2 border-slate-50 shadow-sm" alt="" />
              <div>
                <h3 className="font-bold text-slate-900">{emp.name}</h3>
                <p className="text-xs text-slate-500">{emp.role}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-3 border-y border-slate-50 mb-6">
              <div className="flex items-center gap-2 text-indigo-600">
                <FileText size={16} />
                <span className="text-xs font-bold uppercase">Pending Review</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock size={14} />
                <span className="text-xs font-semibold">Q4 2024</span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedReview(emp)}
              className="w-full py-3 bg-slate-950 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              Start Evaluation
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>

      {selectedReview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Evaluate: {selectedReview.name}</h2>
              <button onClick={() => setSelectedReview(null)} className="p-3 hover:bg-white hover:shadow-md rounded-2xl transition-all text-slate-400">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Rating (1-5)</label>
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button 
                      key={num}
                      type="button"
                      onClick={() => setReviewForm({...reviewForm, rating: num})}
                      className={`flex-1 py-3 rounded-xl font-bold transition-all ${reviewForm.rating === num ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                <select value={reviewForm.category} onChange={e => setReviewForm({...reviewForm, category: e.target.value})} className="w-full bg-slate-50 border border-transparent rounded-[1.25rem] py-4 px-6 outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold">
                  <option>Quarterly</option>
                  <option>Annual</option>
                  <option>Self</option>
                  <option>Peer</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Evaluation Comments</label>
                <textarea 
                  required 
                  rows={4}
                  value={reviewForm.comments} 
                  onChange={e => setReviewForm({...reviewForm, comments: e.target.value})} 
                  className="w-full bg-slate-50 border border-transparent rounded-[1.25rem] py-4 px-6 outline-none focus:bg-white focus:border-indigo-500 transition-all font-medium resize-none" 
                  placeholder="Provide detailed feedback..."
                />
              </div>
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-lg hover:bg-indigo-700 shadow-2xl transition-all">
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;

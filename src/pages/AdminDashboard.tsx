import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trash2, FileText, Star, Clock, User, Mail, Book } from 'lucide-react';
import { Manuscript, Review } from '../types';

export default function AdminDashboard() {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [reviews, setReviews] = useState<(Review & { bookTitle?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'manuscripts' | 'reviews'>('manuscripts');

  const fetchData = async () => {
    setLoading(true);
    try {
      const msRes = await fetch('/api/manuscripts');
      const msData = await msRes.json();
      setManuscripts(msData);

      const revRes = await fetch('/api/reviews');
      const revData = await revRes.json();
      setReviews(revData);
    } catch (err) {
      console.error('Fetch data failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteManuscript = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this manuscript?')) return;
    try {
      const res = await fetch(`/api/manuscripts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setManuscripts(manuscripts.filter(m => m.id !== id));
      }
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleDeleteReview = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews(reviews.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="bg-bg min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl font-serif text-primary italic mb-4">Admin Dashboard</h1>
          <p className="text-primary/60 font-light">Manage submissions and community feedback.</p>
        </header>

        {/* Tabs */}
        <div className="flex space-x-8 border-b border-primary/10 mb-12">
          <button 
            onClick={() => setActiveTab('manuscripts')}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
              activeTab === 'manuscripts' ? 'text-secondary' : 'text-primary/40 hover:text-primary/60'
            }`}
          >
            Manuscripts ({manuscripts.length})
            {activeTab === 'manuscripts' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-secondary" />}
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
              activeTab === 'reviews' ? 'text-secondary' : 'text-primary/40 hover:text-primary/60'
            }`}
          >
            Reviews ({reviews.length})
            {activeTab === 'reviews' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-secondary" />}
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center font-serif italic text-primary/40">Loading data...</div>
        ) : (
          <div className="space-y-6">
            {activeTab === 'manuscripts' ? (
              <div className="grid grid-cols-1 gap-6">
                {manuscripts.length > 0 ? manuscripts.map((m) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={m.id}
                    className="bg-white p-8 rounded-2xl shadow-sm border border-primary/5 group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-widest rounded-full">
                            {m.status}
                          </span>
                          <span className="text-[10px] text-primary/40 font-bold uppercase tracking-widest flex items-center">
                            <Clock size={12} className="mr-1" /> {new Date(m.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-2xl font-serif text-primary italic">{m.title}</h3>
                        <div className="flex flex-wrap gap-6">
                          <div className="flex items-center text-sm text-primary/60">
                            <User size={16} className="mr-2 text-secondary" /> {m.authorName}
                          </div>
                          <div className="flex items-center text-sm text-primary/60">
                            <Mail size={16} className="mr-2 text-secondary" /> {m.email}
                          </div>
                          <div className="flex items-center text-sm text-primary/60">
                            <FileText size={16} className="mr-2 text-secondary" /> {m.genre}
                          </div>
                        </div>
                        <p className="text-sm text-primary/70 font-light leading-relaxed max-w-4xl">
                          {m.description}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleDeleteManuscript(m.id)}
                        className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-full transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                )) : (
                  <div className="py-20 text-center bg-white/50 rounded-2xl border border-dashed border-primary/20">
                    <p className="text-primary/30 italic">No manuscripts submitted yet.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reviews.length > 0 ? reviews.map((r) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={r.id}
                    className="bg-white p-8 rounded-2xl shadow-sm border border-primary/5 group relative"
                  >
                    <button 
                      onClick={() => handleDeleteReview(r.id)}
                      className="absolute top-4 right-4 p-2 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm bg-white rounded-full"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < r.rating ? "text-secondary fill-secondary" : "text-primary/10"} />
                        ))}
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] text-primary/40 font-bold uppercase tracking-widest">
                        <Book size={12} /> <span>{r.bookTitle || `Book ID: ${r.bookId}`}</span>
                      </div>
                      <p className="text-sm text-primary/80 italic font-light leading-relaxed">
                        "{r.comment}"
                      </p>
                      <div className="pt-4 border-t border-primary/5 flex items-center justify-between">
                        <span className="text-xs font-serif italic text-primary/60">- {r.userName}</span>
                        <span className="text-[10px] text-primary/30 font-bold uppercase">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="col-span-full py-20 text-center bg-white/50 rounded-2xl border border-dashed border-primary/20">
                    <p className="text-primary/30 italic">No reviews found.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

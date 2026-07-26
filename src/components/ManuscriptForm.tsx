import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle, FileText, X } from 'lucide-react';

export default function ManuscriptForm({ onClose }: { onClose?: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    const formData = new FormData(e.currentTarget);
    const data = {
      authorName: formData.get('authorName'),
      email: formData.get('email'),
      title: formData.get('title'),
      genre: formData.get('genre'),
      description: formData.get('description')
    };

    try {
      const res = await fetch('/api/manuscripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else if (result.errors) {
        setErrors(result.errors);
      } else {
        setErrors([result.message || 'An unexpected error occurred.']);
      }
    } catch (err) {
      console.error('Submission failed', err);
      setErrors(['Network error. Please try again later.']);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 text-center rounded-3xl border border-primary/5 shadow-2xl"
      >
        <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="text-secondary" size={40} />
        </div>
        <h3 className="text-3xl font-serif text-primary italic mb-4">Manuscript Received</h3>
        <p className="text-primary/60 leading-relaxed font-light mb-8">
          Thank you for sharing your creative vision with Deepam Kesari. Our editorial team will review your submission and contact you within 2-3 weeks.
        </p>
        <button 
          onClick={onClose}
          className="bg-primary text-white px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all"
        >
          Return to Authors
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-primary/5 shadow-2xl relative overflow-hidden">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-primary/20 hover:text-primary transition-colors"
        >
          <X size={24} />
        </button>
      )}
      
      <div className="mb-10">
        <div className="flex items-center space-x-4 mb-4">
          <FileText className="text-secondary" size={28} />
          <h3 className="text-3xl font-serif text-primary italic m-0">Submit Your Work</h3>
        </div>
        <p className="text-primary/60 font-light">Join our legacy of meaningful literature. Please provide the following details about your manuscript.</p>
      </div>

      {errors.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm"
        >
          <ul className="list-disc list-inside space-y-1">
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Author Name</label>
          <input 
            name="authorName"
            type="text" 
            className="w-full px-5 py-4 bg-bg border border-primary/5 rounded-2xl text-primary focus:outline-none focus:border-secondary transition-colors"
            placeholder="Your full name"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Email Address</label>
          <input 
            name="email"
            type="email" 
            className="w-full px-5 py-4 bg-bg border border-primary/5 rounded-2xl text-primary focus:outline-none focus:border-secondary transition-colors"
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Working Title</label>
          <input 
            name="title"
            type="text" 
            className="w-full px-5 py-4 bg-bg border border-primary/5 rounded-2xl text-primary focus:outline-none focus:border-secondary transition-colors"
            placeholder="Title of your work"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Genre/Category</label>
          <select 
            name="genre"
            className="w-full px-5 py-4 bg-bg border border-primary/5 rounded-2xl text-primary focus:outline-none focus:border-secondary transition-colors appearance-none"
          >
            <option value="">Select Category</option>
            <option value="Poetry">Poetry</option>
            <option value="Philosophy">Philosophy</option>
            <option value="Academic">Academic</option>
            <option value="Fiction">Fiction</option>
            <option value="Personal Growth">Personal Growth</option>
          </select>
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="block text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Short Description / Pitch</label>
          <textarea 
            name="description"
            rows={4}
            className="w-full px-5 py-4 bg-bg border border-primary/5 rounded-2xl text-primary focus:outline-none focus:border-secondary transition-colors resize-none"
            placeholder="Tell us about the core idea, audience, and importance of your work..."
          />
        </div>
        <div className="md:col-span-2 pt-4">
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-secondary hover:text-primary transition-all flex items-center justify-center space-x-3 shadow-xl hover:shadow-secondary/20 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Processing Submission...</span>
            ) : (
              <>
                <Send size={18} />
                <span>Submit Manuscript</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

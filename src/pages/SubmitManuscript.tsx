import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, FileText, User, Mail, BookOpen, PenTool, Globe } from 'lucide-react';

export default function SubmitManuscript() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      authorName: formData.get('authorName'),
      email: formData.get('email'),
      title: formData.get('title'),
      genre: formData.get('genre'),
      description: formData.get('description'),
    };

    try {
      const res = await fetch('/api/manuscripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-2xl shadow-xl text-center border border-primary/5"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <Send className="text-green-500" size={32} />
          </div>
          <h2 className="text-3xl font-serif text-primary mb-4 italic">Manuscript Received</h2>
          <p className="text-primary/60 mb-8 font-light leading-relaxed">
            Thank you for sharing your vision with Deepam Kesari. Our editorial team will review your work and contact you via email within 2-4 weeks.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="text-secondary font-bold hover:underline"
          >
            Submit another manuscript
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Info Side */}
          <div className="space-y-12">
            <div>
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs uppercase tracking-[0.4em] font-bold text-secondary mb-4 block"
              >
                For Aspiring Authors
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-6xl font-serif text-primary italic leading-tight mb-8"
              >
                Let Your Voice Be Heard.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-primary/60 font-light leading-relaxed"
              >
                At Deepam Kesari, we are always looking for fresh perspectives, soul-stirring poetry, and groundbreaking research. Submit your manuscript and join our mission to preserve and celebrate literature.
              </motion.p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                  <PenTool className="text-secondary" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-serif italic text-primary mb-2">Editorial Excellence</h4>
                  <p className="text-sm text-primary/60">Our editors work closely with authors to refine and polish every work to perfection.</p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                  <Globe className="text-secondary" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-serif italic text-primary mb-2">Global Reach</h4>
                  <p className="text-sm text-primary/60">We ensure your work reaches readers across the globe through our distribution network.</p>
                </div>
              </div>
            </div>

            <div className="bg-primary p-8 rounded-2xl text-white">
              <h4 className="text-xl font-serif italic mb-4">Submission Guidelines</h4>
              <ul className="space-y-3 text-sm text-white/70 font-light list-disc pl-5">
                <li>Include a detailed synopsis of your work.</li>
                <li>Submit works in Gujarati, Hindi, or English.</li>
                <li>Original and unpublished works only.</li>
                <li>Response time is typically 2-4 weeks.</li>
              </ul>
            </div>
          </div>

          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 md:p-12 rounded-3xl shadow-2xl border border-primary/5"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary/40 uppercase tracking-widest flex items-center">
                    <User size={14} className="mr-2" /> Author Name
                  </label>
                  <input 
                    name="authorName"
                    type="text" 
                    required
                    className="w-full bg-bg border-b border-primary/10 py-4 focus:outline-none focus:border-secondary transition-colors text-primary"
                    placeholder="Deep Patel"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary/40 uppercase tracking-widest flex items-center">
                    <Mail size={14} className="mr-2" /> Email Address
                  </label>
                  <input 
                    name="email"
                    type="email" 
                    required
                    className="w-full bg-bg border-b border-primary/10 py-4 focus:outline-none focus:border-secondary transition-colors text-primary"
                    placeholder="deep@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary/40 uppercase tracking-widest flex items-center">
                    <BookOpen size={14} className="mr-2" /> Manuscript Title
                  </label>
                  <input 
                    name="title"
                    type="text" 
                    required
                    className="w-full bg-bg border-b border-primary/10 py-4 focus:outline-none focus:border-secondary transition-colors text-primary"
                    placeholder="The New Horizon"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary/40 uppercase tracking-widest flex items-center">
                    <FileText size={14} className="mr-2" /> Genre
                  </label>
                  <select 
                    name="genre"
                    required
                    className="w-full bg-bg border-b border-primary/10 py-4 focus:outline-none focus:border-secondary transition-colors text-primary appearance-none"
                  >
                    <option value="">Select Genre</option>
                    <option value="Poetry">Poetry</option>
                    <option value="Philosophy">Philosophy</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Academic">Academic</option>
                    <option value="Biography">Biography</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-primary/40 uppercase tracking-widest">
                  Brief Description & Synopsis
                </label>
                <textarea 
                  name="description"
                  required
                  rows={5}
                  className="w-full bg-bg border border-primary/10 rounded-xl p-6 focus:outline-none focus:border-secondary transition-colors text-primary resize-none"
                  placeholder="Tell us about your work, the central themes, and your vision..."
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-5 rounded-xl font-bold uppercase tracking-[0.2em] text-sm hover:bg-secondary hover:text-primary transition-all flex items-center justify-center group disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Manuscript"}
                <Send className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

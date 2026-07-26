import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AuthorCard from '../components/AuthorCard';
import ManuscriptForm from '../components/ManuscriptForm';
import { Author } from '../types';

export default function Authors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch('/api/authors')
      .then(res => res.json())
      .then(data => {
        setAuthors(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch authors failed', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-bg min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 text-center">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-secondary font-bold mb-4">The Minds Behind the Pages</h2>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary italic">Our Distinguished Authors</h1>
          <div className="w-20 h-1 bg-secondary mx-auto mt-8" />
        </header>

        {loading ? (
          <div className="text-center py-20 font-serif italic text-primary/40">Gathering the literary elite...</div>
        ) : authors.length === 0 ? (
          <div className="py-20 text-center text-primary/40 italic">No authors available at the moment.</div>
        ) : (
          <div
            className={
              `grid ${
                authors.length === 1
                  ? 'grid-cols-1'
                  : authors.length === 2
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              } gap-x-8 gap-y-20 justify-center justify-items-center max-w-6xl mx-auto`
            }
          >
            {authors.map((author, i) => (
              <AuthorCard key={author.id} author={author} index={i} />
            ))}
          </div>
        )}

        <section className="mt-40 max-w-5xl mx-auto relative">
          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.div 
                key="cta"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="py-24 bg-primary text-white rounded-[3rem] shadow-2xl overflow-hidden relative text-center px-8 border border-white/10"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -ml-32 -mb-32" />
                
                <div className="relative z-10 max-w-2xl mx-auto">
                  <h3 className="text-4xl md:text-5xl font-serif mb-8 italic">Influence the Dialogue</h3>
                  <p className="text-white/60 mb-12 text-lg font-light leading-relaxed">
                    Deepam Kesari is always searching for courageous voices and original insights. If your manuscript reflects cultural integrity and human purpose, we invite you to join our distinguished circle of authors.
                  </p>
                  <button 
                    onClick={() => setShowForm(true)}
                    className="bg-secondary text-primary px-14 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-xl shadow-black/20 transform hover:-translate-y-1"
                  >
                    Submit Your Manuscript
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ManuscriptForm onClose={() => setShowForm(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}

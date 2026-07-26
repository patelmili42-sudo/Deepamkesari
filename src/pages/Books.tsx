import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import BookCard from '../components/BookCard';
import { Book } from '../types';
import { CATEGORIES, LANGUAGES } from '../constants';
import { Search, Filter, X } from 'lucide-react';

export default function Books() {
  const [searchParams, setSearchParams] = useSearchParams();
  const authorIdFilter = searchParams.get('authorId');
  
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch books failed', err);
        setLoading(false);
      });
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const titleLower = book.title.toLowerCase();
      const authorLower = (book.authorName || (book.authorId ? book.authorId.toString() : '')).toLowerCase();
      const searchLower = search.toLowerCase();
      
      const matchesSearch = titleLower.includes(searchLower) || authorLower.includes(searchLower);
      const matchesCategory = selectedCategory ? book.category === selectedCategory : true;
      const matchesLanguage = selectedLanguage ? book.language === selectedLanguage : true;
      const matchesAuthorId = authorIdFilter ? book.authorId.toString() === authorIdFilter : true;
      return matchesSearch && matchesCategory && matchesLanguage && matchesAuthorId;
    });
  }, [books, search, selectedCategory, selectedLanguage, authorIdFilter]);

  return (
    <div className="bg-bg min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 text-center">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-secondary font-bold mb-4">The Catalog</h2>
          <h1 className="text-4xl md:text-5xl font-serif text-primary">
            {authorIdFilter ? `Works by ${books.find(b => b.authorId.toString() === authorIdFilter)?.authorName || 'this Author'}` : 'Discover Meaningful Literature'}
          </h1>
          {authorIdFilter && (
            <button 
              onClick={() => setSearchParams({})}
              className="mt-4 text-xs font-bold text-secondary hover:text-primary transition-all uppercase tracking-widest border-b border-secondary pb-1"
            >
              Show all authors
            </button>
          )}
        </header>

        {/* Filters & Search */}
        <div className="mb-12 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative grow">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" />
              <input
                type="text"
                placeholder="Search by title or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-primary/5 rounded-full py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-secondary shadow-sm transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-8 py-4 rounded-full border border-primary/5 text-sm font-medium transition-all ${
                showFilters ? "bg-primary text-white" : "bg-white text-primary hover:bg-primary/5"
              }`}
            >
              <Filter size={18} />
              <span>Filters</span>
              {(selectedCategory || selectedLanguage) && (
                <div className="w-2 h-2 rounded-full bg-secondary ml-2" />
              )}
            </button>
          </div>

          <motion.div
            initial={false}
            animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
            className="overflow-hidden bg-white rounded-2xl border border-primary/5 shadow-sm"
          >
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-primary/40 mb-4">Category</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-full text-xs transition-all ${
                      selectedCategory === null ? "bg-secondary text-primary" : "bg-bg text-primary/60 hover:text-primary"
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full text-xs transition-all ${
                        selectedCategory === cat ? "bg-secondary text-primary" : "bg-bg text-primary/60 hover:text-primary"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-primary/40 mb-4">Language</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedLanguage(null)}
                    className={`px-4 py-2 rounded-full text-xs transition-all ${
                      selectedLanguage === null ? "bg-secondary text-primary" : "bg-bg text-primary/60 hover:text-primary"
                    }`}
                  >
                    All Languages
                  </button>
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-4 py-2 rounded-full text-xs transition-all ${
                        selectedLanguage === lang ? "bg-secondary text-primary" : "bg-bg text-primary/60 hover:text-primary"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {(selectedCategory || selectedLanguage) && (
              <div className="px-8 pb-6 text-right">
                <button
                  onClick={() => { setSelectedCategory(null); setSelectedLanguage(null); }}
                  className="text-[10px] uppercase tracking-widest font-bold text-secondary flex items-center space-x-1 ml-auto"
                >
                  <X size={12} />
                  <span>Clear All Filters</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Results */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {filteredBooks.map((book, i) => (
              <BookCard key={book.id} book={book} index={i} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-primary/40 italic">No books match your current filters.</p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory(null); setSelectedLanguage(null); }}
              className="mt-4 text-secondary font-bold hover:underline"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Author, Book } from '../types';
import { MessageCircle, Mail, Award, User as UserIcon, Instagram, ChevronRight } from 'lucide-react';

const fallbackAuthorImage = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800';

const handleAuthorImageError = (event: { currentTarget: HTMLImageElement }) => {
  event.currentTarget.src = fallbackAuthorImage;
};

export default function AuthorProfile() {
  const { id } = useParams();
  const [author, setAuthor] = useState<Author | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const res = await fetch('/api/authors');
        const authorsData = await res.json();
        const currentAuthor = authorsData.find((a: any) => a.id.toString() === id);
        setAuthor(currentAuthor);

        const booksRes = await fetch('/api/books');
        const booksData = await booksRes.json();
        setBooks(booksData.filter((b: any) => b.authorId.toString() === id));
      } catch (err) {
        console.error('Failed to fetch author data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthorData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#fcfaf7] flex items-center justify-center">
      <div className="text-center py-20 font-serif italic text-primary/40 animate-pulse">Refining your experience...</div>
    </div>
  );
  
  if (!author) return (
    <div className="min-h-screen bg-[#fcfaf7] flex items-center justify-center">
      <div className="text-center py-20 font-serif italic text-primary/40">Author not found</div>
    </div>
  );

  return (
    <div className="bg-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-primary/40 z-10" />
        <img 
          src={author.photo} 
          alt={author.name}
          className="w-full h-full object-cover object-top"
          onError={handleAuthorImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent z-20" />
        
        <div className="absolute bottom-0 left-0 w-full z-30 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <h2 className="text-secondary text-xs uppercase tracking-[0.5em] font-bold mb-6">Distinguished Author</h2>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-primary italic leading-none mb-6">
                {author.name}
              </h1>
              <div className="flex items-center space-x-6">
                <div className="h-[1px] w-12 bg-secondary" />
                <p className="text-primary/70 text-xl md:text-2xl font-serif italic">
                  {author.role} at Deepam Kesari Publishing House
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Profile Overview */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/5 -skew-x-12 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            
            {/* Sidebar info */}
            <div className="lg:col-span-4 space-y-12 relative z-10">
              {(author.academicPedigree || author.creativeFocus || author.performingArts) && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-12 border border-primary/5 shadow-2xl relative"
                >
                  <div className="absolute -top-4 -left-4 w-20 h-20 bg-secondary/10 -z-10" />
                  
                  <div className="flex items-center space-x-4 mb-10">
                    <div className="w-12 h-12 bg-primary text-white flex items-center justify-center rounded-sm">
                      <UserIcon size={20} />
                    </div>
                    <h3 className="text-xl font-serif text-primary italic font-bold">Biography Details</h3>
                  </div>
                  
                  <div className="space-y-8">
                    {author.academicPedigree && (
                      <div className="group">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-secondary font-bold mb-2 block">Academic Pedigree</span>
                        <span className="text-base text-primary/80 block leading-snug">{author.academicPedigree}</span>
                      </div>
                    )}
                    
                    {author.creativeFocus && (
                      <div className="group">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-secondary font-bold mb-2 block">Creative Focus</span>
                        <span className="text-base text-primary/80 block leading-snug">{author.creativeFocus}</span>
                      </div>
                    )}
                    
                    {author.performingArts && (
                      <div className="group">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-secondary font-bold mb-2 block">Performing Arts</span>
                        <span className="text-base text-primary/80 block leading-snug">{author.performingArts}</span>
                      </div>
                    )}
                  </div>

                  {/* Connect with Author part removed from here to be its own block if needed, 
                      or we can keep it here but the user said "if details not available then not show that block".
                      If details are not available, we probably don't want a card with just "Connect" headers either. 
                  */}
                </motion.div>
              )}

              {/* Only show connect part if it's author 4 (Deep Patel) or if we had a field for it.
                  For now, let's only show it if the biography card is shown, to keep it simple and follow the "details" rule.
                  Or better: move it to its own conditional block if we want it to persist. 
                  The screenshot shows the Biography Details card with the connect section at the bottom.
              */}
              
              {author.id.toString() === '4' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-12 border border-primary/5 shadow-2xl"
                >
                  <h4 className="text-xs uppercase tracking-widest text-primary/40 mb-6">Connect with Author</h4>
                  <div className="flex space-x-4">
                    <a
                      href="mailto:deepamkesari.publishinghouse@gmail.com?subject=Inquiry%20from%20Deepam%20Kesari%20Website"
                      className="w-12 h-12 bg-bg border border-primary/5 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all duration-300"
                      aria-label="Send email"
                    >
                      <Mail size={18} />
                    </a>
                    <a href="https://wa.me/919664959238" className="w-12 h-12 bg-bg border border-primary/5 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all duration-300">
                      <MessageCircle size={18} />
                    </a>
                    <a href="https://www.instagram.com/deepamkesari_publishinghouse?igsh=a2JybXcxdDhrOTY0" className="w-12 h-12 bg-bg border border-primary/5 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all duration-300">
                      <Instagram size={18} />
                    </a>
                  </div>
                </motion.div>
              )}

              {author.literaryVision && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-primary text-white p-12 relative"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 -translate-y-1/2 translate-x-1/2 rotate-45" />
                  <Award className="text-secondary mb-8" size={36} />
                  <h4 className="text-2xl font-serif italic mb-6">Literary Vision</h4>
                  <p className="text-white/70 text-base leading-relaxed italic font-light">
                    "{author.literaryVision}"
                  </p>
                </motion.div>
              )}
            </div>

            {/* Biography Content */}
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-4xl"
              >
                <div className="flex items-center space-x-6 mb-12">
                  <h3 className="text-4xl md:text-5xl font-serif text-primary italic m-0">✍️ About the Author</h3>
                  <div className="h-[1px] flex-grow bg-primary/5" />
                </div>
                
                <div className="space-y-8 text-primary/80 leading-relaxed font-light text-xl">
                  <p className="first-letter:text-5xl first-letter:font-serif first-letter:text-secondary first-letter:mr-3 first-letter:float-left">
                    {author.bio}
                  </p>
                  
                  {author.id.toString() === '4' ? (
                    <>
                      <p>
                        Deep Patel's writing explores themes of resilience, self-discovery, social understanding, and inner strength. For him, writing is not merely a profession but a responsibility—to reflect truth, inspire courage, and create stories that leave a thoughtful and lasting impact on readers across generations.
                      </p>
                      
                      <div className="py-10 my-10 border-y border-primary/5 italic font-serif text-2xl text-primary/60 text-center px-12">
                        "Preserving culture is not about looking back, but about building a bridge for the future."
                      </div>

                      <p>
                        Academically, Deep Patel holds a Master's degree in Science (M.Sc.) with specialization in Organic Chemistry, reflecting a strong foundation in the scientific field. However, despite his formal education in science, his heart and creative spirit are deeply rooted in Gujarati literature and culture.
                      </p>
                      
                      <p>
                        He is not only a keen admirer of Gujarati literature but also an active contributor and promoter of its essence through his writing and artistic expression.
                      </p>
                      
                      <div className="bg-white p-12 border border-primary/5 shadow-lg my-12 relative">
                        <div className="absolute top-0 left-0 w-2 h-full bg-secondary" />
                        <h4 className="text-xl font-serif italic text-primary mb-4">Navodit Artist in Lokdayra</h4>
                        <p className="text-lg">
                          Beyond the written word, Deep Patel is a navodit (emerging) artist in the field of <strong className="italic">Lokdayra</strong>, known for his distinctive voice and engaging storytelling style. Through folk narratives and expressive narration, he has begun to carve a special place in the hearts of people, connecting tradition with contemporary sensitivity.
                        </p>
                      </div>
                      
                      <p>
                        Through literature, publishing, and folk expression, Deep Patel continues his journey of keeping culture alive while giving voice to stories that matter.
                      </p>
                    </>
                  ) : (
                    <p>
                      {author.name} is a dedicated professional in the literary world, bringing a unique perspective and deep commitment to their craft. With a focus on quality and meaningful storytelling, they contribute significantly to the cultural landscape.
                    </p>
                  )}
                </div>

                {/* Publications Section */}
                {books.length > 0 && (
                  <div className="mt-20">
                    <div className="flex items-center justify-between mb-10 border-b border-primary/5 pb-4">
                      <h3 className="text-3xl font-serif text-primary italic m-0">Recent Publications</h3>
                      <Link 
                        to={`/books?authorId=${id}`} 
                        className="text-xs font-bold text-secondary hover:text-primary transition-all hover:underline z-10"
                      >
                        View All Books
                      </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {books.map((book) => (
                        <motion.div 
                          key={book.id}
                          whileHover={{ y: -5 }}
                          className="bg-white p-6 border border-primary/5 shadow-md flex space-x-6"
                        >
                          <div className="w-24 h-32 flex-shrink-0 overflow-hidden shadow-sm">
                            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col justify-center">
                            <h4 className="text-xl font-serif text-primary mb-2 line-clamp-1">{book.title}</h4>
                            <span className="text-[10px] uppercase tracking-widest text-primary/40 font-bold mb-3">{book.category}</span>
                            <Link to={`/books/${book.id}`} className="text-xs font-bold text-secondary group flex items-center">
                              READ MORE <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

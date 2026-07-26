import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, MessageCircle, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import BookCard from '../components/BookCard';
import AuthorCard from '../components/AuthorCard';
import ReviewCard from '../components/ReviewCard';
import { Book, Author, Review } from '../types';
import { ASSETS } from '../constants/assets';

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, authorsRes, reviewsRes] = await Promise.all([
          fetch('/api/books'),
          fetch('/api/authors'),
          fetch('/api/reviews')
        ]);
        const booksData = await booksRes.json();
        const authorsData = await authorsRes.json();
        const reviewsData = await reviewsRes.json();

        setBooks(booksData.filter((b: Book) => b.featured).slice(0, 4));
        setAuthors(authorsData.slice(0, 3));
        setReviews(reviewsData.slice(0, 3)); // Store the top 3 testimonials dynamically
      } catch (err) {
        console.error('Fetch home data failed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <HeroSlider />

      {/* About Section */}
      <section className="py-16 bg-white sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 items-center lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-secondary font-bold mb-4">Our Legacy</h2>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif text-primary mb-6 sm:mb-8 leading-tight">
                Crafting Literature that Transcend Generations
              </h3>
              <p className="text-primary/70 text-base sm:text-lg leading-relaxed mb-8">
                Deepam Kesari Publishing House stands as a beacon for intellectual pursuit and cultural preservation. Founded with the vision to bring meaningful stories and profound knowledge to the world, we specialize in high-quality publishing that honors the depth of our literary heritage.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 text-primary font-bold group"
              >
                <span className="border-b-2 border-secondary pb-1 transition-all group-hover:pr-4">Read More About Us</span>
                <ArrowRight size={18} className="text-secondary" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-bg overflow-hidden shadow-2xl">
                <img
                  src={ASSETS.images.fallbackImage}
                  alt="About Deepam Kesari"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-secondary p-10 hidden md:block">
                <span className="block text-4xl font-serif text-primary mb-2">2+</span>
                <span className="block text-xs uppercase tracking-widest text-primary/60 font-bold">Years of Trust</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16 bg-bg sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10 sm:mb-12">
            <div>
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-secondary font-bold mb-4">The Collection</h2>
              <h3 className="text-3xl sm:text-4xl font-serif text-primary">Featured Books</h3>
            </div>
            <Link to="/books" className="text-sm font-bold text-secondary hover:text-primary transition-colors flex items-center space-x-2 underline underline-offset-8 decoration-2">
              <span>View All Publications</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {books.map((book, i) => (
              <BookCard key={book.id} book={book} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Authors Section */}
        <section className="py-16 bg-white sm:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-secondary font-bold mb-4">Meet the Visionaries</h2>
            <h3 className="text-3xl sm:text-4xl font-serif text-primary mb-12 sm:mb-16">Distinguished Authors</h3>

            <div
              className={
                `grid ${
                  authors.length === 1
                    ? 'grid-cols-1'
                    : authors.length === 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : 'grid-cols-1 md:grid-cols-3'
                } gap-12 justify-center justify-items-center max-w-4xl mx-auto`
              }
            >
              {authors.map((author, i) => (
                <AuthorCard key={author.id} author={author} index={i} />
              ))}
            </div>

          <div className="mt-16">
            <Link to="/authors" className="inline-block bg-primary text-white px-10 py-4 rounded-md font-medium text-sm hover:bg-primary/90 transition-all">
              See All Profiles
            </Link>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-primary text-white relative overflow-hidden sm:py-20 lg:py-24">
        {/* Background Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/5 -skew-x-12 transform translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="text-secondary text-[10px] uppercase tracking-[0.3em] font-bold mb-6">Our Path</h2>
              <h3 className="text-3xl sm:text-4xl font-serif mb-6 sm:mb-8">Our Vision</h3>
              <p className="text-base sm:text-xl text-white/70 leading-relaxed font-light">
                To be the most respected global platform for intellectual literature, bridging the gap between ancient wisdom and contemporary thought, while nurturing the next generation of deep thinkers and creative writers.
              </p>
            </div>

            <div>
              <h2 className="text-secondary text-[10px] uppercase tracking-[0.3em] font-bold mb-6">Our Purpose</h2>
              <h3 className="text-3xl sm:text-4xl font-serif mb-6 sm:mb-8">Our Mission</h3>
              <ul className="space-y-6">
                {[
                  "Upholding the highest standards of editorial and production quality.",
                  "Promoting diverse voices and unconventional ideas that challenge the status quo.",
                  "Facilitating easy access to knowledge through digital and physical channels.",
                  "Creating a thriving community for authors, scholars, and avid readers."
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <CheckCircle2 className="text-secondary shrink-0 mt-1" size={20} />
                    <span className="text-white/80 font-light">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery / Events Preview */}
      <section className="py-16 bg-white sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-secondary font-bold mb-4">Events & Gallery</h2>
              <h3 className="text-3xl sm:text-4xl font-serif text-primary mb-6">Moments of learning, conversation, and celebration</h3>
              <p className="text-primary/65 text-base leading-7 mb-8">
                From book launches to literary gatherings, our events bring readers, authors, and thinkers together in inspiring spaces.
              </p>
              <Link to="/gallery" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-white transition hover:bg-secondary hover:text-primary">
                Explore Gallery and Events
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <img src="/assets/images/BOOK_STACK.jpeg" alt="Event" className="h-48 w-full rounded-3xl object-cover shadow-lg sm:h-64" />
              <img src="/assets/images/BOOK_STACK2.jpeg" alt="Event" className="h-48 w-full rounded-3xl object-cover shadow-lg sm:mt-10 sm:h-64" />
              <img src="/assets/images/books.jpeg" alt="Event" className="h-48 w-full rounded-3xl object-cover shadow-lg sm:h-64" />
              <img src="/assets/images/IMG_20250506_113923.png" alt="Event" className="h-48 w-full rounded-3xl object-cover shadow-lg sm:mt-10 sm:h-64" />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-bg sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 sm:mb-16">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-secondary font-bold mb-4">Testimonials</h2>
          <h3 className="text-3xl sm:text-4xl font-serif text-primary">Voices from our Community</h3>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Reviews could also be fetched or kept as hardcoded testimonials */}
            {reviews && reviews.length > 0 ? (
              reviews.map((review, index) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  index={index}
                />
              ))
            ) : (
              <>
                {/* Keep these high-quality static fallbacks if the database is unseeded */}
                <ReviewCard
                  review={{
                    id: '1',
                    comment: 'Deepam Kesari brings out the most authentic literature. Their attention to detail in translation is impeccable. Very inspiring collection. Must read for every literature lover.',
                    userName: 'Deep Patel',
                    rating: 5,
                    bookId: '6',
                    createdAt: new Date().toISOString()
                  }}
                  index={0}
                />
              </>
            )}
          </div>

          <div className="text-center mt-12">
            <Link to="/reviews" className="text-primary font-bold hover:text-secondary transition-colors underline underline-offset-4 decoration-secondary">
              Read All Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* Order CTA Section */}
      <section className="py-16 bg-white sm:py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-bg p-10 sm:p-12 md:p-20 text-center rounded-3xl relative overflow-hidden"
          >
            {/* Minimal background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#C8A96A 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif text-primary mb-6 relative z-10">Ready to expand your library?</h3>
            <p className="text-base sm:text-lg text-primary/60 mb-10 sm:mb-12 max-w-2xl mx-auto relative z-10 leading-relaxed font-light">
              Explore our full catalog and find your next intellectual adventure. Order directly via WhatsApp for a personalized experience or browse on Amazon.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 relative z-10">
              <a
                href="https://amzn.in/d/03abeR2d"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-primary text-white px-10 py-4 rounded-md font-medium text-sm hover:bg-primary/90 transition-all flex items-center justify-center space-x-3"
              >
                <ShoppingBag size={20} />
                <span>Shop on Amazon</span>
              </a>
              <a
                href="https://wa.me/919664959238"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-white border border-primary/10 text-primary px-10 py-4 rounded-md font-medium text-sm hover:border-secondary hover:text-secondary transition-all flex items-center justify-center space-x-3 shadow-sm"
              >
                <MessageCircle size={20} className="text-green-500" />
                <span>Order via WhatsApp</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

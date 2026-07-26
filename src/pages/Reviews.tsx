import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';
import { Review } from '../types';
import { MessageSquare, Quote, Sparkles, Star } from 'lucide-react';

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const res = await fetch('/api/reviews');
        const reviewsData = await res.json();
        const normalizedReviews = Array.isArray(reviewsData)
          ? reviewsData
          : Array.isArray(reviewsData.reviews)
            ? reviewsData.reviews
            : [];

        const getTimestamp = (value: unknown) => {
          const timestamp = new Date(value as string | number | Date | undefined).getTime();
          return Number.isFinite(timestamp) ? timestamp : 0;
        };

        const allReviews = [...normalizedReviews].sort((a: any, b: any) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt));

        setReviews(allReviews);
        setCurrentPage(1);
      } catch (err) {
        console.error('Failed to fetch reviews', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllReviews();
  }, []);

  const totalPages = Math.max(1, Math.ceil(reviews.length / perPage));
  const paginatedReviews = reviews.slice((currentPage - 1) * perPage, currentPage * perPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const totalReaders = new Set(reviews.map((review) => review.userName)).size;

  return (
    <div className="min-h-screen bg-bg px-4 pb-24 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#111111_0%,#1f1f1f_52%,#4a3a1d_100%)] px-6 py-16 shadow-2xl shadow-primary/10 sm:px-8 md:px-12 md:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(200,169,106,0.18),transparent_16%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_14%)]" />
          <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:36px_36px]" />
          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="text-center lg:text-left">
              <div className="mb-5 flex items-center justify-center gap-4 lg:justify-start">
                <span className="h-px w-12 bg-secondary/70" />
                <Sparkles className="text-secondary" size={20} />
                <span className="h-px w-12 bg-secondary/70" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-secondary">Voice of Readers</p>
              <h1 className="mt-4 text-4xl font-serif italic text-white md:text-6xl">Community Feedback</h1>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/65 md:text-base lg:mx-0">
                Every review helps shape the next great read. Here’s what our readers are saying.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -left-4 top-8 h-16 w-16 rounded-2xl bg-secondary/15 blur-2xl" />
              <div className="absolute -right-4 bottom-6 h-20 w-20 rounded-2xl bg-white/10 blur-2xl" />
              <div className="relative rounded-[1.9rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-secondary">Reader score</p>
                    <h2 className="mt-2 text-5xl font-semibold text-white">{averageRating}</h2>
                  </div>
                  <div className="rounded-2xl bg-secondary/10 p-3 text-secondary">
                    <Quote size={18} />
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < Math.round(Number(averageRating)) ? 'fill-secondary text-secondary' : 'text-white/10'} />
                  ))}
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-black/20 p-4 text-center">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">Reviews</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">{reviews.length}</h3>
                  </div>
                  <div className="rounded-2xl bg-black/20 p-4 text-center">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">Readers</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">{totalReaders}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="py-24 text-center text-base italic text-primary/40">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="py-24 text-center text-primary/40 italic">No reviews found yet. Check back later.</div>
        ) : (
          <>
            <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {paginatedReviews.map((review, i) => (
                <ReviewCard key={review.id} review={review} index={i} />
              ))}
            </section>

            <div className="mt-8 flex flex-col items-center gap-3">
              <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-[1rem] border border-primary/10 bg-white/85 px-2.5 py-2 shadow-[0_8px_20px_rgba(27,23,16,0.05)] backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="rounded-full px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary transition hover:bg-secondary/15 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 min-w-8 rounded-full px-2 text-[11px] font-semibold transition ${
                      currentPage === page
                        ? 'bg-secondary text-primary shadow-sm'
                        : 'text-primary/60 hover:bg-secondary/15 hover:text-primary'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-full px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary transition hover:bg-secondary/15 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>

              <p className="text-[10px] uppercase tracking-[0.24em] text-primary/40">
                Page {currentPage} of {totalPages}
              </p>
            </div>
          </>
        )}

        <section className="relative mt-20 overflow-hidden rounded-[2rem] bg-primary px-8 py-16 text-center shadow-2xl shadow-primary/10 md:px-16">
          <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-secondary/10 blur-3xl" />
          <div className="relative z-10">
            <MessageSquare className="mx-auto mb-6 text-secondary" size={48} />
            <h3 className="text-3xl font-serif italic text-white md:text-5xl">Join the Dialogue</h3>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65 md:text-base">
              Share your thoughts, help others discover meaningful books, and be part of our growing literary community.
            </p>
            <Link
              to="/books"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-secondary px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.28em] text-primary transition hover:bg-white"
            >
              Explore and Review
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

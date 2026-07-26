import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, MessageCircle, ArrowLeft, BookOpen, Hash, Globe, Tag, Star } from 'lucide-react';
import { Book, Review } from '../types';
import ReviewCard from '../components/ReviewCard';
import BookCard from '../components/BookCard';

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagedReviews, setPagedReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const perPage = 6;
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewErrors, setReviewErrors] = useState<string[]>([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const res = await fetch(`/api/books/${id}`);
        if (!res.ok) throw new Error('Book not found');
        const data = await res.json();
        setBook(data);
        setMainImage(data.galleryImages && data.galleryImages.length > 0 ? data.galleryImages[0] : data.coverImage);

        // Try to lazy-load first page of reviews (API may support pagination)
        await fetchReviewsPage(1);

        // Fetch related or all books as fallback
        const allRes = await fetch('/api/books');
        const allData = await allRes.json();
        setRelatedBooks(allData.filter((b: Book) => b.id.toString() !== id).slice(0, 4));

        // Handle hash scroll after content is loaded
        if (window.location.hash === '#review-form') {
          setTimeout(() => {
            const el = document.getElementById('review-form');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 500);
        }
      } catch (err) {
        console.error('Fetch book details failed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookDetails();
  }, [id]);

  useEffect(() => {
    if (id) fetchReviewsPage(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchReviewsPage = async (page: number = 1) => {
    if (!id) return;
    setLoadingReviews(true);

    const applyPagination = (all: Review[]) => {
      const normalizedReviews = Array.isArray(all) ? all : [];
      setReviews(normalizedReviews);
      setPagedReviews(normalizedReviews.slice((page - 1) * perPage, page * perPage));
      setTotalPages(Math.max(1, Math.ceil(normalizedReviews.length / perPage)));
    };

    try {
      const res = await fetch(`/api/reviews/${id}?page=${page}&limit=${perPage}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        applyPagination(data);
        return;
      }

      if (data?.reviews) {
        const normalizedReviews = Array.isArray(data.reviews) ? data.reviews : [];
        setPagedReviews(normalizedReviews);
        setReviews(normalizedReviews);
        const tot = Number(data.total ?? data.count ?? 0);
        setTotalPages(tot > 0 ? Math.max(1, Math.ceil(tot / perPage)) : 1);
        return;
      }

      if (res.ok) {
        applyPagination([]);
        return;
      }

      const fallbackRes = await fetch(`/api/reviews/${id}`);
      const fallbackData = await fallbackRes.json();
      applyPagination(Array.isArray(fallbackData) ? fallbackData : fallbackData.reviews || []);
    } catch (err) {
      console.error('Fetch reviews failed', err);
      try {
        const fallbackRes = await fetch(`/api/reviews/${id}`);
        const fallbackData = await fallbackRes.json();
        applyPagination(Array.isArray(fallbackData) ? fallbackData : fallbackData.reviews || []);
      } catch (e) {
        console.error('Fallback fetch reviews failed', e);
      }
    } finally {
      setLoadingReviews(false);
    }
  };

  if (loading) {
    return <div className="py-40 text-center bg-bg font-serif italic">Loading masterpieces...</div>;
  }

  if (!book) {
    return (
      <div className="py-40 text-center bg-bg">
        <h2 className="text-3xl font-serif mb-4">Book Not Found</h2>
        <Link to="/books" className="text-secondary font-bold underline">Back to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen">
      {/* Top Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/books" className="inline-flex items-center space-x-2 text-sm font-medium text-primary/60 hover:text-secondary transition-colors">
          <ArrowLeft size={16} />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Main Product Section */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Book Cover */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-4 shadow-2xl relative"
              >
                <img
                  src={mainImage || book.coverImage}
                  alt={book.title}
                  className="w-full h-auto object-cover"
                />
                {/* Thumbnails gallery */}
                {book.galleryImages && book.galleryImages.length > 0 && (
                  <div className="mt-4 flex items-center gap-3 overflow-x-auto">
                    {book.galleryImages.map((img, idx) => (
                      <button
                        key={img + idx}
                        onClick={() => setMainImage(img)}
                        className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border ${mainImage === img ? 'ring-2 ring-secondary' : 'border-white/10'}`}
                      >
                        <img src={img} alt={`thumb-${idx}`} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
                <div className="absolute top-0 right-0 bg-secondary px-4 py-2 translate-x-4 -translate-y-4 shadow-lg">
                  <span className="text-xs font-bold text-primary italic uppercase tracking-widest">Deepam Kesari Edition</span>
                </div>
              </motion.div>
            </div>

            {/* Book Info */}
            <div className="lg:col-span-1" /> {/* Spacer */}
            <div className="lg:col-span-6 space-y-10">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] font-bold text-secondary mb-4 block">Exclusive Release</span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary mb-2 italic">
                  {book.title}
                </h1>
                <p className="text-lg font-medium text-primary/60 italic">
                  by {book.authorName || book.authorId}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pb-8 border-b border-primary/5">
                <div className="flex items-center space-x-3 text-sm text-primary/70">
                  <BookOpen size={18} className="text-secondary" />
                  <span>{book.category}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-primary/70">
                  <Globe size={18} className="text-secondary" />
                  <span>{book.language}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-primary/70">
                  <Hash size={18} className="text-secondary" />
                  <span>ISBN: {book.isbn}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-primary/70">
                  <Tag size={18} className="text-secondary" />
                  <span>Hardcover</span>
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-primary/70 leading-relaxed font-light">
                {book.description.split('\n').map((para, i) => (
                  <p key={i} className="mb-4">{para}</p>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <a
                  href={book.amazonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-primary text-white text-center py-4 rounded-lg font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center space-x-3"
                >
                  <ShoppingBag size={20} />
                  <span>Purchase on Amazon</span>
                </a>
                <a
                  href={book.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white border border-primary/10 text-primary text-center py-4 rounded-lg font-bold text-sm hover:border-secondary hover:text-secondary transition-all flex items-center justify-center space-x-3 shadow-sm"
                >
                  <MessageCircle size={20} className="text-green-500" />
                  <span>Order via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 border-t border-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-16">
            {/* Reviews List */}
            <div className="lg:w-2/3">
              <h3 className="text-3xl font-serif text-primary italic mb-12">Reader Reviews</h3>
              {((pagedReviews && pagedReviews.length > 0) || (reviews && reviews.length > 0)) ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {(pagedReviews.length > 0 ? pagedReviews : reviews.slice((currentPage - 1) * perPage, currentPage * perPage)).map((review, i) => (
                      <ReviewCard key={review.id} review={review} index={i} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                      {Array.from({ length: totalPages }).map((_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`min-w-10 rounded-full px-3 py-2 text-sm font-semibold transition-all duration-200 ${currentPage === page
                              ? 'bg-secondary text-primary shadow-md shadow-secondary/20'
                              : 'border border-primary/10 bg-white text-primary/70 hover:border-secondary/40 hover:text-secondary'}`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 bg-white/50 border border-primary/5 rounded-xl">
                  <p className="text-primary/40 font-serif italic">No reviews yet for this masterpiece. Be the first to share your experience.</p>
                </div>
              )}
            </div>

            {/* Review Form */}
            <div className="lg:w-1/3" id="review-form">
              <div className="bg-primary p-8 rounded-2xl shadow-xl border border-white/10 sticky top-24 overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-secondary/20 transition-colors" />
                <h4 className="text-xl font-serif text-white italic mb-2 relative z-10">Share Your Experience</h4>
                <p className="text-white/60 text-xs font-light mb-8 relative z-10 leading-relaxed">Your feedback helps fellow readers discover their next great read.</p>

                <form
                  onSubmit={async (e: any) => {
                    e.preventDefault();
                    setSubmittingReview(true);
                    setReviewErrors([]);
                    const formData = new FormData(e.currentTarget);
                    const reviewData = {
                      bookId: id,
                      userName: formData.get('userName'),
                      rating: Number(rating),
                      comment: formData.get('comment')
                    };

                    try {
                      const res = await fetch('/api/reviews', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(reviewData)
                      });
                      const result = await res.json();
                      if (res.ok) {
                        const reviewsRes = await fetch(`/api/reviews/${id}?page=1&limit=${perPage}`);
                        const reviewsData = await reviewsRes.json();
                        if (Array.isArray(reviewsData)) {
                          setReviews(reviewsData);
                          setPagedReviews(reviewsData);
                          setTotalPages(Math.max(1, Math.ceil(reviewsData.length / perPage)));
                        } else if (reviewsData?.reviews) {
                          const normalizedReviews = Array.isArray(reviewsData.reviews) ? reviewsData.reviews : [];
                          setReviews(normalizedReviews);
                          setPagedReviews(normalizedReviews);
                          const tot = Number(reviewsData.total ?? reviewsData.count ?? 0);
                          setTotalPages(tot > 0 ? Math.max(1, Math.ceil(tot / perPage)) : 1);
                        }
                        setCurrentPage(1);
                        setRating(0);
                        (e.target as HTMLFormElement).reset();
                      } else if (result.errors) {
                        setReviewErrors(result.errors);
                      } else {
                        setReviewErrors([result.message || 'An error occurred.']);
                      }
                    } catch (err) {
                      console.error('Submit review failed', err);
                      setReviewErrors(['Network error.']);
                    } finally {
                      setSubmittingReview(false);
                    }
                  }}
                  className="space-y-6 relative z-10"
                >
                  {reviewErrors.length > 0 && (
                    <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-xs">
                      <ul className="list-disc list-inside space-y-1">
                        {reviewErrors.map((err, i) => <li key={i}>{err}</li>)}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Your Name</label>
                    <input
                      name="userName"
                      type="text"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                      placeholder="e.g. Ronak Patel"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Rating</label>
                    <div className="flex items-center space-x-2 bg-white/5 p-3 rounded-xl border border-white/10">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            size={20}
                            className={`transition-colors ${(hoverRating || rating) >= star
                                ? "text-secondary fill-secondary"
                                : "text-white/10"
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Review</label>
                    <textarea
                      name="comment"
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-secondary transition-colors resize-none"
                      placeholder="What did you think of this work?"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full bg-secondary text-primary font-bold py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-secondary/90 transition-all transform hover:-translate-y-1 shadow-lg shadow-black/20 disabled:opacity-50"
                  >
                    {submittingReview ? 'Posting...' : 'Post Review'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <section className="py-24 bg-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-serif text-primary mb-12 italic">You might also like...</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedBooks.map((b, i) => (
                <BookCard key={b.id} book={b} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

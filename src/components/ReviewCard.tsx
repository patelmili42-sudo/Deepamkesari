import { motion } from 'motion/react';
import { Review } from '../types';
import { Quote, Star } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
  index?: number;
  key?: string | number;
}

export default function ReviewCard({ review, index = 0 }: ReviewCardProps) {
  const reviewDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  const normalizedComment = (review.comment ?? '').toString().trim();
  const displayComment = normalizedComment || 'A thoughtful review will be shared here soon.';
  const displayName = typeof review.userName === 'string' && review.userName.trim()
    ? review.userName.trim()
    : 'Anonymous Reader';
  const avatarLetter = displayName.charAt(0).toUpperCase() || 'R';

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{ y: -4 }}
      className="group relative flex h-[18.5rem] flex-col overflow-hidden rounded-[1.5rem] border border-primary/10 bg-[linear-gradient(180deg,#fffdf7_0%,#fffaf1_100%)] p-4 shadow-[0_10px_30px_rgba(27,23,16,0.05)] transition-all duration-300 hover:border-secondary/25 hover:shadow-xl hover:shadow-primary/8 sm:p-5"
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-secondary/10 blur-2xl" />
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-secondary/0 via-secondary/90 to-secondary/0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(200,169,106,0.08),transparent_18%)] opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white">
          <Star size={10} className="fill-secondary text-secondary" />
          {review.rating}.0
        </div>
        <div className="rounded-full bg-secondary/10 p-1.5 text-secondary">
          <Quote size={14} />
        </div>
      </div>

      <div className="relative z-10 mt-4 flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < review.rating ? 'fill-secondary text-secondary' : 'text-primary/10'}
          />
        ))}
      </div>

      <div className="relative z-10 mt-4 flex min-h-0 flex-1 flex-col">
        <div className="relative flex-1 overflow-hidden rounded-[0.95rem] bg-primary/[0.03] px-2.5 py-2.5">
          <div
            className="h-[6.25rem] overflow-y-auto pr-1 text-[13px] leading-6 text-primary/80 italic [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <p>“{displayComment}”</p>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#fffaf1] to-transparent" />
        </div>
      </div>

      <div className="relative z-10 mt-4 flex items-center justify-between gap-2 border-t border-primary/5 pt-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary via-[#2a2a2a] to-secondary text-sm font-bold text-white shadow-sm">
            {avatarLetter}
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-[13px] font-semibold text-primary">{displayName}</h4>
            <p className="text-[9px] uppercase tracking-[0.22em] text-primary/40">Verified Reader</p>
          </div>
        </div>
        <span className="shrink-0 text-[9px] uppercase tracking-[0.18em] text-primary/35">{reviewDate}</span>
      </div>

    </motion.div>
  );
}

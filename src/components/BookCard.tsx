import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Book as BookType } from '../types';
import { ASSETS } from '../constants/assets';

interface BookCardProps {
  book: BookType;
  index?: number;
  key?: string | number;
}

const handleImageError = (event: { currentTarget: HTMLImageElement }) => {
  const target = event.currentTarget;
  if (target.src !== ASSETS.images.fallbackImage) {
    target.src = ASSETS.images.fallbackImage;
  }
};

export default function BookCard({ book, index = 0 }: BookCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-bg/50 shadow-sm mb-4">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
        <div className="absolute bottom-4 left-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-300 space-y-2">
          <Link
            to={`/books/${book.id}`}
            className="block w-full bg-white text-primary text-center py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all"
          >
            READ MORE
          </Link>
          <Link
            to={`/books/${book.id}#review-form`}
            className="block w-full bg-primary/80 backdrop-blur-sm text-white text-center py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-secondary hover:text-primary transition-colors"
          >
            Give Review
          </Link>
        </div>
      </div>
      
      <div className="space-y-1 px-1">
        <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">
          {book.category}
        </p>
        <h3 className="font-serif text-lg text-primary line-clamp-1">
          {book.title}
        </h3>
        <p className="text-sm text-primary/60">
          {book.authorName || book.authorId}
        </p>
      </div>
    </motion.div>
  );
}

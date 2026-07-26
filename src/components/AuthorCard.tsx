import { motion } from 'motion/react';
import { Author } from '../types';
import { Link } from 'react-router-dom';
import { ASSETS } from '../constants/assets';

interface AuthorCardProps {
  author: Author;
  index?: number;
  key?: string | number;
}

const handleImageError = (event: { currentTarget: HTMLImageElement }) => {
  const target = event.currentTarget;
  if (target.src !== ASSETS.images.fallbackImage) {
    target.src = ASSETS.images.fallbackImage;
  }
};

export default function AuthorCard({ author, index = 0 }: AuthorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="text-center group"
    >
      <div className="relative w-40 h-40 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-secondary/20 scale-110 group-hover:scale-115 group-hover:border-secondary transition-transform duration-500" />
        <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl">
          <img
            src={author.photo}
            alt={author.name}
            className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110"
            onError={handleImageError}
          />
        </div>
      </div>
      
      <h3 className="font-serif text-xl text-primary mb-1">{author.name}</h3>
      <p className="text-xs uppercase tracking-[0.2em] text-secondary font-bold mb-3">
        {author.role}
      </p>
      <p className="text-sm text-primary/60 line-clamp-3 px-4 italic font-light">
        "{author.bio}"
      </p>
      
      <Link 
        to={`/authors/${author.id}`}
        className="inline-block mt-4 text-xs font-bold text-primary hover:text-secondary uppercase tracking-widest transition-colors"
      >
        View Profile
      </Link>
    </motion.div>
  );
}

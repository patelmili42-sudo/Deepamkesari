import { motion } from 'motion/react';
import { ASSETS } from '../constants/assets';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showImage?: boolean;
}

export default function Logo({ className = '', variant = 'dark', size = 'md', showImage = true }: LogoProps) {
  const sizes = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-16 w-auto'
  };

  const colors = {
    light: 'text-white',
    dark: 'text-primary'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {showImage && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <img
            src={ASSETS.images.logo}
            alt="Deepam Kesari Logo"
            className={`${sizes[size]} object-contain`}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </motion.div>
      )}
      <div className="flex flex-col items-center leading-none text-center">
        <span className={`font-serif font-bold tracking-tighter ${size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-lg' : 'text-xl'} ${colors[variant]} block w-full`}>
          DEEPAM <span style={{ color: '#d45d00' }}>KESARI</span>
        </span>
        <span className={`text-[9px] uppercase tracking-[0.2em] font-medium ${variant === 'light' ? 'text-white/60' : 'text-primary/60'} block w-full mt-1`}>
          Publishing House
        </span>
      </div>
    </div>
  );
}

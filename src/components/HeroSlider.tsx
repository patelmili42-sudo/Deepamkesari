import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, MessageCircle, ExternalLink, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ASSETS } from '../constants/assets';

const AMAZON_LINK = 'https://amzn.in/d/03abeR2d';

const SLIDES = [
  {
    id: 1,
    title: "રસ્તો કરી જવાના",
    subtitle: "A collection of inspiring Gujarati literature by Deep Patel, bridging tradition and modern thought.",
    image: ASSETS.images.hero1,
    fallback: ASSETS.images.book_stack,
    primaryAction: { label: "Explore Collection", link: "/books" },
    secondaryAction: { label: "Order on WhatsApp", link: "https://wa.me/919664959238" },
    tertiaryAction: { label: "Shop on Amazon", link: AMAZON_LINK },
    icon: <MessageCircle size={18} />
  },
  {
    id: 2,
    title: "Preserving Cultural Heritage",
    subtitle: "At Deepam Kesari, we believe literature is the soul of culture. Our works reflect the timeless values of our heritage.",
    image: ASSETS.images.hero2,
    fallback: ASSETS.images.book_stack,
    primaryAction: { label: "Our Story", link: "/about" },
    secondaryAction: { label: "Connect Now", link: "/contact" },
    icon: <ExternalLink size={18} />
  },
  {
    id: 3,
    title: "A Vision for Tomorrow",
    subtitle: "Empowering new voices while honoring the masters. Join us in our journey of literary preservation.",
    image: ASSETS.images.hero3,
    fallback: ASSETS.images.book_stack,
    primaryAction: { label: "Join the Vision", link: "/authors" },
    secondaryAction: { label: "Browse Works", link: "/books" },
    icon: <ChevronRight size={18} />
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
  const prev = () => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <section className="relative min-h-[640px] w-full overflow-hidden bg-primary text-white sm:min-h-[720px] lg:h-[80vh] lg:min-h-[620px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* Background Blurred Image as Fallback */}
          <div 
            className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20 scale-110"
            style={{ backgroundImage: `url(${SLIDES[current].image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />

          {/* Content & Main Image Layout */}
          <div className="relative h-full max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-0 flex items-center">
            <div className="grid grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16 items-center w-full">
              {/* Text Content */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="z-10 max-w-2xl"
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight">
                  {SLIDES[current].title}
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-white/80 mb-8 sm:mb-10 max-w-2xl font-light leading-relaxed">
                  {SLIDES[current].subtitle}
                </p>
                
                <div className="flex items-center gap-3 pb-1 flex-nowrap">
                  <Link
                    to={SLIDES[current].primaryAction.link}
                    className="bg-secondary text-primary px-6 py-3 rounded-md font-medium text-xs sm:text-sm hover:bg-secondary/90 transition-all transform hover:-translate-y-1 whitespace-nowrap"
                  >
                    {SLIDES[current].primaryAction.label}
                  </Link>
                  {SLIDES[current].secondaryAction && (
                    <a
                      href={SLIDES[current].secondaryAction.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-md font-medium text-xs sm:text-sm hover:bg-white/20 transition-all flex items-center transform hover:-translate-y-1 whitespace-nowrap"
                    >
                      {SLIDES[current].icon}
                      <span className="ml-2">{SLIDES[current].secondaryAction.label}</span>
                    </a>
                  )}
                  {current === 0 && SLIDES[0].tertiaryAction && (
                    <a
                      href={SLIDES[0].tertiaryAction.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-primary px-6 py-3 rounded-md font-medium text-xs sm:text-sm hover:bg-white/90 transition-all flex items-center transform hover:-translate-y-1 whitespace-nowrap"
                    >
                      <ShoppingBag size={18} />
                      <span className="ml-2">{SLIDES[0].tertiaryAction.label}</span>
                    </a>
                  )}
                </div>
              </motion.div>

              {/* Slide Image - Displayed properly for both landscape and portrait */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="flex justify-center lg:justify-end"
              >
                <div className="relative group w-full max-w-sm sm:max-w-md lg:max-w-none">
                  <div className="absolute -inset-8 bg-secondary/10 rounded-xl blur-2xl group-hover:bg-secondary/20 transition-all" />
                  <img
                    src={SLIDES[current].image}
                    alt={SLIDES[current].title}
                    className="relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[520px] max-h-[360px] sm:max-h-[420px] lg:max-h-[500px] object-contain rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                    onError={(e: any) => {
                      (e.target as HTMLImageElement).src = SLIDES[current].fallback;
                    }}
                  />
                  {current === 0 && (
                    <div className="absolute -bottom-6 -right-6 bg-secondary p-4 shadow-xl rounded-md rotate-3 group-hover:rotate-0 transition-transform">
                      <span className="text-xs font-bold text-primary uppercase tracking-widest">New Release</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute bottom-6 right-6 z-20 flex space-x-2 sm:bottom-10 sm:right-10">
        <button
          onClick={prev}
          className="p-3 text-white border border-white/20 rounded-full hover:bg-white hover:text-primary transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={next}
          className="p-3 text-white border border-white/20 rounded-full hover:bg-white hover:text-primary transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 left-6 z-20 flex space-x-3 sm:bottom-10 sm:left-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 transition-all rounded-full ${
              current === i ? "w-12 bg-secondary" : "w-6 bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

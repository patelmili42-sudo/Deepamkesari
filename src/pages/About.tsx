import { motion } from 'motion/react';
import { BookOpen, Shield, Heart, Award, Zap, Globe } from 'lucide-react';

export default function About() {
  const values = [
    { icon: <Shield size={24} />, title: "Integrity", desc: "Honest, transparent, and ethical publishing at every step." },
    { icon: <Heart size={24} />, title: "Purpose", desc: "Driven by a mission to preserve culture and spark change." },
    { icon: <Award size={24} />, title: "Excellence", desc: "Commitment to the highest standards of creative quality." },
    { icon: <Zap size={24} />, title: "Innovation", desc: "Blending traditional values with modern publishing practices." }
  ];

  return (
    <div className="bg-bg">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-primary">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl -ml-48 -mb-48" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-secondary uppercase tracking-[0.4em] text-xs font-bold mb-6 block"
          >
            Our Story & Vision
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif text-white italic mb-8"
          >
            Deepam Kesari <br />
            <span className="text-secondary">Publishing House</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-[1px] bg-secondary/50 mx-auto"
          />
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-block p-4 bg-secondary/10 rounded-2xl">
                <BookOpen className="text-secondary" size={32} />
              </div>
              <h2 className="text-4xl font-serif text-primary italic leading-tight">
                Nurturing Meaningful Voices & Impactful Stories
              </h2>
              <div className="space-y-6 text-primary/70 font-light leading-relaxed text-lg">
                <p>
                  Deepam Kesari Publishing House is a purpose-driven independent publishing platform dedicated to nurturing meaningful voices and impactful stories. Rooted in cultural values and inspired by the richness of Indian thought alongside contemporary realities, we create, write, and publish our own original books while also supporting authors in publishing their works with integrity and excellence.
                </p>
                <p>
                  We specialize in literature that preserves culture, raises social awareness, and sparks positive change — including poetry, personal growth, educational works, motivational writing, and untold narratives. Every powerful idea deserves the right platform, whether it originates from our in-house creative team or from independent writers seeking a trusted publishing partner.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-secondary/5 rounded-[2rem] -rotate-3" />
              <img 
                src="/assets/images/input_file_5.jpeg" 
                alt="Library" 
                className="relative rounded-[2rem] shadow-2xl h-[600px] w-full object-cover"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-10 rounded-2xl shadow-xl border border-primary/5 hidden md:block">
                <p className="text-4xl font-serif italic text-primary">Original</p>
                <p className="text-xs uppercase tracking-widest text-secondary font-bold mt-2">Literary Works</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-serif italic mb-8">Professional Excellence in Every Page</h2>
            <p className="text-white/60 font-light leading-relaxed">
              With a blend of creative excellence and modern publishing practices, Deepam Kesari Publishing House offers end-to-end publishing support — from manuscript development and editing to design, printing, ISBN, and distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
              >
                <div className="text-secondary mb-6 group-hover:scale-110 transition-transform">{value.icon}</div>
                <h3 className="text-xl font-serif italic mb-4">{value.title}</h3>
                <p className="text-sm text-white/50 font-light leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Manifesto */}
      <section className="py-32 bg-white flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Globe className="text-secondary/20 mx-auto mb-10" size={64} />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8 text-2xl md:text-3xl font-serif text-primary italic leading-relaxed"
          >
            <p>
              "Deepam Kesari Publishing House is an independent and professional publishing platform dedicated to creating and delivering original, meaningful literature. Rooted in culture, emotion, and social awareness, we strive to produce work that reflects integrity, purpose, and a profound respect for the power of words."
            </p>
            <p className="text-primary/60">
              "We believe in the transformative impact of literature—not only as a source of entertainment but as a medium for education, reflection, and social engagement."
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

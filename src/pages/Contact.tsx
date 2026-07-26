import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Globe, Clock, Send } from 'lucide-react';
import { useState, FormEvent } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else if (result.errors) {
        setErrors(result.errors);
      } else {
        setErrors([result.message || 'Failed to send message']);
      }
    } catch (err) {
      setErrors(['Something went wrong. Please try again later.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg min-h-screen">
      {/* Header */}
      <section className="py-24 bg-primary text-white text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-secondary text-[10px] uppercase tracking-[0.3em] font-bold mb-4">Connect With Us</h2>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif italic mb-6">Contact Deepam Kesari</h1>
          <p className="text-white/60 font-light leading-relaxed">
            Whether you are a reader, an aspiring author, or a potential partner, we value every conversation. Reach out to us through any of the channels below.
          </p>
        </motion.div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 md:p-16 shadow-xl relative mt-[-100px] z-20"
            >
              {submitted ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send size={32} />
                  </div>
                  <h3 className="text-2xl font-serif text-primary mb-4">Message Sent</h3>
                  <p className="text-primary/60 mb-8">Thank you for your message. Our team will get back to you within 48 hours.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-secondary font-bold underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {errors.length > 0 && (
                    <div className="bg-red-50 text-red-500 p-4 text-xs font-bold uppercase tracking-widest border border-red-100">
                      <ul className="list-disc list-inside space-y-1 text-left">
                        {errors.map((err, i) => <li key={i}>{err}</li>)}
                      </ul>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-primary/40 px-1">Full Name</label>
                      <input 
                        name="name"
                        type="text" 
                        placeholder="John Doe" 
                        className="w-full bg-bg border border-primary/5 rounded-none py-4 px-6 text-sm focus:outline-none focus:border-secondary transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-primary/40 px-1">Email Address</label>
                      <input 
                        name="email"
                        type="email" 
                        placeholder="john@example.com" 
                        className="w-full bg-bg border border-primary/5 rounded-none py-4 px-6 text-sm focus:outline-none focus:border-secondary transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-primary/40 px-1">Subject</label>
                    <input 
                      name="subject"
                      type="text" 
                      placeholder="General Inquiry" 
                      className="w-full bg-bg border border-primary/5 rounded-none py-4 px-6 text-sm focus:outline-none focus:border-secondary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-primary/40 px-1">Message</label>
                    <textarea 
                      name="message"
                      rows={6} 
                      placeholder="How can we help you?" 
                      className="w-full bg-bg border border-primary/5 rounded-none py-4 px-6 text-sm focus:outline-none focus:border-secondary transition-all resize-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-5 font-bold uppercase tracking-[0.2em] text-xs hover:bg-secondary hover:text-primary transition-all shadow-lg disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Info and Map */}
            <div className="space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-serif italic text-primary">Headquarters</h3>
                  <a
                    href="https://www.google.com/maps?q=5%2FGokul%20Complex%2C%20Bayad%2C%20Aravalli-383325%2C%20Gujarat%2C%20India"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start space-x-3 text-sm text-primary/60 transition-colors hover:text-secondary"
                  >
                    <MapPin size={18} className="text-secondary shrink-0 mt-0.5" />
                    <span>5/Gokul Complex, Bayad, Aravalli<br />Gujarat, India - 383325</span>
                  </a>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-serif italic text-primary">Business Hours</h3>
                  <div className="flex items-start space-x-3 text-sm text-primary/60">
                    <Clock size={18} className="text-secondary shrink-0 mt-0.5" />
                    <p>Mon - Fri: 10:00 AM - 6:00 PM<br />Sat/Sun: 11:00 AM - 3:00 PM</p>
                  </div>
                </div>
                <div className="space-y-5">
                  <h3 className="text-lg font-serif italic text-primary">Contact Info</h3>
                  <div className="flex items-center space-x-3 text-sm text-primary/60">
                    <Phone size={18} className="text-secondary shrink-0" />
                    <p>+91 9664959238</p>
                  </div>
                  <a
                    href="mailto:deepamkesari.publishinghouse@gmail.com?subject=Inquiry%20from%20Deepam%20Kesari%20Website"
                    className="flex items-center space-x-3 text-sm text-primary/60 transition-colors hover:text-secondary"
                  >
                    <Mail size={18} className="text-secondary shrink-0" />
                    <span>deepamkesari.publishinghouse@gmail.com</span>
                  </a>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-serif italic text-primary">Global Reach</h3>
                  <div className="flex items-center space-x-3 text-sm text-primary/60">
                    <Globe size={18} className="text-secondary shrink-0" />
                    <p>Shipping to 20+ Countries</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-white p-4 shadow-xl border border-primary/5 aspect-video overflow-hidden group">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14665.654084880409!2d73.21162977980116!3d23.228034633014175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e09d18a4a3819%3A0xcb608b1898306068!2sBayad%2C%20Gujarat%20383325%2C%20India!5e0!3m2!1sen!2sus!4v1778688320180!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy"
                  className="grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { type ChangeEvent, type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MessageCircle, MapPin, Phone } from 'lucide-react';
import Logo from './Logo';

const CONTACT_EMAIL = 'deepamkesari.publishinghouse@gmail.com';
const CONTACT_PHONE = '+91 9664959238';
const CONTACT_PHONE_URL = 'tel:+919664959238';
const CONTACT_MAP_URL = 'https://www.google.com/maps?q=5%2FGokul%20Complex%2C%20Bayad%2C%20Aravalli-383325%2C%20Gujarat%2C%20India';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubscribe = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
        if (result.errors) setErrors(result.errors);
      }
    } catch (err) {
      setStatus('error');
      setErrors(['Network error. Please try again.']);
    }
  };

  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(135deg,#0d0d0d_0%,#181818_50%,#111111_100%)] pb-8 pt-16 text-white sm:pt-20 sm:pb-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,169,106,0.12),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_15%)]" />
      <div className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-secondary/5 blur-3xl" />
      <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-[1.1fr_0.8fr_0.9fr_1.1fr]">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.2)] backdrop-blur-sm sm:p-6">
            <Link to="/" className="inline-block">
              <Logo variant="light" size="lg" showImage={false} />
            </Link>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-gradient-to-r from-secondary/15 to-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-secondary shadow-inner shadow-secondary/10">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              Since 2025
            </div>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/65 sm:text-[15px]">
              We publish stories, ideas, and knowledge that stay with readers long after the last page.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {[
                { href: 'https://wa.me/919664959238', icon: MessageCircle, label: 'WhatsApp' },
                { href: '#', icon: Facebook, label: 'Facebook' },
                { href: 'https://www.instagram.com/deepamkesari_publishinghouse?igsh=a2JybXcxdDhrOTY0', icon: Instagram, label: 'Instagram' },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/50 hover:bg-secondary/10 hover:text-secondary"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.2)] backdrop-blur-sm sm:p-6">
            <h3 className="mb-4 text-center text-base font-semibold text-secondary sm:text-left">Quick Links</h3>
            <ul className="flex flex-col items-center space-y-3 text-center sm:items-start sm:text-left">
              {[
                ['Home', '/'],
                ['Books', '/books'],
                ['Authors', '/authors'],
                ['Gallery', '/gallery'],
                ['About Us', '/about'],
                ['Contact', '/contact'],
              ].map(([label, path]) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="group inline-flex items-center justify-center text-sm text-white/65 transition-colors hover:text-secondary"
                  >
                    <span className="hidden" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.2)] backdrop-blur-sm sm:p-6">
            <h3 className="mb-4 text-center text-base font-semibold text-secondary sm:text-left">Contact</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={CONTACT_MAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-3 text-sm text-white/65 transition-colors hover:text-secondary"
                >
                  <span className="text-secondary">
                    <MapPin size={16} />
                  </span>
                  <span className="break-words whitespace-normal">5/Gokul Complex, Bayad, Aravalli-383325, Gujarat, India</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/65">
                <a href={CONTACT_PHONE_URL} className="text-secondary">
                  <Phone size={16} />
                </a>
                <span className="break-words whitespace-normal">{CONTACT_PHONE}</span>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Inquiry%20from%20Deepam%20Kesari%20Website`}
                  className="inline-flex items-start gap-3 text-sm text-white/65 transition-colors hover:text-secondary"
                >
                  <span className="text-secondary">
                    <Mail size={16} />
                  </span>
                  <span className="break-words whitespace-normal">{CONTACT_EMAIL}</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-[1.5rem] border border-secondary/20 bg-gradient-to-br from-secondary/10 via-white/5 to-white/5 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.2)] backdrop-blur-sm sm:p-6">
            <h3 className="mb-3 text-center text-base font-semibold text-secondary sm:text-left">Newsletter</h3>
            <p className="mb-5 text-sm leading-6 text-white/65 sm:text-[15px]">
              Subscribe for new releases, author events, and literary highlights.
            </p>
            {status === 'success' ? (
              <div className="rounded-2xl bg-secondary/10 p-4 text-sm text-secondary">
                Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-secondary focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full rounded-2xl bg-secondary px-5 py-3 text-sm font-semibold text-primary transition hover:bg-secondary/90 disabled:opacity-50"
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
                {status === 'error' && (
                  <div className="space-y-1">
                    {errors.length > 0 ? (
                      errors.map((err, i) => <p key={i} className="text-xs text-red-400">{err}</p>)
                    ) : (
                      <p className="text-xs text-red-400">Something went wrong. Please try again.</p>
                    )}
                  </div>
                )}
              </form>
            )}
          </div>
        </div>

        <div className="mt-2 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-center md:flex-row md:text-left">
          <p className="text-[11px] text-white/40">
            © {currentYear} Deepam Kesari Publishing House. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-[11px] text-white/40 sm:gap-6">
            <a href="#" className="transition hover:text-white">Privacy Policy</a>
            <a href="#" className="transition hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
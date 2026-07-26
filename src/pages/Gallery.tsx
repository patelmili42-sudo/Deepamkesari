import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CalendarDays, Camera, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EventItem {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
  description: string;
  category?: string;
  galleryImages?: string[];
  organizer?: string;
  attendees?: number;
}

export default function Gallery() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        setEvents(data || []);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const categories = ['All', ...new Set(events.map((event: EventItem) => event.category || 'Event'))];
  const cityCount = new Set(
    events.map((event: EventItem) => event.location.trim())
  ).size;

  const totalAttendees = events.reduce((sum, e) => sum + (e.attendees || 0), 0);

  const filteredEvents = selectedCategory === 'All'
    ? events
    : events.filter((event: EventItem) => (event.category || 'Event') === selectedCategory);

  const allGalleryImages = events.flatMap((event: EventItem) => event.galleryImages || [event.image]);

  return (
    <div className="min-h-screen bg-bg">
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            ✕
          </button>
          <img
            src={selectedImage}
            alt="Selected gallery item"
            className="max-h-[90vh] max-w-6xl rounded-2xl object-contain"
            onClick={(e: any) => e.stopPropagation()}
          />
        </div>
      )}

      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-[#1c1c1c] to-[#3d3120] px-4 pb-20 pt-16 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(200,169,106,0.18),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_12%)]" />
        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-[10px] uppercase tracking-[0.38em] text-secondary">
            <Camera size={14} />
            Gallery & Events
          </div>
          <h1 className="text-4xl font-serif italic md:text-6xl">Moments That Inspire</h1>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-white/65 md:text-base">
            Explore our recent events, book launches, and community gatherings that bring readers and writers together.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.28em] text-primary/40">Events</p>
            <h3 className="mt-2 text-3xl font-semibold text-primary">{events.length}</h3>
          </div>
          <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.28em] text-primary/40">Cities</p>
            <h3 className="mt-2 text-3xl font-semibold text-primary">{cityCount}</h3>
          </div>
          <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.28em] text-primary/40">Gallery</p>
            <h3 className="mt-2 text-3xl font-semibold text-primary">{events.length}</h3>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-3">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                selectedCategory === category
                  ? 'bg-secondary text-primary'
                  : 'bg-white text-primary/65 hover:bg-secondary/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-secondary">Featured Events</p>
            <h2 className="mt-2 text-3xl font-serif text-primary">Upcoming & Recent Celebrations</h2>
          </div>
        </div>
        {loading ? (
          <div className="rounded-3xl bg-white p-10 text-center text-primary/50">Loading events...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center text-primary/50">
            No events available right now.
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {filteredEvents.map((event, index) => (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group overflow-hidden rounded-3xl bg-white shadow-sm"
              >
                <div className="overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-64 w-full cursor-pointer object-cover transition duration-500 group-hover:scale-105"
                    onClick={() => setSelectedImage(event.image)}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-primary/40">
                    <CalendarDays size={14} className="text-secondary" />
                    {event.date}
                  </div>
                  <h3 className="mt-3 text-2xl font-serif text-primary">{event.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-primary/65">{event.description}</p>
                  <div className="mt-4 flex flex-col gap-2 text-sm text-primary/60">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-secondary" />
                      <span>{event.location}</span>
                    </div>
                    {event.organizer && (
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-secondary" />
                        <span>Organized by {event.organizer}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-secondary" />
                      <span>{event.attendees ? `${event.attendees} attendees` : 'Details on attendees coming soon'}</span>
                    </div>
                  </div>
                  <Link
                    to={`/events/${event.id}`}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-secondary hover:text-primary"
                  >
                    View Event Details <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-secondary">Photo Gallery</p>
            <h2 className="mt-2 text-3xl font-serif text-primary">A Glimpse of Our World</h2>
          </div>
          <Link to="/contact" className="text-sm font-semibold text-primary hover:text-secondary">
            Plan an Event
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.length === 0 ? (
            <div className="col-span-full rounded-3xl bg-white p-10 text-center text-primary/50">
              No gallery images available yet.
            </div>
          ) : (
            allGalleryImages.map((image, index) => (
              <motion.div
                key={`${image}-${index}`}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group overflow-hidden rounded-3xl bg-white shadow-sm"
              >
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="h-80 w-full cursor-pointer object-cover transition duration-500 group-hover:scale-105"
                  onClick={() => setSelectedImage(image)}
                />
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

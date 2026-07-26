import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react';

interface EventItem {
  id: string | number;
  title: string;
  date: string;
  location: string;
  image: string;
  description: string;
  details?: string;
  category?: string;
  galleryImages?: string[];
}

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error('Failed to fetch event details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg px-4 py-24 text-center text-primary/40">
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-bg px-4 py-24 text-center">
        <p className="text-primary/50">Event not found.</p>
        <Link to="/gallery" className="mt-4 inline-block text-secondary">Back to gallery</Link>
      </div>
    );
  }

  const galleryImages = event.galleryImages?.length ? event.galleryImages : [event.image];

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
            alt="Selected event image"
            className="max-h-[90vh] max-w-6xl rounded-2xl object-contain"
            onClick={(e: any) => e.stopPropagation()}
          />
        </div>
      )}

      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-[#1c1c1c] to-[#3d3120] px-4 pb-16 pt-16 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(200,169,106,0.18),transparent_18%)]" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <Link to="/gallery" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-secondary">
            <ArrowLeft size={16} />
            Back to Gallery
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
              <img
                src={event.image}
                alt={event.title}
                className="h-[480px] w-full cursor-pointer object-cover"
                onClick={() => setSelectedImage(event.image)}
              />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {galleryImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className="overflow-hidden rounded-2xl border border-primary/5 bg-white"
                >
                  <img src={image} alt={`${event.title} image ${index + 1}`} className="h-24 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[10px] uppercase tracking-[0.32em] text-secondary">{event.category || 'Event'}</p>
            <h1 className="mt-3 text-4xl font-serif text-primary">{event.title}</h1>
            <div className="mt-6 space-y-3 text-sm text-primary/65">
              <div className="flex items-center gap-3">
                <CalendarDays size={16} className="text-secondary" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-secondary" />
                <span>{event.location}</span>
              </div>
            </div>
            <p className="mt-6 text-base leading-7 text-primary/75">{event.description}</p>
            {event.details && (
              <p className="mt-6 rounded-2xl border border-primary/5 bg-white p-5 text-sm leading-7 text-primary/70">
                {event.details}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

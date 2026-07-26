import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { AnimatePresence } from 'motion/react';

const Home = lazy(() => import('./pages/Home'));
const Books = lazy(() => import('./pages/Books'));
const BookDetails = lazy(() => import('./pages/BookDetails'));
const Authors = lazy(() => import('./pages/Authors'));
const About = lazy(() => import('./pages/About'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Gallery = lazy(() => import('./pages/Gallery'));
const EventDetails = lazy(() => import('./pages/EventDetails'));
const Contact = lazy(() => import('./pages/Contact'));
const AuthorProfile = lazy(() => import('./pages/AuthorProfile'));
const SubmitManuscript = lazy(() => import('./pages/SubmitManuscript'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen selection:bg-secondary selection:text-primary">
        <Navbar />
        <main className="flex-grow">
          <Suspense
            fallback={
              <div className="flex min-h-[40vh] items-center justify-center bg-bg font-serif italic text-primary/40">
                Loading page...
              </div>
            }
          >
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/books" element={<Books />} />
                <Route path="/books/:id" element={<BookDetails />} />
                <Route path="/authors" element={<Authors />} />
                <Route path="/authors/:id" element={<AuthorProfile />} />
                <Route path="/about" element={<About />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/submit-manuscript" element={<SubmitManuscript />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

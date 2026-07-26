import express from 'express';
import { createServer as createViteServer } from 'vite';
import mysql from 'mysql2/promise';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: "https://deepamkesari.onrender.com",
  credentials: true
}));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));
app.use('/assets', express.static(path.join(process.cwd(), 'public/assets')));
app.use('/public', express.static(path.join(process.cwd(), 'public')));
app.use('/images', express.static(path.join(process.cwd(), 'images')));

// General Fallback for any image in the root if not found elsewhere
app.get('/:file.jpeg', (req, res, next) => {
  const filePath = path.join(process.cwd(), req.params.file + '.jpeg');
  res.sendFile(filePath, (err) => {
    if (err) next();
  });
});
app.get('/:file.jpg', (req, res, next) => {
  const filePath = path.join(process.cwd(), req.params.file + '.jpg');
  res.sendFile(filePath, (err) => {
    if (err) next();
  });
});
app.get('/:file.png', (req, res, next) => {
  const filePath = path.join(process.cwd(), req.params.file + '.png');
  res.sendFile(filePath, (err) => {
    if (err) next();
  });
});
app.get('/:file.webp', (req, res, next) => {
  const filePath = path.join(process.cwd(), req.params.file + '.webp');
  res.sendFile(filePath, (err) => {
    if (err) next();
  });
});

// Database connection helper (Kept for potential futura SQL usage)
let db: mysql.Connection | null = null;
const USE_MYSQL = process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME;

async function getDB() {
  if (!USE_MYSQL) return null;
  if (!db) {
    try {
      db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER || '',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT),
        ssl: {
          rejectUnauthorized: false
        },
        connectTimeout: 30000
      });
      console.log('Connected to MySQL');
    } catch (err: any) {
      console.warn('MySQL connection failed, using Demo Mode.', err.message);
      return null;
    }
  }
  return db;
}

// Load Demo Data
function normalizeReview(review: any) {
  const userName = typeof review?.userName === 'string' && review.userName.trim()
    ? review.userName.trim()
    : (typeof review?.user_name === 'string' && review.user_name.trim()
      ? review.user_name.trim()
      : 'Anonymous Reader');

  const comment = typeof review?.comment === 'string'
    ? review.comment
    : '';

  return {
    id: review?.id,
    bookId: review?.bookId ?? review?.book_id,
    userName,
    rating: Number(review?.rating ?? 0),
    comment,
    createdAt: review?.createdAt ?? review?.created_at ?? new Date().toISOString()
  };
}

// --- DATA ROUTES ---
app.get('/api/books', async (req, res) => {
  const conn = await getDB();
  if (conn) {
    try {
      const [rows]: any = await conn.execute(`
        SELECT b.*, a.name as authorName 
        FROM books b 
        LEFT JOIN authors a ON b.author_id = a.id
      `);
      return res.json(rows.map((b: any) => ({
        id: b.id,
        title: b.title,
        authorId: b.author_id,
        authorName: b.authorName,
        coverImage: b.cover_image,
        description: b.description,
        isbn: b.isbn,
        amazonLink: b.amazon_link,
        whatsappLink: b.whatsapp_link,
        category: b.category,
        language: b.language,
        featured: b.featured === 1
      })));
    } catch (err: any) {
      console.error('SQL Error, falling back to Demo JSON:', err.message);
    }
  }
  
  res.json([]);
});

app.get('/api/authors', async (req, res) => {
  const conn = await getDB();
  if (conn) {
    try {
      const [rows]: any = await conn.execute('SELECT * FROM authors');
      const authors = rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        photo: row.photo,
        bio: row.bio,
        role: row.role,
        academicPedigree: row.academic_pedigree,
        creativeFocus: row.creative_focus,
        performingArts: row.performing_arts,
        literaryVision: row.literary_vision
      }));
      return res.json(authors);
    } catch (err) {
      console.error('SQL Error, falling back to Demo JSON');
    }
  }
  
  res.status(404).json({ message: 'Book not found' });
});

app.get('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  const conn = await getDB();
  
  if (conn) {
    try {
      const [rows]: any = await conn.execute(`
        SELECT b.*, a.name as authorName 
        FROM books b 
        LEFT JOIN authors a ON b.author_id = a.id
        WHERE b.id = ?
      `, [id]);
      
      if (rows.length > 0) {
        const b = rows[0];
        return res.json({
          id: b.id,
          title: b.title,
          authorId: b.author_id,
          authorName: b.authorName,
          coverImage: b.cover_image,
          description: b.description,
          isbn: b.isbn,
          amazonLink: b.amazon_link,
          whatsappLink: b.whatsapp_link,
          category: b.category,
          language: b.language,
          featured: b.featured === 1
        });
      }
    } catch (err) {
      console.error('SQL Error, falling back to Demo JSON');
    }
  }

  const data = await getDemoData();
  const book = data.books.find((b: any) => b.id.toString() === id);
  return book ? res.json(book) : res.status(404).json({ message: 'Book not found' });
});

const demoContacts: any[] = [];
const demoReviews: any[] = [];
const demoSubscribers: any[] = [];
const demoManuscripts: any[] = [];

app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  
  // Server-side validation
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, errors: ['Please provide a valid email address.'] });
  }

  const conn = await getDB();
  
  try {
    if (conn) {
      await conn.execute(
        'INSERT INTO subscribers (email) VALUES (?)',
        [email]
      );
    } else {
      if (!demoSubscribers.find(s => s.email === email)) {
        demoSubscribers.push({ id: Date.now(), email, subscribedAt: new Date() });
      }
    }
    res.json({ success: true });
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.json({ success: true, message: 'Already subscribed' });
    }
    res.status(400).json({ message: err.message });
  }
});

// --- MANUSCRIPT ROUTES ---
app.post('/api/manuscripts', async (req, res) => {
  const { authorName, email, title, genre, description } = req.body;
  
  // Server-side validation
  const errors: string[] = [];
  if (!authorName || authorName.trim().length < 2) errors.push('Author name must be at least 2 characters.');
  if (!email || !email.includes('@')) errors.push('A valid email address is required.');
  if (!title || title.trim().length < 2) errors.push('Manuscript title is required.');
  if (!genre) errors.push('Please select a genre.');
  if (!description || description.trim().length < 20) errors.push('Please provide a description of at least 20 characters.');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const conn = await getDB();
  
  try {
    if (conn) {
      await conn.execute(
        'INSERT INTO manuscripts (author_name, email, title, genre, description) VALUES (?, ?, ?, ?, ?)',
        [authorName, email, title, genre, description]
      );
    } else {
      demoManuscripts.push({ 
        id: Date.now(), 
        authorName, 
        email, 
        title, 
        genre, 
        description, 
        status: 'pending', 
        createdAt: new Date() 
      });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/manuscripts', async (req, res) => {
  const conn = await getDB();
  if (conn) {
    try {
      const [rows]: any = await conn.execute('SELECT * FROM manuscripts ORDER BY created_at DESC');
      return res.json(rows.map((m: any) => ({
        id: m.id,
        authorName: m.author_name,
        email: m.email,
        title: m.title,
        genre: m.genre,
        description: m.description,
        status: m.status,
        createdAt: m.created_at
      })));
    } catch (err) {
      console.error('SQL Error fetching manuscripts');
    }
  }
  res.json(demoManuscripts);
});

app.delete('/api/manuscripts/:id', async (req, res) => {
  const { id } = req.params;
  const conn = await getDB();
  try {
    if (conn) {
      await conn.execute('DELETE FROM manuscripts WHERE id = ?', [id]);
    } else {
      const index = demoManuscripts.findIndex(m => m.id.toString() === id);
      if (index > -1) demoManuscripts.splice(index, 1);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/events', async (req, res) => {
  const conn = await getDB();

  if (conn) {
    try {
      const [rows]: any = await conn.execute('SELECT * FROM events ORDER BY event_date DESC');
      const events = await Promise.all(rows.map(async (event: any) => {
        const [galleryRows]: any = await conn.execute(
          'SELECT image FROM event_gallery_images WHERE event_id = ? ORDER BY id ASC',
          [event.id]
        );
        const galleryImages = [event.image, ...galleryRows.map((g: any) => g.image)].filter(Boolean);

        return {
          id: event.id,
          title: event.title,
          date: event.event_date,
          location: event.location,
          image: event.image,
          description: event.description,
          details: event.details,
          category: event.category,
          galleryImages
        };
      }));
      return res.json(events);
    } catch (err) {
      console.error('SQL Error fetching events, falling back to Demo JSON');
    }
  }

  res.json([]);
});

app.get('/api/events/:id', async (req, res) => {
  const { id } = req.params;
  const conn = await getDB();

  if (conn) {
    try {
      const [rows]: any = await conn.execute('SELECT * FROM events WHERE id = ?', [id]);
      if (rows.length > 0) {
        const event = rows[0];
        const [galleryRows]: any = await conn.execute(
          'SELECT image FROM event_gallery_images WHERE event_id = ? ORDER BY id ASC',
          [event.id]
        );
        const galleryImages = [event.image, ...galleryRows.map((g: any) => g.image)].filter(Boolean);

        return res.json({
          id: event.id,
          title: event.title,
          date: event.event_date,
          location: event.location,
          image: event.image,
          description: event.description,
          details: event.details,
          category: event.category,
          galleryImages
        });
      }
    } catch (err) {
      console.error('SQL Error fetching event details, falling back to Demo JSON');
    }
  }

  return res.status(404).json({ message: 'Event not found' });
});

app.get('/api/reviews/:bookId', async (req, res) => {
  const { bookId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const offset = (page - 1) * limit;
  const conn = await getDB();
  
  if (conn) {
    try {
      const [countRows]: any = await conn.execute('SELECT COUNT(*) as total FROM reviews WHERE book_id = ?', [bookId]);
      const total = Number(countRows[0]?.total || 0);
      const [rows]: any = await conn.execute(
        'SELECT * FROM reviews WHERE book_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [bookId, limit, offset]
      );
      const reviews = rows.map(normalizeReview);

      if (req.query.page) {
        return res.json({ reviews, total });
      }

      return res.json(reviews);
    } catch (err) {
      console.error('SQL Error fetching reviews');
    }
  }

  const allReviews = demoReviews
    .filter((r: any) => String(r.bookId ?? r.book_id) === String(bookId))
    .map(normalizeReview);
  if (req.query.page) {
    const pagedReviews = allReviews.slice(offset, offset + limit);
    return res.json({ reviews: pagedReviews, total: allReviews.length });
  }
  res.json(allReviews);
});

app.post('/api/reviews', async (req, res) => {
  const { bookId, userName, rating, comment } = req.body;
  
  // Server-side validation
  const errors: string[] = [];
  if (!bookId) errors.push('Book ID is required.');
  if (!userName || userName.trim().length < 2) errors.push('Your name must be at least 2 characters.');
  if (!rating || rating < 1 || rating > 5) errors.push('Please provide a rating between 1 and 5 stars.');
  if (!comment || comment.trim().length < 5) errors.push('Review comment must be at least 5 characters.');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const conn = await getDB();
  
  try {
    if (conn) {
      await conn.execute(
        'INSERT INTO reviews (book_id, user_name, rating, comment) VALUES (?, ?, ?, ?)',
        [bookId, userName, rating, comment]
      );
    } else {
      demoReviews.push({ id: Date.now(), bookId, userName, rating, comment, createdAt: new Date() });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/reviews', async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const offset = (page - 1) * limit;
  const conn = await getDB();

  if (conn) {
    try {
      const [countRows]: any = await conn.execute('SELECT COUNT(*) as total, AVG(rating) as avgRating FROM reviews');
      const total = Number(countRows[0]?.total || 0);
      const averageRating = Number(countRows[0]?.avgRating || 0).toFixed(1);
      const [uniqueRows]: any = await conn.execute('SELECT COUNT(DISTINCT user_name) as uniqueReaders FROM reviews');
      const uniqueReaders = Number(uniqueRows[0]?.uniqueReaders || 0);

      if (req.query.page) {
        const [rows]: any = await conn.execute(
          'SELECT r.*, b.title as bookTitle FROM reviews r LEFT JOIN books b ON r.book_id = b.id ORDER BY r.created_at DESC LIMIT ? OFFSET ?',
          [limit, offset]
        );
        const reviews = rows.map((r: any) => ({
          ...normalizeReview(r),
          bookTitle: r.bookTitle
        }));
        return res.json({ reviews, total, averageRating, uniqueReaders });
      }

      const [rows]: any = await conn.execute('SELECT r.*, b.title as bookTitle FROM reviews r LEFT JOIN books b ON r.book_id = b.id ORDER BY r.created_at DESC');
      return res.json(rows.map((r: any) => ({
        ...normalizeReview(r),
        bookTitle: r.bookTitle
      })));
    } catch (err) {
      console.error('SQL Error fetching all reviews');
    }
  }

  const allReviews = demoReviews.map(normalizeReview);
  if (req.query.page) {
    const reviews = allReviews.slice(offset, offset + limit);
    const averageRating = allReviews.length ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1) : '0.0';
    const uniqueReaders = new Set(allReviews.map((r) => r.userName)).size;
    return res.json({ reviews, total: allReviews.length, averageRating, uniqueReaders });
  }
  res.json(allReviews);
});

app.delete('/api/reviews/:id', async (req, res) => {
  const { id } = req.params;
  const conn = await getDB();
  try {
    if (conn) {
      await conn.execute('DELETE FROM reviews WHERE id = ?', [id]);
    } else {
      const index = demoReviews.findIndex(r => r.id.toString() === id);
      if (index > -1) demoReviews.splice(index, 1);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Server-side validation
  const errors: string[] = [];
  if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters.');
  if (!email || !email.includes('@')) errors.push('A valid email address is required.');
  if (!message || message.trim().length < 10) errors.push('Message must be at least 10 characters.');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const conn = await getDB();
  
  try {
    if (conn) {
      await conn.execute(
        'INSERT INTO contact_requests (name, email, subject, message) VALUES (?, ?, ?, ?)',
        [name, email, subject, message]
      );
    } else {
      demoContacts.push({ id: Date.now(), name, email, subject, message, createdAt: new Date() });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

import express from 'express';
import { createServer as createViteServer } from 'vite';
import mysql from 'mysql2/promise';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import { authorSlug, bookSlug, legacyBookSlug } from './src/lib/utils';

dotenv.config();

const app = express();
const PORT = 3000;
const SITE_URL = (process.env.PUBLIC_SITE_URL || 'https://deepamkesari.onrender.com').replace(/\/+$/, '');
const PUBLISHER_NAME = 'Deepam Kesari Publishing House';

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function seoJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function absoluteUrl(value: unknown): string | undefined {
  if (!value) return undefined;
  try {
    return new URL(String(value), `${SITE_URL}/`).href;
  } catch {
    return undefined;
  }
}

function escapeXml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: PUBLISHER_NAME,
    alternateName: 'Deepam Kesari',
    url: `${SITE_URL}/`,
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: PUBLISHER_NAME,
    alternateName: ['Deepam Kesari', 'દીપમ કેસરી', 'दीपम केसरी'],
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/assets/images/logo.png`,
  };
}

function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

async function getSeoBook(slug: string) {
  const conn = await getDB();
  if (!conn) return null;
  const [rows]: any = await conn.execute(`
    SELECT b.*, a.name as authorName
    FROM books b
    LEFT JOIN authors a ON b.author_id = a.id
  `);
  const row = rows.find((book: any) =>
    String(book.id) === slug || bookSlug(book.title) === slug || legacyBookSlug(book.title) === slug
  );
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    authorId: row.author_id,
    authorName: row.authorName,
    coverImage: row.cover_image,
    description: row.description || '',
    isbn: row.isbn || '',
    category: row.category || '',
    language: row.language || '',
  };
}

async function getSeoAuthor(slug: string) {
  const conn = await getDB();
  if (!conn) return null;
  const [rows]: any = await conn.execute('SELECT * FROM authors');
  const row = rows.find((author: any) => String(author.id) === slug || bookSlug(author.name) === slug);
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    photo: row.photo,
    bio: row.bio || '',
    role: row.role || 'Author',
  };
}

async function renderSeoDocument(requestPath: string, metadata: {
  title: string;
  description: string;
  image?: string;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
  text: string;
}) {
  const templatePath = path.join(process.cwd(), 'dist', 'index.html');
  let html = await fs.readFile(templatePath, 'utf8');
  const canonical = `${SITE_URL}${requestPath}`;
  const imageUrl = absoluteUrl(metadata.image);
  const image = imageUrl ? `<meta property="og:image" content="${escapeHtml(imageUrl)}" />` : '';
  const detailSchemas = metadata.schema
    ? (Array.isArray(metadata.schema) ? metadata.schema : [metadata.schema])
    : [];
  const schema = `<script type="application/ld+json">${seoJson({
    '@context': 'https://schema.org',
    '@graph': [websiteSchema(), organizationSchema(), ...detailSchemas],
  })}</script>`;
  const head = `
    <title>${escapeHtml(metadata.title)}</title>
    <meta name="description" content="${escapeHtml(metadata.description)}" />
    <meta name="robots" content="index,follow" />
    <link rel="canonical" href="${escapeHtml(canonical)}" />
    <meta property="og:title" content="${escapeHtml(metadata.title)}" />
    <meta property="og:description" content="${escapeHtml(metadata.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta property="og:site_name" content="${PUBLISHER_NAME}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(metadata.title)}" />
    <meta name="twitter:description" content="${escapeHtml(metadata.description)}" />
    ${image}
    ${schema}`;
  html = html
    .replace(/<title[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name=["'](?:description|robots|twitter:[^"']+)["'][^>]*\/?\s*>/gi, '')
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*\/?\s*>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*\/?\s*>/gi, '')
    .replace(/<script\s+type=["']application\/ld\+json["'][\s\S]*?<\/script>/gi, '')
    .replace('</head>', `${head}\n</head>`)
    .replace(/<div id="root">[\s\S]*?<\/div>/i, `<div id="root"><main><h1>${escapeHtml(metadata.text)}</h1><p>${escapeHtml(metadata.description)}</p></main></div>`);
  return html;
}

async function sendSeoRoute(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (process.env.NODE_ENV !== 'production') return next();
  try {
    if (req.path.startsWith('/books/')) {
      const book = await getSeoBook(req.params.slug);
      if (book) {
        const url = `${SITE_URL}/books/${bookSlug(book.title)}`;
        if (req.path !== `/books/${bookSlug(book.title)}`) return res.redirect(301, url);
        return res.send(await renderSeoDocument(`/books/${bookSlug(book.title)}`, {
          title: `${book.title} | ${book.authorName || 'Book'} | Deepam Kesari Publishing House`,
          description: `${book.title} by ${book.authorName || 'the author'}, published by Deepam Kesari Publishing House. ${book.description}`.slice(0, 158),
          image: book.coverImage,
          text: book.title,
          schema: [
            {
            '@type': 'Book',
            '@id': `${url}#book`,
            name: book.title,
            url,
            description: book.description,
            image: absoluteUrl(book.coverImage),
            isbn: book.isbn || undefined,
            inLanguage: book.language,
            genre: book.category,
            author: { '@type': 'Person', name: book.authorName || String(book.authorId) },
            publisher: { '@id': `${SITE_URL}/#organization` },
            },
            breadcrumbSchema([
              { name: PUBLISHER_NAME, path: '/' },
              { name: 'Books', path: '/books' },
              { name: book.title, path: `/books/${bookSlug(book.title)}` },
            ]),
          ],
        }));
      }
    }
    if (req.path.startsWith('/authors/')) {
      const author = await getSeoAuthor(req.params.slug);
      if (author) {
        const url = `${SITE_URL}/authors/${authorSlug(author.name)}`;
        if (req.path !== `/authors/${authorSlug(author.name)}`) return res.redirect(301, url);
        return res.send(await renderSeoDocument(`/authors/${bookSlug(author.name)}`, {
          title: `${author.name} | Author | Deepam Kesari Publishing House`,
          description: `${author.name} is a ${author.role.toLowerCase()} featured by Deepam Kesari Publishing House. ${author.bio}`.slice(0, 158),
          image: author.photo,
          text: author.name,
          schema: [
            {
            '@type': 'Person',
            '@id': `${url}#person`,
            name: author.name,
            url,
            image: absoluteUrl(author.photo),
            description: author.bio,
            jobTitle: author.role,
            worksFor: { '@id': `${SITE_URL}/#organization` },
            },
            breadcrumbSchema([
              { name: PUBLISHER_NAME, path: '/' },
              { name: 'Authors', path: '/authors' },
              { name: author.name, path: `/authors/${authorSlug(author.name)}` },
            ]),
          ],
        }));
      }
    }
  } catch (error) {
    console.error('SEO route rendering failed', error);
  }
  next();
}

// Middleware
app.use(express.json());
app.use(cors({
  origin: "https://deepamkesari.onrender.com",
  credentials: true
}));
app.use(cookieParser());
app.get('/books/:slug', sendSeoRoute);
app.get('/authors/:slug', sendSeoRoute);
app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
});
app.get('/sitemap.xml', async (_req, res) => {
  const conn = await getDB();
  const staticPaths = ['/', '/books', '/authors', '/gallery', '/about', '/contact'];
  let detailPaths: string[] = [];
  if (conn) {
    const [books]: any = await conn.execute('SELECT title FROM books');
    const [authors]: any = await conn.execute('SELECT name FROM authors');
    detailPaths = [
      ...books.map((book: any) => `/books/${bookSlug(book.title)}`),
      ...authors.map((author: any) => `/authors/${authorSlug(author.name)}`),
    ];
  } else {
    const demo = await getDemoData();
    detailPaths = [
      ...(Array.isArray(demo.books) ? demo.books : []).map((book: any) => `/books/${bookSlug(book.title)}`),
      ...(Array.isArray(demo.authors) ? demo.authors : []).map((author: any) => `/authors/${authorSlug(author.name)}`),
    ];
  }
  const urls = [...new Set([...staticPaths, ...detailPaths])]
    .map((url) => `<url><loc>${escapeXml(`${SITE_URL}${url}`)}</loc></url>`)
    .join('');
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
});
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

// Keep a pool instead of one long-lived connection. A single connection can be
// closed by the provider while the process is still running.
let db: mysql.Pool | null = null;
let dbInitialization: Promise<mysql.Pool | null> | null = null;
const USE_MYSQL = Boolean(
  process.env.DB_HOST &&
  process.env.DB_USER &&
  process.env.DB_PASSWORD &&
  process.env.DB_NAME
);

async function getDB(): Promise<mysql.Pool | null> {
  if (!USE_MYSQL) return null;

  if (db) return db;
  if (dbInitialization) return dbInitialization;

  dbInitialization = (async () => {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      ssl: {
        rejectUnauthorized: false
      },
      connectTimeout: 30000
    });

    try {
      const connection = await pool.getConnection();
      connection.release();
      db = pool;
      console.log('Connected to MySQL pool');
      return db;
    } catch (err: any) {
      await pool.end().catch(() => undefined);
      console.warn('MySQL connection failed, using Demo Mode.', err.message);
      return null;
    }
  })();

  try {
    return await dbInitialization;
  } finally {
    dbInitialization = null;
  }
}

// Load Demo Data
async function getDemoData() {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), 'src/data/demo.json'), 'utf8');
    return JSON.parse(raw);
  } catch {
    return { books: [], authors: [], reviews: [] };
  }
}

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
      let [rows]: any = await conn.execute(`
        SELECT b.*, a.name as authorName 
        FROM books b 
        LEFT JOIN authors a ON b.author_id = a.id
        WHERE b.id = ?
      `, [id]);

      if (rows.length === 0) {
        const [allRows]: any = await conn.execute(`
          SELECT b.*, a.name as authorName
          FROM books b
          LEFT JOIN authors a ON b.author_id = a.id
        `);
        rows = allRows.filter((book: any) =>
          String(bookSlug(book.title)) === id || legacyBookSlug(book.title) === id || book.title === id
        );
      }
      
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
  const book = data.books.find((b: any) => b.id.toString() === id || String(bookSlug(b.title)) === id || b.title === id);
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

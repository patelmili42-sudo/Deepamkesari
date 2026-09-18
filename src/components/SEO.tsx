import { useEffect } from 'react';
import { Author, Book } from '../types';
import { authorSlug, bookSlug } from '../lib/utils';

const SITE_URL = 'https://deepamkesari.onrender.com';
const SITE_HOME_URL = `${SITE_URL}/`;
const PUBLISHER_NAME = 'Deepam Kesari Publishing House';

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
}

function upsertJsonLd(id: string, value: unknown) {
  let element = document.head.querySelector<HTMLScriptElement>(`script[data-seo-id="${id}"]`);
  if (!element) {
    element = document.createElement('script');
    element.type = 'application/ld+json';
    element.dataset.seoId = id;
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(value);
}

function baseOrganization() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_HOME_URL}#organization`,
    name: PUBLISHER_NAME,
    alternateName: ['Deepam Kesari', 'દીપમ કેસરી', 'दीपम केसरी'],
    url: SITE_HOME_URL,
    logo: `${SITE_URL}/assets/images/logo.png`,
  };
}

function baseWebsite() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_HOME_URL}#website`,
    name: PUBLISHER_NAME,
    alternateName: 'Deepam Kesari',
    url: SITE_HOME_URL,
    publisher: { '@id': `${SITE_HOME_URL}#organization` },
  };
}

export function Seo({
  title,
  description,
  path,
  keywords,
  image,
  schema,
}: {
  title: string;
  description: string;
  path: string;
  keywords: string;
  image?: string;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
}) {
  useEffect(() => {
    const canonical = `${SITE_URL}${path}`;
    document.title = title;
    document.documentElement.lang = 'en';
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'keywords', keywords);
    upsertMeta('name', 'robots', 'index,follow');
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', schema && !Array.isArray(schema) && schema['@type'] === 'Book' ? 'book' : 'website');
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:site_name', PUBLISHER_NAME);
    upsertMeta('property', 'og:locale', 'en_IN');
    upsertMeta('property', 'og:locale:alternate', 'gu_IN');
    upsertMeta('property', 'og:locale:alternate', 'hi_IN');
    if (image) upsertMeta('property', 'og:image', image);
    upsertMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    if (image) upsertMeta('name', 'twitter:image', image);
    upsertLink('canonical', canonical);
    upsertJsonLd('page', {
      '@context': 'https://schema.org',
      '@graph': [baseWebsite(), baseOrganization(), ...(schema ? (Array.isArray(schema) ? schema : [schema]) : [])],
    });
  }, [description, image, keywords, path, schema, title]);

  return null;
}

export function bookSchema(book: Book) {
  const url = `${SITE_URL}/books/${bookSlug(book.title)}`;
  return {
    '@type': 'Book',
    '@id': `${url}#book`,
    name: book.title,
    url,
    description: book.description,
    image: book.coverImage,
    isbn: book.isbn || undefined,
    inLanguage: book.language,
    genre: book.category,
    author: {
      '@type': 'Person',
      name: book.authorName || String(book.authorId),
      url: `${SITE_URL}/authors/${authorSlug(book.authorName || String(book.authorId))}`,
    },
    publisher: { '@id': `${SITE_HOME_URL}#organization` },
  };
}

export function authorSchema(author: Author, books: Book[]) {
  const url = `${SITE_URL}/authors/${authorSlug(author.name)}`;
  return {
    '@type': 'Person',
    '@id': `${url}#person`,
    name: author.name,
    url,
    image: author.photo,
    description: author.bio,
    jobTitle: author.role,
    worksFor: { '@id': `${SITE_HOME_URL}#organization` },
    subjectOf: books.map((book) => ({
      '@type': 'Book',
      name: book.title,
      url: `${SITE_URL}/books/${bookSlug(book.title)}`,
    })),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
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

export { PUBLISHER_NAME, SITE_URL };

export interface Author {
  id: string;
  name: string;
  photo: string;
  bio: string;
  role: 'Author' | 'Translator' | 'Editor';
  featured?: boolean;
  academicPedigree?: string;
  creativeFocus?: string;
  performingArts?: string;
  literaryVision?: string;
}

export interface Book {
  id: string | number;
  title: string;
  authorId: string | number;
  authorName?: string;
  coverImage: string;
  galleryImages?: string[];
  description: string;
  isbn: string;
  amazonLink: string;
  whatsappLink: string;
  category: string;
  language: string;
  featured?: boolean;
  price?: number;
  createdAt: any;
}

export interface Review {
  id: string | number;
  bookId: string | number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export interface ContactRequest {
  id: string | number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: any;
}

export interface Manuscript {
  id: string | number;
  authorName: string;
  email: string;
  title: string;
  genre: string;
  description: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: any;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

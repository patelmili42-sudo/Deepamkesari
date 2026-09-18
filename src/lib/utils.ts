import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function transliteratedBookSlug(title: string): string {
  const indicMap: Record<string, string> = {
    અ: 'a', આ: 'aa', ઇ: 'i', ઈ: 'ee', ઉ: 'u', ઊ: 'oo', ઋ: 'ru', એ: 'e', ઐ: 'ai', ઓ: 'o', ઔ: 'au',
    ક: 'ka', ખ: 'kha', ગ: 'ga', ઘ: 'gha', ઙ: 'nga', ચ: 'cha', છ: 'chha', જ: 'ja', ઝ: 'jha', ઞ: 'nya',
    ટ: 'ta', ઠ: 'tha', ડ: 'da', ઢ: 'dha', ણ: 'na', ત: 'ta', થ: 'tha', દ: 'da', ધ: 'dha', ન: 'na',
    પ: 'pa', ફ: 'pha', બ: 'ba', ભ: 'bha', મ: 'ma', ય: 'ya', ર: 'ra', લ: 'la', વ: 'va', શ: 'sha', ષ: 'sha', સ: 'sa', હ: 'ha', ળ: 'la',
    'ा': 'a', 'ि': 'i', 'ी': 'i', 'ु': 'u', 'ू': 'u', 'ृ': 'ru', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ru', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
    'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'nga', 'च': 'cha', 'छ': 'chha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'nya',
    'ट': 'ta', 'ठ': 'tha', 'ड': 'da', 'ढ': 'dha', 'ण': 'na', 'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
    'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma', 'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va', 'श': 'sha', 'ष': 'sha', 'स': 'sa', 'ह': 'ha',
    'ા': 'a', 'િ': 'i', 'ી': 'i', 'ુ': 'u', 'ૂ': 'u', 'ૃ': 'ru', 'ે': 'e', 'ૈ': 'ai', 'ો': 'o', 'ૌ': 'au',
    'ં': 'n', 'ઁ': 'n', 'ઃ': 'h', '્': '', 'ं': 'n', 'ँ': 'n', 'ः': 'h', '्': '',
  };
  const transliterated = [...title.normalize('NFKD')].reduce<string>((result, character): string => {
    if (character === '્' || character === '्') return result.replace(/a$/, '');
    const mapped = indicMap[character];
    if (!mapped) return result + character;
    if (/^(aa|ee|oo|ai|au|i|u|ru|e|o)$/.test(mapped) && result.endsWith('a')) {
      return result.slice(0, -1) + mapped;
    }
    return result + mapped;
  }, '');

  return transliterated
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function bookSlug(title: string): string {
  const slug = transliteratedBookSlug(title);
  return slug === 'rasto-kari-javaanaa' ? 'rasto-kari-javana' : slug;
}

export function legacyBookSlug(title: string): string {
  return transliteratedBookSlug(title);
}

export function authorSlug(name: string): string {
  return bookSlug(name);
}

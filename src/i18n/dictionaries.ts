import type { Locale } from './config';
import hy, { type Dictionary } from './hy';
import ru from './ru';
import en from './en';

const dictionaries: Record<Locale, Dictionary> = { hy, ru, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? hy;
}

export type { Dictionary };

export const locales = ['hy', 'ru', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'hy';

export const localeNames: Record<Locale, string> = {
  hy: 'ՀԱՅ',
  ru: 'РУС',
  en: 'ENG',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

import { getSettings, plain } from './settings';
import { site } from './site';

export type Contacts = {
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  address: string;
  url: string;
};

/**
 * Контакты: сначала то, что вписано в админке (/admin/settings),
 * иначе — переменные окружения. Чтобы поменять телефон, деплой не нужен.
 */
export async function getContacts(): Promise<Contacts> {
  const settings = await getSettings();
  return {
    phone: plain(settings, 'contact_phone', site.phone),
    whatsapp: plain(settings, 'contact_whatsapp', site.whatsapp),
    email: plain(settings, 'contact_email', site.email),
    instagram: plain(settings, 'contact_instagram', site.instagram),
    address: plain(settings, 'contact_address', ''),
    url: site.url,
  };
}

export function waLink(whatsapp: string, text?: string) {
  const base = `https://wa.me/${whatsapp.replace(/\D/g, '')}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function telLink(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

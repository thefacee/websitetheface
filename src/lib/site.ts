export const site = {
  name: 'The Face',
  tagline: 'Sculpted Silence. Living Stone.',
  phone: process.env.NEXT_PUBLIC_PHONE || '+374 00 000 000',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '37400000000',
  email: process.env.NEXT_PUBLIC_EMAIL || 'hello@theface.am',
  instagram:
    process.env.NEXT_PUBLIC_INSTAGRAM || 'https://www.instagram.com/the.face_official',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
};

export function whatsappLink(text?: string) {
  const base = `https://wa.me/${site.whatsapp.replace(/\D/g, '')}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function formatPrice(price: number | null, currency: string | null) {
  if (price === null || price === undefined || Number.isNaN(price)) return null;
  const grouped = String(Math.round(price)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  if (currency === 'USD') return `$${grouped}`;
  if (currency === 'EUR') return `\u20AC${grouped}`;
  return `${grouped} \u058F`;
}

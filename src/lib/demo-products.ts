import type { Product } from './supabase/types';

/**
 * Shown only while Supabase is not connected yet, so the site is never empty
 * during local development. As soon as NEXT_PUBLIC_SUPABASE_URL is set,
 * real products from the database are used instead.
 *
 * Photos are the brand's own shots from /public/media.
 */
export const demoProducts: Product[] = [
  {
    id: 'demo-1',
    slug: 'face-table-travertine',
    name_hy: 'FACE TABLE · Տրավերտին',
    name_ru: 'FACE TABLE · Травертин',
    name_en: 'FACE TABLE · Travertine',
    description_hy:
      'Ձեռքով քանդակված դեմք՝ բնական տրավերտինից, կոփված ապակե մակերեսով։ ' +
      'Երեք չափս՝ 60×40×40, 70×50×45 և 80×60×50 սմ։ Յուրաքանչյուր քար ունի իր հյուսվածքը, ' +
      'ուստի երկու միանման սեղան գոյություն չունի։',
    description_ru:
      'Лицо, высеченное вручную из натурального травертина, с закалённой стеклянной столешницей. ' +
      'Три размера: 60×40×40, 70×50×45 и 80×60×50 см. У каждого камня своя текстура — ' +
      'двух одинаковых столов не бывает.',
    description_en:
      'A face carved by hand from natural travertine, finished with a tempered glass top. ' +
      'Three sizes: 60×40×40, 70×50×45 and 80×60×50 cm. Every block has its own grain, ' +
      'so no two tables are alike.',
    category: 'table',
    material: 'Travertine',
    dimensions: '60×40×40 / 70×50×45 / 80×60×50 cm',
    weight_kg: 95,
    price: 500000,
    currency: 'AMD',
    status: 'available',
    images: [
      '/media/face-table-2.png',
      '/media/gallery-1.png',
      '/media/gallery-3.png',
      '/media/carousel-1.png',
    ],
    is_featured: true,
    is_published: true,
    sort_order: 100,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    slug: 'face-table-black-tuff',
    name_hy: 'FACE TABLE · Սև տուֆ',
    name_ru: 'FACE TABLE · Чёрный туф',
    name_en: 'FACE TABLE · Black Tuff',
    description_hy:
      'Նույն դեմքը՝ հայկական սև տուֆից։ Ծակոտկեն, խորը մակերես, որը լույսը կլանում է ' +
      'տրավերտինի փոխարեն այն արտացոլելու։ Կլոր ապակի՝ 90 սմ։',
    description_ru:
      'То же лицо, но из армянского чёрного туфа. Пористая, глубокая поверхность, которая ' +
      'поглощает свет вместо того, чтобы отражать его. Круглое стекло 90 см.',
    description_en:
      'The same face in Armenian black tuff. A porous, deep surface that absorbs light ' +
      'instead of reflecting it. Round 90 cm glass top.',
    category: 'table',
    material: 'Black tuff',
    dimensions: '70 × 50 × 45 cm · ⌀90',
    weight_kg: 88,
    price: 589000,
    currency: 'AMD',
    status: 'available',
    images: ['/media/gallery-2.png', '/media/material-black-tuff.png'],
    is_featured: true,
    is_published: true,
    sort_order: 90,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    slug: 'face-table-round',
    name_hy: 'FACE TABLE · Կլոր',
    name_ru: 'FACE TABLE · Круглый',
    name_en: 'FACE TABLE · Round',
    description_hy:
      'Հանգիստ դեմք՝ ամբողջովին կլոր ապակու տակ։ Ամենաընդարձակ տարբերակը՝ ' +
      'հյուրասենյակի կենտրոնի համար։ Բարձրություն 42 սմ։',
    description_ru:
      'Спокойное лицо под полностью круглым стеклом. Самая просторная версия — ' +
      'для центра гостиной. Высота 42 см.',
    description_en:
      'A resting face beneath a fully round glass top. The most generous version, ' +
      'made for the middle of a living room. Height 42 cm.',
    category: 'table',
    material: 'Travertine',
    dimensions: '80 × 60 × 42 cm · ⌀100',
    weight_kg: 120,
    price: 750000,
    currency: 'AMD',
    status: 'made_to_order',
    images: ['/media/gallery-all-7.png', '/media/face-table-only.png'],
    is_featured: true,
    is_published: true,
    sort_order: 80,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-4',
    slug: 'quiet-head',
    name_hy: 'Լուռ Գլուխ',
    name_ru: 'Тихая Голова',
    name_en: 'Quiet Head',
    description_hy: 'Առանձին քանդակ՝ առանց ապակու։ Տրավերտին, 45 սմ բարձրություն։',
    description_ru: 'Отдельная скульптура без стекла. Травертин, высота 45 см.',
    description_en: 'A standalone sculpture, no glass. Travertine, 45 cm tall.',
    category: 'sculpture',
    material: 'Travertine',
    dimensions: '45 × 30 × 28 cm',
    weight_kg: 26,
    price: null,
    currency: 'AMD',
    status: 'made_to_order',
    images: ['/media/carousel-3.jpg', '/media/carousel-1.png'],
    is_featured: false,
    is_published: true,
    sort_order: 70,
    created_at: new Date().toISOString(),
  },
];

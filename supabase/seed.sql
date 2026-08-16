-- Стартовое наполнение каталога: 4 работы с вашими фото и ценами.
-- Выполнить один раз в Supabase → SQL Editor → New query → Run.
-- Дальше всё правится через админку; повторный запуск ничего не сломает.
--
-- Фото берутся из папки сайта /public/media. Когда загрузите свои снимки
-- через админку, пути заменятся на ссылки Supabase Storage автоматически.

insert into public.products
  (slug, name_hy, name_ru, name_en,
   description_hy, description_ru, description_en,
   category, material, dimensions, weight_kg, price, currency, status,
   images, is_featured, is_published, sort_order)
values
  ('face-table-travertine',
   'FACE TABLE · Տրավերտին', 'FACE TABLE · Травертин', 'FACE TABLE · Travertine',
   'Ձեռքով քանդակված դեմք՝ բնական տրավերտինից, կոփված ապակե մակերեսով։ Երեք չափս՝ 60×40×40, 70×50×45 և 80×60×50 սմ։ Յուրաքանչյուր քար ունի իր հյուսվածքը, ուստի երկու միանման սեղան գոյություն չունի։',
   'Лицо, высеченное вручную из натурального травертина, с закалённой стеклянной столешницей. Три размера: 60×40×40, 70×50×45 и 80×60×50 см. У каждого камня своя текстура — двух одинаковых столов не бывает.',
   'A face carved by hand from natural travertine, finished with a tempered glass top. Three sizes: 60×40×40, 70×50×45 and 80×60×50 cm. Every block has its own grain, so no two tables are alike.',
   'table', 'Травертин', '60×40×40 / 70×50×45 / 80×60×50 cm', 95, 500000, 'AMD', 'available',
   array['/media/face-table-2.png', '/media/gallery-1.png', '/media/gallery-3.png', '/media/carousel-1.png'],
   true, true, 100),

  ('face-table-black-tuff',
   'FACE TABLE · Սև տուֆ', 'FACE TABLE · Чёрный туф', 'FACE TABLE · Black Tuff',
   'Նույն դեմքը՝ հայկական սև տուֆից։ Ծակոտկեն, խորը մակերես, որը լույսը կլանում է։ Կլոր ապակի՝ 90 սմ։',
   'То же лицо, но из армянского чёрного туфа. Пористая, глубокая поверхность, которая поглощает свет вместо того, чтобы отражать его. Круглое стекло 90 см.',
   'The same face in Armenian black tuff. A porous, deep surface that absorbs light instead of reflecting it. Round 90 cm glass top.',
   'table', 'Чёрный туф', '70 × 50 × 45 cm · ⌀90', 88, 589000, 'AMD', 'available',
   array['/media/gallery-2.png', '/media/material-black-tuff.png'],
   true, true, 90),

  ('face-table-round',
   'FACE TABLE · Կլոր', 'FACE TABLE · Круглый', 'FACE TABLE · Round',
   'Հանգիստ դեմք՝ ամբողջովին կլոր ապակու տակ։ Ամենաընդարձակ տարբերակը՝ հյուրասենյակի կենտրոնի համար։ Բարձրություն 42 սմ։',
   'Спокойное лицо под полностью круглым стеклом. Самая просторная версия — для центра гостиной. Высота 42 см.',
   'A resting face beneath a fully round glass top. The most generous version, made for the middle of a living room. Height 42 cm.',
   'table', 'Травертин', '80 × 60 × 42 cm · ⌀100', 120, 750000, 'AMD', 'made_to_order',
   array['/media/gallery-all-7.png', '/media/face-table-only.png'],
   true, true, 80),

  ('quiet-head',
   'Լուռ Գլուխ', 'Тихая Голова', 'Quiet Head',
   'Առանձին քանդակ՝ առանց ապակու։ Տրավերտին, 45 սմ բարձրություն։',
   'Отдельная скульптура без стекла. Травертин, высота 45 см.',
   'A standalone sculpture, no glass. Travertine, 45 cm tall.',
   'sculpture', 'Травертин', '45 × 30 × 28 cm', 26, null, 'AMD', 'made_to_order',
   array['/media/carousel-3.jpg', '/media/carousel-1.png'],
   false, true, 70)

on conflict (slug) do nothing;

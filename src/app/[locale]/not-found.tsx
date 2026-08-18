import Link from 'next/link';

/**
 * 404 внутри языкового раздела: подсказываем дорогу в каталог,
 * а не выбрасываем человека с сайта.
 */
export default function LocaleNotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[1400px] flex-col items-center justify-center px-5 text-center">
      <p className="kicker">404</p>
      <h1 className="display-lg mt-4">Страница не найдена</h1>
      <p className="mt-4 max-w-[42ch] text-sm text-muted">
        Էջը չի գտնվել · This page does not exist. Возможно, работа продана
        или ссылка устарела.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/ru/catalog" className="btn btn-solid">
          Коллекция
        </Link>
        <Link href="/ru" className="btn btn-ghost">
          На главную
        </Link>
      </div>
    </div>
  );
}

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="kicker">404</p>
      <h1 className="display-lg mt-4">Էջը չի գտնվել</h1>
      <p className="lead mt-4 max-w-[36ch]">
        Ссылка не найдена · This page does not exist.
      </p>
      <Link href="/" className="btn btn-solid mt-10">
        The Face
      </Link>
    </div>
  );
}

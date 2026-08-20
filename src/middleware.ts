import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/i18n/config';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ---- Admin area: refresh the Supabase session and gate access ----
  if (pathname.startsWith('/admin')) {
    const { response, user } = await updateSession(request);
    // страницы, доступные без входа: логин и восстановление пароля
    const isPublic =
      pathname === '/admin/login' ||
      pathname === '/admin/reset' ||
      pathname === '/admin/update-password';

    if (!user && !isPublic) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    if (user && pathname === '/admin/login') {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
    return response;
  }

  // ---- Public area: make sure the URL carries a locale ----
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!hasLocale) {
    const accept = request.headers.get('accept-language') || '';
    const preferred =
      locales.find((locale) => accept.toLowerCase().startsWith(locale)) ||
      (accept.toLowerCase().includes('ru') ? 'ru' : null) ||
      (accept.toLowerCase().includes('hy') ? 'hy' : null) ||
      defaultLocale;

    const url = request.nextUrl.clone();
    url.pathname = `/${preferred}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(url);
  }

  const locale = pathname.split('/')[1];
  const headers = new Headers(request.headers);
  headers.set('x-locale', locale);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|api|favicon.ico|placeholder|.*\\..*).*)'],
};

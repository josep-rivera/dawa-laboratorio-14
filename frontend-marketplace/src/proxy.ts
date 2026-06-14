import { NextRequest, NextResponse } from 'next/server';

const ADMIN_ROUTES = ['/admin'];
const PROTECTED_ROUTES = ['/admin', '/products'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  if (isAdminRoute && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/products/:path*'],
};

import { NextRequest, NextResponse } from 'next/server';

// Countries that should see Chinese version by default
const CHINESE_COUNTRIES = ['CN', 'TW', 'HK', 'MO', 'SG'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip if already on /cn route or accessing API/static files
    if (
        pathname.startsWith('/cn') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Check if user has already chosen a language (cookie)
    const languagePreference = request.cookies.get('language-preference')?.value;
    if (languagePreference) {
        // User has explicitly chosen, respect their choice
        return NextResponse.next();
    }

    // Get country from Vercel's geo headers (injected by Vercel Edge)
    const country = request.headers.get('x-vercel-ip-country') || '';

    // Get browser language from Accept-Language header
    const acceptLanguage = request.headers.get('accept-language') || '';
    const prefersChinese = acceptLanguage.toLowerCase().includes('zh');

    // Determine if should redirect to Chinese
    const isChineseCountry = CHINESE_COUNTRIES.includes(country.toUpperCase());
    const shouldRedirectToChinese = isChineseCountry || prefersChinese;

    if (shouldRedirectToChinese) {
        // Redirect to /cn version
        const url = request.nextUrl.clone();
        url.pathname = `/cn${pathname === '/' ? '' : pathname}`;

        const response = NextResponse.redirect(url);
        // Set cookie to remember this was an auto-redirect (can be overridden by user)
        response.cookies.set('auto-detected-language', 'zh', {
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};

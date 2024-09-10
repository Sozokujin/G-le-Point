import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authMiddleware, redirectToHome, redirectToLogin } from 'next-firebase-auth-edge';
import { clientConfig, serverConfig } from '@/services/firebase/config';

const PUBLIC_PATHS = ['/', '/team', '/mentions-legales', '/politique-de-confidentialite', '/cgu', '/login'];
const PUBLIC_ONLY_PATHS = ['/login'];

export async function middleware(request: NextRequest) {
    return authMiddleware(request, {
        loginPath: '/api/login',
        logoutPath: '/api/logout',
        apiKey: clientConfig.apiKey,
        cookieName: serverConfig.cookieName,
        cookieSignatureKeys: serverConfig.cookieSignatureKeys,
        cookieSerializeOptions: serverConfig.cookieSerializeOptions,
        serviceAccount: serverConfig.serviceAccount,
        enableMultipleCookies: true,
        debug: serverConfig.debug,
        handleValidToken: async ({ token, decodedToken }, headers) => {
            if (PUBLIC_ONLY_PATHS.includes(request.nextUrl.pathname)) {
                return redirectToHome(request, { path: '/map' });
            }

            return NextResponse.next({
                request: {
                    headers
                }
            });
        },
        handleInvalidToken: async (reason) => {
            console.info('Missing or malformed credentials', { reason });

            return redirectToLogin(request, {
                path: '/login',
                publicPaths: PUBLIC_PATHS
            });
        },
        handleError: async (error) => {
            console.error('Unhandled authentication error', { error });

            return redirectToLogin(request, {
                path: '/login',
                publicPaths: PUBLIC_PATHS
            });
        }
    });
}

export const config = {
    matcher: [
        // '/api/login',
        // '/api/logout',
        // '/friends',
        // '/leaderboard',
        // '/map',
        // '/profile'
        '/api/login',
        '/api/logout',
        '/',
        '/((?!_next|favicon.ico|api|.*\\.).*)'
    ]
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authMiddleware, redirectToHome, redirectToLogin } from 'next-firebase-auth-edge';
import { clientConfig } from '@/services/firebase/config';

const PUBLIC_PATHS = ['/', '/team', '/mentions-legales', '/politique-de-confidentialite', '/cgu', '/login'];
const PUBLIC_ONLY_PATHS = ['/login'];

const serverConfig = {
    cookieName: process.env.AUTH_COOKIE_NAME!,
    cookieSignatureKeys: [process.env.AUTH_COOKIE_SIGNATURE_KEY_CURRENT!, process.env.AUTH_COOKIE_SIGNATURE_KEY_PREVIOUS!],
    cookieSerializeOptions: {
        path: '/',
        httpOnly: true,
        secure: process.env.USE_SECURE_COOKIES === 'true',
        sameSite: 'lax' as const,
        maxAge: 12 * 60 * 60 * 24 // twelve days
    },
    serviceAccount: {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID!,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!
    },
    debug: process.env.APP_DEBUG === 'true'
};

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
    matcher: ['/api/login', '/api/logout', '/', '/((?!_next|favicon.ico|api|.*\\.).*)']
};

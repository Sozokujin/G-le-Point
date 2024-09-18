import Cookies from '@/components/cookies';
import { Toaster } from '@/components/ui/sonner';
import '@/styles/global.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: "G'Le Point",
    description:
        "G'Le Point est une plateforme collaborative pour découvrir et partager des lieux cachés. Rejoignez une communauté passionnée et explorez des expériences uniques",
    icons: [
        { rel: 'apple-touch-icon', sizes: '180x180', url: '/apple-touch-icon.png' },
        {
            rel: 'icon',
            type: 'image/png',
            sizes: '32x32',
            url: '/favicon-32x32.png'
        },
        {
            rel: 'icon',
            type: 'image/png',
            sizes: '16x16',
            url: '/favicon-16x16.png'
        },
        { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#00a661' },
        { rel: 'shortcut icon', url: '/favicon.ico' }
    ],
    manifest: '/site.webmanifest',
    other: {
        'msapplication-TileColor': '#00a661',
        'msapplication-config': '/browserconfig.xml'
    }
};

export const viewport: Viewport = {
    themeColor: '#ffffff'
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className="scroll-smooth">
            <body className={inter.className}>
                {children}
                <Cookies />
                <Toaster richColors position="top-right" />
            </body>
        </html>
    );
}

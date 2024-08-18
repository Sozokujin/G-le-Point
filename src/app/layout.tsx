import "@/styles/global.css";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "G'Le Point",
  description:
    "G'Le Point est une plateforme collaborative de cartographie interactive qui vous permet de découvrir et partager des lieux cachés et des expériences uniques. Explorez des paysages inédits, soutenez vos spots favoris, et connectez-vous facilement via Facebook, Google, X ou Microsoft. Rejoignez une communauté passionnée et transformez votre façon d'explorer le monde.",
  icons: [
    { rel: "apple-touch-icon", sizes: "180x180", url: "/apple-touch-icon.png" },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
    { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#37b978" },
    { rel: "shortcut icon", url: "/favicon.ico" },
  ],
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#37b978",
    "msapplication-config": "/browserconfig.xml",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

import LandingFooter from "@/components/landingFooter";
import LandingNavbar from "@/components/landingNavbar";
import "@/styles/global.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "G'Le Point",
  description:
    "G'Le Point est une plateforme collaborative de cartographie interactive qui vous permet de découvrir et partager des lieux cachés et des expériences uniques. Explorez des paysages inédits, soutenez vos spots favoris, et connectez-vous facilement via Facebook, Google, X ou Microsoft. Rejoignez une communauté passionnée et transformez votre façon d'explorer le monde.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <LandingNavbar />
      {children}
      <LandingFooter />
    </>
  );
}

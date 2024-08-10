import LandingFooter from "@/components/landingFooter";
import LandingNavbar from "@/components/landingNavbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/global.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "G'Le Point",
  description: "Votre carte collaborative",
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

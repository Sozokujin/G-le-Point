import LandingFooter from "@/components/landingFooter";
import LandingNavbar from "@/components/landingNavbar";
import "@/styles/global.css";

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

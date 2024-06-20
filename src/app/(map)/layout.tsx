import Navbar from "@/components/navbar";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Navbar />
      </body>
    </html>
  );
}

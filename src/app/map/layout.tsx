import Navbar from "@/components/navbar";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      {children}
      <Navbar />
    </section>
  );
}

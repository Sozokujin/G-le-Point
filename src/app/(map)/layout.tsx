import Navbar from "@/app/components/navbar";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Navbar />
    </>
  );
}

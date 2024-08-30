import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "G'Le Point - Connexion",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full h-[100svh] flex justify-center items-center lg:grid lg:grid-cols-2">
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-glp-green-200 to-glp-green-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="flex items-center justify-center py-12">
        {children}
      </div>
      <aside className="h-full hidden bg-muted lg:block">
        <Image
          src="/images/wallpaper.jpg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </aside>
    </main>
  )
}

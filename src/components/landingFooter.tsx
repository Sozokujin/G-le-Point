import Image from "next/image";
import Link from "next/link";

/* eslint-disable react/no-unescaped-entities */
export default function LandingFooter() {
  const footerNavigation = {
    solutions: [
      { name: "Présentation", href: "/#presentation" },
      { name: "Fonctionnalités", href: "/#fonctionnalites" },
      { name: "Plan tarifaires", href: "/#tarifs" },
      { name: "Contact", href: "/#contact" },
    ],
    legal: [
      { name: "Mentions légales", href: "/mentions-legales" },
      { name: "Condition générales d'utilisation", href: "/cgu" },
      {
        name: "Politique de confidentialité",
        href: "/politique-de-confidentialite",
      },
      { name: "🍪 Gérer les cookies", href: "#" },
    ],
    about: [
      { name: "Team G'Le Point", href: "/team" },
      {
        name: "team.glepoint@gmail.com",
        href: "mailto:team.glepoint@gmail.com",
      },
      { name: "06 12 34 56 78", href: "tel:+33012345678" },
    ],
  };

  const actualYear = new Date().getFullYear();

  return (
    <div className="mx-auto mt-32 max-w-7xl px-6 lg:px-8">
      <footer
        aria-labelledby="footer-heading"
        className="relative border-t border-gray-900/10 py-4"
      >
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="xl:flex xl:flex-row justify-between xl:gap-8">
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900">
              À propos
            </h3>
            <ul role="list" className="mt-6 space-y-4">
              {footerNavigation.about.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900">
              Navigation
            </h3>
            <ul role="list" className="mt-6 space-y-4">
              {footerNavigation.solutions.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 md:mt-0">
            <h3 className="text-sm font-semibold leading-6 text-gray-900">
              Liens utiles
            </h3>
            <ul role="list" className="mt-6 space-y-4">
              {footerNavigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className=" flex flex-row justify-between text-center border-t border-gray-900/10 mt-4 py-4">
          <Link href={"/"}>
            <Image
              width={64}
              height={64}
              src="/images/main-logo-green.png"
              alt="Logo G'Le Point"
            />
          </Link>
          <p className="self-center text-sm leading-6 text-gray-600 hover:text-gray-900">
            G'Le Point © {actualYear}, tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}

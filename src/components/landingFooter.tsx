import Link from "next/link";

/* eslint-disable react/no-unescaped-entities */
export default function LandingFooter() {
  const footerNavigation = {
    solutions: [
      { name: "Présentation", href: "#" },
      { name: "Fonctionnalités", href: "#" },
      { name: "Plan tarifaires", href: "#" },
      { name: "Contact", href: "#" },
    ],
    legal: [
      { name: "Mentions légales", href: "/mentions-legales" },
      { name: "Condition générales d'utilisation", href: "#" },
      {
        name: "Politique de confidentialité",
        href: "/politique-de-confidentialite",
      },
      { name: "🍪 Gérer les cookies", href: "#" },
    ],
    about: [
      { name: "Team G'Le Point", href: "#" },
      { name: "Nous rejoindre", href: "#" },
      { name: "0411111111", href: "#" },
      { name: "contact@glp.com", href: "#" },
    ],
  };
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
              About
            </h3>
            <ul role="list" className="mt-6 space-y-4">
              {footerNavigation.about.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                  >
                    {item.name}
                  </a>
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
                  <a
                    href={item.href}
                    className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                  >
                    {item.name}
                  </a>
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
          <img
            className="h-16"
            src="/images/main-logo-green.png"
            alt="Company name"
          />
          <p className="self-center text-sm leading-6 text-gray-600 hover:text-gray-900">
            © 2024 G'Le Point, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { Dialog } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import {
  ArrowPathIcon,
  Bars3Icon,
  CloudArrowUpIcon,
  FingerPrintIcon,
  LockClosedIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const navigation = [
  { name: "Présentation", href: "#" },
  { name: "Fonctionnalités", href: "#" },
  { name: "Plan tarifaires", href: "#" },
  { name: "Contact", href: "#" },
];
const features = [
  {
    name: "Partage de lieux",
    description:
      "Ajoutez vos découvertes uniques à notre carte interactive et partagez des lieux peu connus avec notre communauté.",
    icon: CloudArrowUpIcon,
  },
  {
    name: "Découverte collaborative",
    description:
      "Explorez les contributions des autres utilisateurs pour trouver des expériences inédites autour de vous ou lors de vos voyages.",
    icon: FingerPrintIcon,
  },
  {
    name: "Expériences personnalisées",
    description:
      "Créez et personnalisez vos propres itinéraires avec des sites sélectionnés par vous et la communauté, pour des expériences toujours plus enrichissantes.",
    icon: ArrowPathIcon,
  },
  {
    name: "Sécurité des données",
    description:
      "Nous prenons la sécurité au sérieux. Vos données sont protégées et gérées via Firebase, assurant une infrastructure fiable et robuste.",
    icon: LockClosedIcon,
  },
];
const tiers = [
  {
    name: "Explorateur Pro",
    id: "tier-premium",
    href: "#",
    priceMonthly: "$9/mois",
    description:
      "Pour les aventuriers passionnés souhaitant une visibilité accrue et plus de fonctionnalités.",
    features: [
      "Toutes les fonctionnalités du plan Découvreur",
      "Mise en avant de vos lieux partagés",
      "Fonctionnalités avancées de cartographie",
      "Support prioritaire",
      "Statistiques détaillées des visites",
    ],
    mostPopular: false,
  },
  {
    name: "Découvreur",
    id: "tier-free",
    href: "#",
    priceMonthly: "Gratuit",
    description:
      "Idéal pour les explorateurs occasionnels désirant partager et découvrir de nouveaux lieux.",
    features: [
      "Accès complet à la carte",
      "Possibilité de partager des lieux",
      "Communauté active",
      "Support par la communauté",
    ],
    mostPopular: true,
  },
  {
    name: "Partenaire Professionnel",
    id: "tier-professional",
    href: "#",
    priceMonthly: "$29/mois",
    description:
      "Le choix optimal pour les entreprises et les professionnels cherchant à maximiser leur visibilité.",
    features: [
      "Toutes les fonctionnalités du plan Explorateur Pro",
      "Promotion prioritaire dans les résultats de recherche",
      "Intégrations marketing et API d'accès",
      "Outils d'analyse et de reporting avancés",
      "Support dédié 24/7",
    ],
    mostPopular: false,
  },
];

const footerNavigation = {
  solutions: [
    { name: "Présentation", href: "#" },
    { name: "Fonctionnalités", href: "#" },
    { name: "Plan tarifaires", href: "#" },
    { name: "Contact", href: "#" },
  ],
  legal: [
    { name: "Mentions légales", href: "#" },
    { name: "Condition générales d'utilisation", href: "#" },
    { name: "Politique de confidentialité", href: "#" },
    { name: "🍪 Gérer les cookies", href: "#" },
  ],
  about: [
    { name: "Team G'Le Point", href: "#" },
    { name: "Nous rejoindre", href: "#" },
    { name: "0411111111", href: "#" },
    { name: "contact@glp.com", href: "#" },
  ],
};

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-8 w-auto"
                src="/images/main-logo-green.png"
                alt=""
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
        <Dialog
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt=""
                />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      <main className="isolate">
        {/* Hero section */}
        <div className="relative pt-14">
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
          <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Découvrez et partagez des lieux cachés avec le monde
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Rejoignez notre communauté de découvreurs et enrichissez votre
                  expérience de voyage en explorant des trésors cachés, des
                  panoramas époustouflants et des lieux culturels uniques grâce
                  à notre plateforme collaborative de cartographie.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <a
                    href="#"
                    className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-glp-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Débutez maintenant
                  </a>
                  <a
                    href="#"
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    En savoir plus <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
              <div className="mt-16 flow-root sm:mt-24">
                <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                  <img
                    src="https://tailwindui.com/img/component-images/project-app-screenshot.png"
                    alt="App screenshot"
                    width={2432}
                    height={1442}
                    className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-glp-green-200 to-glp-green-600 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>

        {/* Feature section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">
              Explorons ensemble
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Tout ce dont vous avez besoin pour découvrir et partager des lieux
              uniques
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Connectez-vous avec des explorateurs comme vous et partagez des
              expériences inoubliables. Notre plateforme vous permet de trouver
              et de signaler des lieux cachés et des trésors peu connus,
              enrichissant ainsi votre aventure.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <feature.icon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Testimonial section */}
        <div className="mx-auto mt-32 max-w-7xl sm:mt-56 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gray-900 px-6 py-20 shadow-xl sm:rounded-3xl sm:px-10 sm:py-24 md:px-12 lg:px-20">
            <img
              className="absolute inset-0 h-full w-full object-cover brightness-150 saturate-0"
              src="https://images.unsplash.com/photo-1601381718415-a05fb0a261f3?ixid=MXwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8ODl8fHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1216&q=80"
              alt=""
            />
            <div className="absolute inset-0 bg-gray-900/90 mix-blend-multiply" />
            <div
              className="absolute -left-80 -top-56 transform-gpu blur-3xl"
              aria-hidden="true"
            >
              <div
                className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-r from-white to-gray-200  opacity-[0.45]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
            <div
              className="hidden md:absolute md:bottom-16 md:left-[50rem] md:block md:transform-gpu md:blur-3xl"
              aria-hidden="true"
            >
              <div
                className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-r from-white to-gray-200 opacity-25"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
            <div className="relative mx-auto max-w-2xl lg:mx-0">
              <img
                className="h-12 w-auto"
                src="https://tailwindui.com/img/logos/workcation-logo-white.svg"
                alt=""
              />
              <figure>
                <blockquote className="mt-6 text-lg font-semibold text-white sm:text-xl sm:leading-8">
                  <p>
                    “Grâce à cette plateforme, j'ai pu découvrir des spots de
                    randonnée incroyables que je n'aurais jamais trouvés seul.
                    C'est fantastique de pouvoir partager mes propres
                    trouvailles aussi!”
                  </p>
                </blockquote>
                <figcaption className="mt-6 text-base text-white">
                  <div className="font-semibold">Alex Durand</div>
                  <div className="mt-1">
                    Aventurier passionné et contributeur actif
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>

        {/* Pricing section */}
        <div className="py-24 sm:pt-48">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-base font-semibold leading-7 text-primary">
                Nos Plans
              </h2>
              <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Plans tarifaires adaptés à tous les explorateurs
              </p>
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
              Choisissez le plan qui vous convient le mieux pour partager et
              découvrir des lieux uniques et cachés.
            </p>
            <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {tiers.map((tier, tierIdx) => (
                <div
                  key={tier.id}
                  className={classNames(
                    tier.mostPopular ? "lg:z-10 lg:rounded-b-none" : "lg:mt-8",
                    tierIdx === 0 ? "lg:rounded-r-none" : "",
                    tierIdx === tiers.length - 1 ? "lg:rounded-l-none" : "",
                    "flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10"
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between gap-x-4">
                      <h3
                        id={tier.id}
                        className={classNames(
                          tier.mostPopular ? "text-primary" : "text-gray-900",
                          "text-lg font-semibold leading-8"
                        )}
                      >
                        {tier.name}
                      </h3>
                      {tier.mostPopular ? (
                        <p className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold leading-5 text-primary">
                          Most popular
                        </p>
                      ) : null}
                    </div>
                    <p className="mt-4 text-sm leading-6 text-gray-600">
                      {tier.description}
                    </p>
                    <p className="mt-6 flex items-baseline gap-x-1">
                      <span className="text-4xl font-bold tracking-tight text-gray-900">
                        {tier.priceMonthly}
                      </span>
                      <span className="text-sm font-semibold leading-6 text-gray-600">
                        /month
                      </span>
                    </p>
                    <ul
                      role="list"
                      className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
                    >
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                          <CheckIcon
                            className="h-6 w-5 flex-none text-primary"
                            aria-hidden="true"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href={tier.href}
                    aria-describedby={tier.id}
                    className={classNames(
                      tier.mostPopular
                        ? "bg-primary text-white shadow-sm hover:bg-indigo-500"
                        : "text-primary ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300",
                      "mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    )}
                  >
                    Buy plan
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="relative -z-10 mt-32 px-6 lg:px-8">
          <div
            className="absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 transform-gpu justify-center overflow-hidden blur-3xl sm:bottom-0 sm:right-[calc(50%-6rem)] sm:top-auto sm:translate-y-0 sm:transform-gpu sm:justify-end"
            aria-hidden="true"
          >
            <div
              className="aspect-[1108/632] w-[69.25rem] flex-none bg-gradient-to-r from-glp-green-200 to-glp-green-600 opacity-25"
              style={{
                clipPath:
                  "polygon(73.6% 48.6%, 91.7% 88.5%, 100% 53.9%, 97.4% 18.1%, 92.5% 15.4%, 75.7% 36.3%, 55.3% 52.8%, 46.5% 50.9%, 45% 37.4%, 50.3% 13.1%, 21.3% 36.2%, 0.1% 0.1%, 5.4% 49.1%, 21.4% 36.4%, 58.9% 100%, 73.6% 48.6%)",
              }}
            />
          </div>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Boostez votre curiosité.
              <br />
              Commencez à explorer avec notre app aujourd'hui.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Rejoignez notre communauté et commencez à découvrir et partager
              des lieux uniques et cachés. Votre prochaine grande découverte
              vous attend.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Get started
              </a>
              <a
                href="#"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div
            className="absolute left-1/2 right-0 top-full -z-10 hidden -translate-y-1/2 transform-gpu overflow-hidden blur-3xl sm:block"
            aria-hidden="true"
          >
            <div
              className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-glp-green-200 to-glp-green-600 opacity-30"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="mx-auto mt-32 max-w-7xl px-6 lg:px-8">
        <footer
          aria-labelledby="footer-heading"
          className="relative border-t border-gray-900/10 sm:mt-56 py-4"
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
          </div>
          <div className=" flex flex-row justify-between text-center border-t border-gray-900/10 mt-4 py-4">
            <img
              className="h-16"
              src="/images/main-logo-green.png"
              alt="Company name"
            />
            <p className=" self-center text-sm leading-6 text-gray-600 hover:text-gray-900">
              Copyright @GLP 2024
            </p>
            <div className=" self-center text-sm leading-6 text-gray-600 hover:text-gray-900">
              Contactez nous
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* eslint-disable react/no-unescaped-entities */
import LandingFooter from "@/components/landingFooter";
import LandingNavbar from "@/components/landingNavbar";
import { BorderBeam } from "@/components/magicui/border-beam";
import PulsatingButton from "@/components/ui/pulsating-button";
import { CheckIcon } from "@heroicons/react/20/solid";
import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  FingerPrintIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

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
    name: "1 Super Point",
    id: "tier-premium",
    href: "#",
    priceYearly: "10€",
    description:
      "Pour les aventuriers passionnés souhaitant une visibilité accrue.",
    features: [
      "Toutes les fonctionnalités du plan Découvreur",
      "Mise en avant de vos lieux partagés",
      "Fonctionnalités avancées de cartographie",
      "Promotion prioritaire dans les résultats de recherche",
      "Support prioritaire",
    ],
    mostPopular: false,
  },
  {
    name: "Découvreur",
    id: "tier-free",
    href: "#",
    priceYearly: "Gratuit",
    description:
      "Idéal pour les explorateurs désirant partager et découvrir de nouveaux lieux.",
    features: [
      "Accès complet à la carte",
      "Possibilité de partager des lieux",
      "Possibilité d'ajouter des amis",
      "Création de groupes d'amis",
    ],
    mostPopular: true,
  },
  {
    name: "5 Super Points",
    id: "tier-professional",
    href: "#",
    priceYearly: "40€",
    description:
      "Le choix optimal pour les professionnels cherchant à maximiser leur visibilité.",
    features: [
      "Toutes les fonctionnalités du plan Découvreur",
      "Mise en avant de vos lieux partagés",
      "Fonctionnalités avancées de cartographie",
      "Promotion prioritaire dans les résultats de recherche",
      "Support prioritaire",
    ],
    mostPopular: false,
  },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Page() {
  return (
    <div className="bg-white">
      <LandingNavbar />

      <main className="isolate">
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
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1
                id="presentation"
                className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
              >
                Découvrez et partagez des lieux cachés avec le monde
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Rejoignez notre communauté de découvreurs et enrichissez votre
                expérience de voyage en explorant des trésors cachés, des
                panoramas époustouflants et des lieux culturels uniques grâce à
                notre plateforme collaborative de cartographie.
              </p>
              <div className="mt-10 flex flex-col md:flex-row gap-4 items-center justify-center gap-x-6">
                <Link href="/login">
                  <PulsatingButton className="bg-primary" pulseColor="#00a661">
                    Débutez maintenant
                  </PulsatingButton>
                </Link>
                <Link
                  href="#fonctionnalites"
                  className="text-sm font-semibold leading-6 text-gray-900 hover:scale-110 duration-300"
                >
                  En savoir plus <span aria-hidden="true">↓</span>
                </Link>
              </div>
            </div>
            <div className="mt-16 flow-root sm:mt-24">
              <div className="relative overflow-hidden -m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <Image
                  src="/images/wallpaper.jpg"
                  alt="App screenshot"
                  width={2432}
                  height={1442}
                  className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                />
                <BorderBeam
                  size={800}
                  duration={12}
                  delay={9}
                  colorFrom="#9FCF6D"
                  colorTo="#7CC772"
                />
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

        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2
              id="fonctionnalites"
              className="text-2xl font-semibold leading-7 text-primary"
            >
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

        <div className="mx-auto mt-32 max-w-7xl sm:mt-56 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gray-900 px-6 py-20 shadow-xl sm:rounded-3xl sm:px-10 sm:py-24 md:px-12 lg:px-20">
            <Image
              width={1097}
              height={845}
              className="absolute inset-0 h-full w-full object-cover brightness-150 saturate-0"
              src="/images/women-nature.avif"
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
              <Image
                height={64}
                width={64}
                src="/images/main-logo-white.svg"
                alt="Logo G'Le Point"
              />
              <figure>
                <blockquote className="mt-6 text-lg font-semibold text-white sm:text-xl sm:leading-8">
                  <p>
                    “Grâce à cette plateforme, j'ai pu découvrir des spots de
                    randonnée incroyables que je n'aurais jamais trouvés seule.
                    C'est fantastique de pouvoir partager mes propres
                    trouvailles aussi!”
                  </p>
                </blockquote>
                <figcaption className="mt-6 text-base text-white">
                  <div className="font-semibold">Alexia D.</div>
                  <div className="mt-1">
                    Aventurière passionnée et contributrice active
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>

        <div className="mt-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2
                id="tarifs"
                className="text-2xl font-semibold leading-7 text-primary"
              >
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
                    <div className="flex items-center justify-between flex-col gap-x-4">
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
                          Lancez-vous gratuitement
                        </p>
                      ) : null}
                    </div>
                    <p className="mt-4 text-sm leading-6 text-gray-600">
                      {tier.description}
                    </p>
                    <p className="mt-6 flex items-baseline gap-x-1">
                      <span className="text-4xl font-bold tracking-tight text-gray-900">
                        {tier.priceYearly}
                        {tier.priceYearly !== "Gratuit" && (
                          <span className="align-top text-lg leading-6 text-gray-600">
                            *
                          </span>
                        )}
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

                  {tier.priceYearly === "Gratuit" ? (
                    <a
                      href={tier.href}
                      aria-describedby={tier.id}
                      className={classNames(
                        tier.mostPopular
                          ? "bg-primary text-white shadow-sm hover:bg-glp-green-800"
                          : "text-primary ring-1 ring-inset hover:bg-glp-green-800 hover:text-white ring-current duration-300",
                        "mb-6 mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      )}
                    >
                      Commencer maintenant
                    </a>
                  ) : (
                    <a
                      href={tier.href}
                      aria-describedby={tier.id}
                      className={classNames(
                        tier.mostPopular
                          ? "bg-primary text-white shadow-sm hover:bg-glp-green-800"
                          : "text-primary ring-1 ring-inset hover:bg-glp-green-800 hover:text-white ring-current duration-300",
                        "mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      )}
                    >
                      Acheter maintenant
                    </a>
                  )}
                  {tier.priceYearly !== "Gratuit" && (
                    <div className="h-6">
                      <span className="text-xs italic leading-6 text-gray-600">
                        * Valable pendant 1 an
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

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
            <h2
              id="contact"
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              Boostez votre curiosité.
              <br />
              Commencer à explorer avec notre app aujourd'hui.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Rejoignez notre communauté et commencez à découvrir et partager
              des lieux uniques et cachés. Votre prochaine grande découverte
              vous attend.
            </p>
            <div className="mt-10 flex flex-col md:flex-row gap-4 items-center justify-center gap-x-6">
              <Link href="/login">
                <PulsatingButton className="bg-primary" pulseColor="#00a661">
                  Commencer maintenant
                </PulsatingButton>
              </Link>
              <a
                href="mailto:team.glepoint@gmail.com"
                className="text-sm font-semibold leading-6 text-gray-900 hover:scale-110 duration-300"
              >
                Nous contacter <span aria-hidden="true">→</span>
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
      <LandingFooter />
    </div>
  );
}

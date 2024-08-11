/* eslint-disable react/no-unescaped-entities */
export default function Privacy() {
  return (
    <main className="isolate mx-[20%]">
      <div className="pt-24 sm:pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 leading-8">
          <h1>Politique de confidentialité</h1>
          <p>
            La présente politique de confidentialité décrit les pratiques de
            G'Le Point concernant la collecte, l'utilisation et la protection
            des données personnelles des utilisateurs de notre application.
          </p>
          <h2>Types de Données Collectées</h2>
          <p>
            Nous collectons des informations personnelles via Firebase Auth lors
            de l'inscription, telles que le nom et l'adresse e-mail. Nous
            utilisons également Vercel Analytics pour recueillir des données
            d'utilisation anonymes afin d'améliorer l'expérience utilisateur.
          </p>
          <h2>Utilisation des Données</h2>
          <p>
            Les données collectées sont utilisées pour personnaliser
            l'expérience utilisateur et améliorer nos services. Nous ne
            partageons pas vos données personnelles avec des tiers, sauf avec
            nos prestataires de services, Firebase pour la gestion de la base de
            données et Vercel pour l'hébergement.
          </p>
          <h2>Partage des Données</h2>
          <p>
            Vos données personnelles ne sont partagées qu'avec Firebase et
            Vercel, nos partenaires de confiance, qui respectent des normes
            strictes de sécurité des données.
          </p>
          <h2>Sécurité des Données</h2>
          <p>
            Nous déléguons la sécurité des données à Firebase et Vercel, qui
            mettent en œuvre des mesures de sécurité robustes pour protéger vos
            informations personnelles.
          </p>
          <h2>Droits des Utilisateurs</h2>
          <p>
            Vous avez le droit d'accéder à vos données personnelles, de les
            rectifier ou de demander leur suppression. Pour exercer ces droits,
            veuillez nous contacter à l'adresse e-mail fournie ci-dessous.
          </p>
          <h2>Conservation des Données</h2>
          <p>
            Nous conservons vos données personnelles aussi longtemps que
            nécessaire pour atteindre les objectifs décrits dans cette
            politique, sauf si une période de conservation plus longue est
            requise ou permise par la loi.
          </p>
          <h2>Contact</h2>
          <p>
            Pour toute question concernant cette politique de confidentialité,
            veuillez nous contacter à l'adresse suivante : {""}
            <a
              className="text-primary underline"
              href="mailto:team.glepoint@gmail.com"
            >
              team.glepoint@gmail.com
            </a>
            .
            <p className="mt-2">
              Cette politique de confidentialité est conçue pour être claire et
              concise, tout en respectant les pratiques de confidentialité
              standard. Assurez-vous de l'adapter en fonction des lois et
              réglementations locales applicables, telles que le RGPD en Europe,
              si nécessaire.
            </p>
          </p>
        </div>
      </div>
    </main>
  );
}

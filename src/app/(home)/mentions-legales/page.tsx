import Link from "next/link";
/* eslint-disable react/no-unescaped-entities */

export const metadata = {
  title: "G'Le Point - Mentions légales",
  description:
    "Découvrez les informations légales relatives à G'Le Point, incluant les détails sur l'éditeur, l'hébergeur, et les moyens de contact. Transparence et conformité au service de votre sécurité.",
};

export default function Legal() {
  return (
    <main className="isolate md:mx-[25%]">
      <div className="mt-10 mb-16 mx-auto max-w-7xl px-6 lg:px-8 leading-8">
        <h1 className="text-center mb-8">Mentions légales</h1>
        <div className="flex flex-col gap-4">
          <h2>1. Informations Générales</h2>
          <p>
            Le site internet <strong>G'Le Point</strong> (ci-après dénommé le
            "Site") est édité par :
          </p>
          <ul className="list-disc list-inside">
            <li>
              <strong>Nom de l'entreprise :</strong> G'Le Point
            </li>
            <li>
              <strong>Status juridique :</strong> Projet scolaire
            </li>
            <li>
              <strong>Adresse :</strong> 6 Cr de Verdun Rambaud, 69002 Lyon
            </li>
            <li>
              <strong>Email :</strong>{" "}
              <a className="underline" href="mailto:team.glepoint@gmail.com">
                team.glepoint@gmail.com
              </a>
            </li>
            <li>
              <strong>Nom du site :</strong> G'Le Point
            </li>
          </ul>

          <h2>2. Directeur de la Publication</h2>
          <p>Le directeur de la publication du Site est : G'Le Point.</p>

          <h2>3. Hébergeur du Site</h2>
          <ul className="list-disc list-inside">
            <li>
              <strong>Le Site est hébergé par : </strong>Vercel Inc.
            </li>
            <li>
              <strong>Siège Social de l'hébergeur (EEE) : </strong>Avenue Huart
              Hamoir 71, 1030 Brussels, Belgium
            </li>
            <li>
              <strong>Email de l'hébergeur : </strong>
              <a href="mailto:support@vercel.com" className="underline">
                support@vercel.com
              </a>
            </li>
          </ul>

          <h2>4. Propriété Intellectuelle</h2>
          <p>
            Les contenus du Site (textes, images, graphiques, logos, etc.) sont
            protégés par les droits de propriété intellectuelle et appartiennent
            à G'Le Point ou à des tiers ayant autorisé G'Le Point à les
            utiliser. Toute reproduction, représentation, modification ou
            adaptation de ces contenus, en tout ou partie, sans l'accord
            préalable écrit de G'Le Point est interdite.
          </p>

          <h2>5. Responsabilité</h2>
          <p>
            G'Le Point met en œuvre tous les moyens pour assurer l'exactitude et
            la mise à jour des informations diffusées sur le Site. Cependant,
            G'Le Point ne peut garantir l'exactitude, la précision, la
            complétude ou l'actualité des informations disponibles sur le Site.
            En conséquence, G'Le Point décline toute responsabilité pour toute
            imprécision, inexactitude ou omission portant sur des informations
            disponibles sur le Site.
          </p>

          <h2>6. Liens Hypertextes</h2>
          <p>
            Le Site peut contenir des liens hypertextes vers d'autres sites web.
            Ces liens sont fournis uniquement pour votre commodité et
            n'impliquent pas une approbation ou une validation des contenus de
            ces sites par G'Le Point. G'Le Point n'est pas responsable des
            contenus des sites tiers et ne peut garantir leur disponibilité.
          </p>

          <h2>7. Données Personnelles</h2>
          <p>
            Pour toute information relative à la collecte, à l'utilisation et à
            la protection de vos données personnelles, veuillez consulter notre{" "}
            <Link className="underline" href="/politique-de-confidentialite">
              Politique de Confidentialité
            </Link>
            .
          </p>

          <h2>8. Conditions Générales d'Utilisation (CGU)</h2>
          <p>
            L'utilisation du Site est régie par nos{" "}
            <Link href="/cgu" className="underline">
              Conditions Générales d'Utilisation
            </Link>
            . En accédant au Site, vous acceptez sans réserve ces conditions.
            Nous vous invitons à les lire attentivement.
          </p>

          <h2>9. Loi Applicable</h2>
          <p>
            Le Site et les présentes mentions légales sont soumis au droit
            français. Tout litige relatif à l'utilisation du Site sera soumis à
            la compétence exclusive des tribunaux français.
          </p>

          <h2>10. Modification des Mentions Légales</h2>
          <p>
            G'Le Point se réserve le droit de modifier les présentes mentions
            légales à tout moment. Les modifications entreront en vigueur dès
            leur publication sur le Site. Nous vous invitons donc à consulter
            régulièrement cette page pour prendre connaissance des éventuelles
            modifications.
          </p>
          <p className="italic text-lg mt-8">
            Date de mise à jour : 18 Août 2024
          </p>
        </div>
      </div>
    </main>
  );
}

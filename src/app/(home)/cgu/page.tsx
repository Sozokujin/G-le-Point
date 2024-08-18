import Link from "next/link";

/* eslint-disable react/no-unescaped-entities */
export default function Cgu() {
  return (
    <main className="isolate md:mx-[20%]">
      <div className="mt-10 mb-16 mx-auto max-w-7xl px-6 lg:px-8 leading-8">
        <h1 className="text-center mb-8">Conditions Générales d'Utilisation</h1>
        <div className="flex flex-col gap-4">
          <p className="mb-4">
            Les présentes Conditions Générales d'Utilisation (CGU) régissent
            l'accès et l'utilisation des services proposés par{" "}
            <strong>G'Le Point</strong>, accessible à l'adresse{" "}
            <a className="underline" href="https://glepoint.fr">
              glepoint.fr
            </a>
            . En accédant et en utilisant notre site, vous acceptez de vous
            conformer à ces conditions. En cas de non-acceptation des CGU
            stipulées dans le présent contrat, l'Utilisateur se doit de renoncer
            à l'accès aux Services proposés par le Site.
          </p>

          <h2>1. Introduction</h2>
          <p>
            Nous fournissons une plateforme de cartographie interactive où les
            utilisateurs peuvent partager et découvrir des lieux d'intérêt moins
            connus. En utilisant notre site, vous acceptez ces CGU et notre{" "}
            <Link className="underline" href="/politique-de-confidentialite">
              Politique de Confidentialité
            </Link>
            .
          </p>

          <h2>2. Accès au Service</h2>
          <p>
            Pour utiliser nos services, vous devez vous inscrire en utilisant un
            compte Facebook, Microsoft, X ou Google via le SSO (Single Sign-On)
            fourni par Firebase. Vous vous engagez à fournir des informations
            exactes et complètes lors de l'inscription.
          </p>

          <h2>3. Utilisation de la Plateforme</h2>
          <p>Vous pouvez utiliser notre plateforme pour :</p>
          <ul className="list-disc list-inside">
            <li>Ajouter des points d'intérêt sur la carte.</li>
            <li>
              Consulter et explorer les contributions d'autres utilisateurs.
            </li>
            <li>
              Acheter des "supers points" via notre système de paiement Stripe
              pour améliorer vos contributions.
            </li>
          </ul>
          <p>
            Vous vous engagez à utiliser notre plateforme de manière légale et
            éthique, sans violer les droits de tiers ou enfreindre la loi.
          </p>

          <h2>4. Responsabilités de l'Utilisateur</h2>
          <p>
            Vous êtes responsable de l'utilisation que vous faites de notre
            plateforme et des informations que vous publiez. Vous vous engagez à
            ne pas publier de contenu illégal, offensant ou nuisible. Nous nous
            réservons le droit de supprimer tout contenu que nous jugeons
            inapproprié.
          </p>

          <h2>5. Propriété Intellectuelle</h2>
          <p>
            Tous les droits de propriété intellectuelle sur le contenu et la
            technologie utilisés sur notre site sont détenus par{" "}
            <strong>G'Le Point</strong> ou ses partenaires. Vous ne pouvez pas
            utiliser notre contenu ou technologie sans notre autorisation
            préalable.
          </p>

          <h2>6. Limitation de Responsabilité</h2>
          <p>
            Nous ne garantissons pas que notre plateforme sera accessible en
            permanence ou sans interruption. Nous ne sommes pas responsables des
            dommages résultant de l'utilisation ou de l'incapacité d'utiliser
            notre service, sauf en cas de négligence grave ou de faute
            intentionnelle de notre part.
          </p>

          <h2>7. Modifications des Conditions</h2>
          <p>
            Nous nous réservons le droit de modifier ces CGU à tout moment. Les
            modifications entreront en vigueur dès leur publication sur notre
            site. Vous êtes invité à consulter régulièrement les CGU pour être
            informé des éventuelles modifications.
          </p>

          <h2>8. Loi Applicable et Juridiction</h2>
          <p>
            Les présentes CGU sont régies par le droit français. Tout litige
            relatif à l'utilisation de notre plateforme sera soumis aux
            tribunaux compétents de Lyon, France.
          </p>

          <h2>9. Contact</h2>
          <p>
            Pour toute question relative à ces CGU, veuillez nous contacter à
            l'adresse suivante :{" "}
            <a className="underline" href="mailto:team.glepoint@gmail.com">
              team.glepoint@gmail.com
            </a>
            .
          </p>

          <h2>10. Création d'un Compte</h2>
          <p>
            Pour accéder à certaines fonctionnalités de notre plateforme, vous
            devez créer un compte en utilisant un des services de SSO
            disponibles (Facebook, Microsoft, X ou Google). Vous êtes
            responsable de la confidentialité de vos identifiants et de toutes
            les activités effectuées sous votre compte.
          </p>

          <h2>11. Achats In-App</h2>
          <p>
            Nous offrons des achats in-app via Stripe pour acquérir des "supers
            points". Les transactions sont sécurisées, et vous devez fournir des
            informations de paiement valides. Toutes les transactions sont
            définitives et non remboursables, sauf disposition contraire de la
            loi applicable.
          </p>

          <h2>12. Contenu Généré par les Utilisateurs</h2>
          <p>
            Les utilisateurs peuvent publier des contenus sur notre plateforme.
            Vous conservez les droits sur le contenu que vous publiez mais
            accordez à <strong>G'Le Point</strong> une licence mondiale,
            gratuite, non exclusive, et pouvant être sous-licenciée pour
            utiliser, reproduire, modifier et distribuer ce contenu dans le
            cadre de nos services.
          </p>

          <h2>13. Interdiction d'Usage</h2>
          <p>Vous vous engagez à ne pas utiliser notre plateforme pour :</p>
          <ul className="list-disc list-inside">
            <li>
              Violer les droits de propriété intellectuelle ou les lois
              applicables.
            </li>
            <li>Publier des contenus diffamatoires, offensants ou illégaux.</li>
            <li>
              Interférer avec le fonctionnement normal de notre plateforme ou
              perturber l'expérience des autres utilisateurs.
            </li>
          </ul>

          <h2>14. Confidentialité</h2>
          <p>
            La collecte et le traitement de vos données personnelles sont régis
            par notre{" "}
            <Link className="underline" href="/politique-de-confidentialite">
              Politique de Confidentialité
            </Link>
            . Vous devez lire cette politique pour comprendre comment nous
            collectons, utilisons et protégeons vos informations.
          </p>

          <h2>15. Sécurité</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité pour protéger vos
            données contre l'accès non autorisé, la perte ou la divulgation.
            Toutefois, aucune méthode de transmission sur Internet ou de
            stockage électronique n'est totalement sécurisée. Nous ne pouvons
            garantir la sécurité absolue de vos informations.
          </p>

          <h2>16. Résiliation</h2>
          <p>
            Nous nous réservons le droit de résilier ou de suspendre votre
            compte et votre accès à la plateforme si vous enfreignez ces CGU ou
            si nous jugeons que votre utilisation est inappropriée ou illégale.
          </p>

          <h2>17. Disponibilité des Services</h2>
          <p>
            Nous nous efforçons de maintenir la disponibilité de notre
            plateforme, mais nous ne pouvons garantir qu'elle sera ininterrompue
            ou exempte d'erreurs. Nous pouvons suspendre temporairement l'accès
            pour maintenance ou mise à jour.
          </p>

          <h2>18. Responsabilité des Liens Externes</h2>
          <p>
            Notre site peut contenir des liens vers des sites tiers. Nous ne
            sommes pas responsables du contenu, des pratiques de confidentialité
            ou des politiques de ces sites externes. Vous accédez à ces sites à
            vos propres risques.
          </p>

          <h2>19. Modifications des Services</h2>
          <p>
            Nous pouvons modifier ou interrompre nos services à tout moment,
            sans préavis. Nous ne serons pas responsables des modifications ou
            interruptions de service, sauf dans les cas prévus par la loi.
          </p>

          <h2>20. Force Majeure</h2>
          <p>
            Nous ne serons pas responsables des manquements à nos obligations si
            ces manquements résultent de circonstances échappant à notre
            contrôle raisonnable, telles que des catastrophes naturelles, des
            pannes de réseau ou des conflits sociaux.
          </p>

          <h2>21. Dispositions Générales</h2>
          <p>
            Si une disposition des présentes CGU est jugée invalide ou
            inapplicable, les autres dispositions resteront pleinement en
            vigueur. Aucune renonciation à une disposition des CGU ne sera
            considérée comme une renonciation permanente.
          </p>
          <p className="italic text-lg mt-8">
            Date de mise à jour : 18 Août 2024
          </p>
        </div>
      </div>
    </main>
  );
}

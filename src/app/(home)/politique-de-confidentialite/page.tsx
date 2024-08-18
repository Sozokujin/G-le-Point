/* eslint-disable react/no-unescaped-entities */

export const metadata = {
  title: "G'Le Point - Politique de confidentialité",
  description:
    "Prenez connaissance de notre Politique de Confidentialité pour comprendre comment G'Le Point collecte, utilise et protège vos données personnelles. Votre vie privée est notre priorité.",
};

export default function Privacy() {
  return (
    <main className="isolate md:mx-[25%]">
      <div className="mt-10 mb-16 mx-auto max-w-7xl px-6 lg:px-8 leading-8">
        <h1 className="text-center mb-8">Politique de confidentialité</h1>
        <div className="flex flex-col gap-4">
          <p className="mb-4">
            Pour l’Editeur, la protection des Données à caractère personnel est
            une priorité. L’Editeur traite les Données à caractère personnel de
            ses Utilisateurs en conformité aux dispositions légales, et plus
            particulièrement celles issues du Règlement européen 2016/679
            relatif à la protection des Données à caractère personnel du 27
            avril 2016 (ci-après le « RGPD ») et la Loi du 6 janvier 1978 dite «
            Informatique & Libertés ».
          </p>
          <p className="mb-4">
            <strong>G'Le Point</strong> accorde une grande importance à la
            protection de vos données personnelles. Cette politique de
            confidentialité explique comment nous collectons, utilisons,
            stockons et protégeons vos informations lorsque vous utilisez notre
            site web et nos services.
          </p>

          <h2>1. Utilité de cette politique</h2>
          <p>
            La protection et la confidentialité de vos données personnelles sont
            essentielles pour nous, car elles renforcent la confiance et le
            sérieux de nos engagements. Cette politique illustre notre
            engagement à respecter les normes établies par le Règlement général
            sur la protection des données (RGPD). Elle a pour but de vous
            expliquer comment et pourquoi nous traitons vos données dans le
            cadre des services que nous offrons.
          </p>

          <h2>2. À qui s’adresse cette politique ?</h2>
          <p>
            Cette politique s’adresse à toute personne, quels que soient son
            lieu de résidence et son rôle (utilisateur de G'Le Point,
            partenaire, ou visiteur du site{" "}
            <a className="underline" href="https://glepoint.fr">
              glepoint.fr
            </a>
            ).
          </p>

          <h2>3. Pourquoi traitons-nous vos données ?</h2>
          <p>
            Nous traitons vos données personnelles pour les raisons suivantes :
          </p>
          <ul className="list-disc list-inside">
            <li>
              <strong>Création et gestion de compte :</strong> Pour vous
              permettre d'utiliser nos services (ex : ajout de points d'intérêt
              sur la carte, consultation des contributions).
            </li>
            <li>
              <strong>Suivi et amélioration des services :</strong> Pour assurer
              le bon fonctionnement de notre plateforme et améliorer nos
              services.
            </li>
            <li>
              <strong>Transactions :</strong> Pour gérer les achats de "supers
              points" via Stripe.
            </li>
            <li>
              <strong>Communication :</strong> Pour vous informer des mises à
              jour importantes concernant nos services.
            </li>
          </ul>
          <p>
            Nous utilisons le SSO (Single Sign-On) fourni par Firebase pour la
            gestion de l'authentification. Les services tiers comme Facebook,
            Microsoft, X et Google peuvent être utilisés pour
            l'authentification.
          </p>

          <h2>4. Quelles données traitons-nous et pour combien de temps ?</h2>
          <p>
            Les données que nous collectons et leur durée de conservation sont
            les suivantes :
          </p>
          <ul className="list-disc list-inside">
            <li>
              <strong>Données d’identification :</strong> (ex : nom, prénom,
              adresse email) conservées pendant toute la durée de l'utilisation
              de notre service, et pour une durée maximale de 5 ans après la
              dernière utilisation.
            </li>
            <li>
              <strong>Données de paiement :</strong> (ex : informations liées
              aux transactions via Stripe) conservées pendant la durée
              nécessaire à la gestion des transactions et à la conformité avec
              les obligations légales (généralement 5 à 10 ans).
            </li>
            <li>
              <strong>Données de connexion :</strong> (ex : logs, adresse IP)
              conservées pendant une durée de 1 an.
            </li>
          </ul>
          <p>
            Après ces périodes, vos données personnelles seront supprimées de
            manière irréversible, sauf si nous sommes tenus de les conserver
            pour des raisons légales ou de litige.
          </p>

          <h2>
            5. De quels droits disposez-vous pour contrôler l’usage de vos
            données ?
          </h2>
          <p>
            Vous disposez des droits suivants concernant vos données
            personnelles :
          </p>
          <ul className="list-disc list-inside">
            <li>
              <strong>Droit d'accès :</strong> Vous pouvez demander l'accès aux
              données personnelles que nous détenons sur vous.
            </li>
            <li>
              <strong>Droit de rectification :</strong> Vous pouvez demander la
              correction des données personnelles incorrectes ou incomplètes.
            </li>
            <li>
              <strong>Droit d'opposition :</strong> Vous pouvez vous opposer au
              traitement de vos données à des fins de prospection commerciale.
            </li>
            <li>
              <strong>Droit à l'effacement :</strong> Vous pouvez demander la
              suppression de vos données personnelles qui ne sont pas
              nécessaires à l'exécution de nos services.
            </li>
            <li>
              <strong>Droit à la limitation :</strong> Vous pouvez demander la
              limitation du traitement de vos données en cas de contestation sur
              la légitimité du traitement.
            </li>
            <li>
              <strong>Droit à la portabilité :</strong> Vous pouvez récupérer
              vos données personnelles pour les transférer à un autre
              responsable de traitement.
            </li>
            <li>
              <strong>Droit de donner des directives post-mortem :</strong> Vous
              pouvez donner des directives sur la gestion de vos données après
              votre décès.
            </li>
          </ul>
          <p>
            Pour exercer ces droits, veuillez nous contacter à l'adresse{" "}
            <a className="underline" href="mailto:team.glepoint@gmail.com">
              team.glepoint@gmail.com
            </a>
            . Nous répondrons à votre demande dans un délai de deux mois.
          </p>

          <h2>6. Qui peut avoir accès à vos données ?</h2>
          <p>
            Vos données peuvent être partagées avec les personnes suivantes :
          </p>
          <ul className="list-disc list-inside">
            <li>
              <strong>Notre personnel :</strong> Incluant les équipes de
              support, développement et gestion.
            </li>
            <li>
              <strong>Prestataires tiers :</strong> Pour les services de
              paiement (Stripe) et les services d'hébergement.
            </li>
            <li>
              <strong>Autorités légales :</strong> Si nous y sommes contraints
              par la loi ou pour la protection de nos droits.
            </li>
          </ul>

          <h2>7. Comment protégeons-nous vos données ?</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité appropriées pour
            protéger vos données contre l'accès non autorisé, la perte ou
            l'altération. Cependant, aucun système de transmission sur Internet
            ou de stockage électronique n'est totalement sécurisé, et nous ne
            pouvons garantir une sécurité absolue.
          </p>

          <h2>
            8. Vos données sont-elles transférées en dehors de l’Union
            européenne ?
          </h2>
          <p>
            Nous ne transférons vos données en dehors de l'Union européenne que
            si nécessaire et de manière exceptionnelle. Nous nous assurons que
            les prestataires avec lesquels nous travaillons respectent les
            garanties appropriées pour protéger vos données.
          </p>

          <h2>
            9. Qui pouvez-vous contacter pour obtenir plus d’informations ?
          </h2>
          <p>
            Pour toute question relative à la manière dont nous traitons vos
            données personnelles, veuillez nous contacter à l'adresse{" "}
            <a className="underline" href="mailto:team.glepoint@gmail.com">
              team.glepoint@gmail.com
            </a>
            .
          </p>

          <h2>10. Comment pouvez-vous contacter la CNIL ?</h2>
          <p>
            Vous pouvez contacter la Commission nationale de l’informatique et
            des libertés (CNIL) pour toute question relative à la protection des
            données à l’adresse suivante : Service des plaintes de la CNIL, 3
            place de Fontenoy – TSA 80751, 75334 Paris Cedex 07, ou par
            téléphone au 01.53.73.22.22.
          </p>

          <h2>11. La politique peut-elle être modifiée ?</h2>
          <p>
            Nous pouvons modifier notre politique de confidentialité pour
            l'adapter aux nouvelles exigences légales ou à des changements dans
            notre manière de traiter les données. Les modifications seront
            publiées sur notre site et entreront en vigueur dès leur
            publication.
          </p>
          <p className="italic text-lg mt-8">
            Date de mise à jour : 18 Août 2024
          </p>
        </div>
      </div>
    </main>
  );
}

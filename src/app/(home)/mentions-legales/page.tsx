/* eslint-disable react/no-unescaped-entities */
export default function Legal() {
  return (
    <main className="isolate">
      <div className="pt-24 sm:pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 leading-8">
          <h1>Mentions légales</h1>
          <h2>Éditeur du Site :</h2>
          <p>G'Le Point</p>
          <p>
            Adresse :
            <a
              className="text-primary underline"
              href="https://maps.app.goo.gl/X8s1LXaSXdEzNGSi8"
            >
              6 Cr de Verdun Rambaud, 69002 Lyon
            </a>
          </p>

          <h2>Hébergeur :</h2>
          <p>Vercel</p>

          <h2>Responsable de la Publication :</h2>
          <p>G'Le Point</p>

          <h2>Contact :</h2>
          <p>
            Pour toute question ou demande d'information, vous pouvez nous
            contacter à l'adresse suivante :
            <a
              className="text-primary underline"
              href="mailto:team.glepoint@gmail.com"
            >
              team.glepoint@gmail.com
            </a>
          </p>

          <h2>Propriété Intellectuelle :</h2>
          <p>
            Le contenu du site G'Le Point, incluant mais non limité aux textes,
            images, graphismes, logos, et vidéos, est la propriété de l'équipe
            G'Le Point. Toute reproduction, distribution, modification,
            adaptation, retransmission ou publication, même partielle, de ces
            différents éléments est strictement interdite sans l'accord écrit
            préalable de G'Le Point.
          </p>
          <div className="flex flex-col gap-4">
            <h2>Conditions d'Utilisation :</h2>
            <p>
              L'utilisation du site G'Le Point implique l'acceptation pleine et
              entière des conditions générales d'utilisation décrites ci-après.
              Ces conditions sont susceptibles d'être modifiées ou complétées à
              tout moment, les utilisateurs du site G'Le Point sont donc invités
              à les consulter de manière régulière.
            </p>

            <p>
              Le site G'Le Point est accessible gratuitement à tout utilisateur
              disposant d'un accès à Internet. Tous les coûts liés à l'accès au
              service (matériel, logiciels, connexion Internet, etc.) sont à la
              charge de l'utilisateur.
            </p>

            <p>
              Les utilisateurs s'engagent à utiliser le site de manière conforme
              aux lois et règlements en vigueur, ainsi qu'à respecter les droits
              des tiers. Il est interdit d'utiliser le site à des fins illégales
              ou non autorisées.
            </p>

            <p>
              G'Le Point se réserve le droit de modifier, suspendre ou
              interrompre l'accès à tout ou partie du site, sans préavis et sans
              engager sa responsabilité.
            </p>

            <p>
              Tous les contenus présents sur le site, y compris les textes,
              images, graphismes, logos et vidéos, sont protégés par des droits
              de propriété intellectuelle. Toute reproduction, distribution,
              modification ou utilisation de ces contenus, sans l'accord écrit
              préalable de G'Le Point, est strictement interdite.
            </p>

            <p>
              En cas de non-respect de ces conditions d'utilisation, G'Le Point
              se réserve le droit de prendre toute mesure appropriée, y compris
              la suspension ou la suppression du compte de l'utilisateur
              concerné.
            </p>
          </div>
          <p className="bold text-lg mt-8">Date de mise à jour : 9 Août 2024</p>
        </div>
      </div>
    </main>
  );
}

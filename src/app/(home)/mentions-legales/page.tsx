/* eslint-disable react/no-unescaped-entities */
export default function Legal() {
  return (
    <main className="isolate mx-[20%]">
      <div className="pt-24 sm:pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 leading-8">
          <h1>Mentions légales</h1>
          <h2>Éditeur du Site :</h2>
          <p>G'Le Point</p>
          <p>
            Adresse :{" "}
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
            contacter à l'adresse suivante :{" "}
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
          <p className="bold text-lg mt-8">
            Date de mise à jour : 11 Août 2024
          </p>
        </div>
      </div>
    </main>
  );
}

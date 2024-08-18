import Image from "next/image";

/* eslint-disable react/no-unescaped-entities */
export default function Team() {
  const team = [
    {
      name: "Léo Corre",
      image: "/images/leo_corre.webp",
      linkedin: "https://www.linkedin.com/in/lcorre/",
      github: "https://github.com/Sozokujin",
    },
    {
      name: "Petru Oltean",
      image: "/images/petru_oltean.webp",
      linkedin: "https://www.linkedin.com/in/petru-oltean-7308a4171/",
      github: "https://github.com/oltean-petru",
    },
    {
      name: "Evan Marcel",
      image: "/images/evan_marcel.webp",
      linkedin: "https://www.linkedin.com/in/evan-marcel/",
      github: "https://github.com/DreamsEvz",
    },
    {
      name: "Kevin Blaise",
      image: "/images/kevin_blaise.webp",
      linkedin: "https://www.linkedin.com/in/k%C3%A9vin-blaise/",
      github: "https://github.com/Oui-Dev",
    },
  ];
  return (
    <main className="isolate flex justify-center items-center min-h-[100svh] w-full lg:-mt-14">
      <div className="w-full mx-auto max-w-7xl px-6 lg:px-8 leading-8">
        <h1 className="text-center mb-12">L'équipe G'Le Point</h1>
        <p className="text-center max-w-5xl mx-auto text-gray-700">
          Notre équipe de quatre étudiants passionnés a uni ses forces pour
          développer une solution innovante dans le cadre de notre projet de fin
          d'études. Ensemble, nous avons mis en commun nos compétences pour
          créer une application web qui vise à enrichir l'expérience de chacun
          en permettant une exploration plus approfondie et collaborative de
          notre environnement.
        </p>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-16 -mb-12 lg:mb-0">
          {team.map((member) => (
            <div
              key={member.name}
              className="flex flex-col items-center mb-20 lg:mb-0"
            >
              <Image
                className="rounded-full shadow-sm"
                src={member.image}
                alt={member.name}
                width={192}
                height={192}
              />
              <h2 className="mt-4">{member.name}</h2>
              <div className="flex gap-4 mt-2">
                <a
                  className="text-primary underline"
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src="/images/linkedin-icon.svg"
                    width={32}
                    height={32}
                    alt="Logo LinkedIn"
                  />
                </a>
                <a
                  className="text-primary underline"
                  href={member.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src="/images/github-icon.svg"
                    width={32}
                    height={32}
                    alt="Logo Github"
                  />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

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
    <main className="isolate">
      <div className="my-20 mx-auto max-w-7xl px-6 lg:px-8 leading-8">
        <h1 className="text-center mb-8">L'équipe G'Le Point</h1>
        <div className="flex flex-col md:flex-row justify-between items-center mt-24 -mb-24 md:mb-0">
          {team.map((member) => (
            <div
              key={member.name}
              className="flex flex-col items-center mb-20 md:mb-0"
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

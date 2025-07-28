/* eslint-disable @next/next/no-img-element */
//edit main page1
import createFeedback from "@/action/action";
import {Gamepad2, Gem, Rocket} from "lucide-react";
import Link from "next/link";

const games = [
  {
    name: "MINES",
    link: "/mines",
    logo: <Gem size={48}/>,
    img: "/assets/mines.png",
  },
  // {
  //   name: "PLINKO",
  //   link: "/plinko",
  //   logo: <Rocket size={48}/>,
  //   img: "/assets/plinko.png",
  // },
  {
    name: "DICE",
    link: "/dice",
    logo: <Rocket size={48}/>,
    img: "/assets/dice.png",
  },
  // {
  //   name: "LIMBO",
  //   link: "/limbo",
  //   logo: <Rocket size={48}/>,
  //   img: "/assets/limbo.avif",
  // },
];

export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center py-24 px-4 sm:px-6 lg:px-8"
      role="main"
      aria-label="Home page content"
    >
      <section
        className="w-full flex flex-col items-center text-center"
        aria-labelledby="welcome-heading">
        <h1
          id="welcome-heading"
          className="text-4xl sm:text-6xl font-bold mb-16 flex flex-col items-center justify-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 text-white">
            Welcome to <span className="text-blue-500">Stakers</span>
          </div>
        </h1>
      </section>

      <section className="p-6" aria-labelledby="games-heading">

        <div
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-4 w-full max-w-7xl mx-auto"
          role="list"
        >
          {games.map((game, index) => (
            <article
              key={index}
              role="listitem"
              aria-label={`${game.name} game card`}
              className="w-full"
            >
              <Link
                href={game.link}
                className="group relative flex flex-col items-center justify-center rounded-xl border border-gray-700 hover:border-success/50 transition-all duration-300 overflow-hidden h-48 sm:h-56 lg:h-64 w-full"
                aria-label={`Play ${game.name}`}
              >
                <div
                  className="absolute inset-0 transition-all duration-300"
                  aria-hidden="true"
                />
                <img
                  src={game.img || "/assets/coming-soon.png"}
                  srcSet={`${game.img || "/assets/coming-soon.png"} 200w,
                    ${game.img || "/assets/coming-soon.png"} 400w,
                    ${game.img || "/assets/coming-soon.png"} 600w`}
                  sizes="(max-width: 640px) 100vw,
                    (max-width: 768px) 50vw,
                    (max-width: 1024px) 33vw,
                    200px"
                  alt={`${game.name} game preview image`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300"
                />
                <div
                  className="absolute bottom-0 left-0 w-full h-1 bg-success/0 group-hover:bg-success/20 transition-all duration-300"
                  aria-hidden="true"
                />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <div className="text-white/40 text-3xl mt-12 ">
        new games coming soon...
      </div>
    </main>
  );
}

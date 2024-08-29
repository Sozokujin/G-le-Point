/* eslint-disable react/no-unescaped-entities */

"use client";

import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import { BorderBeam } from "@/components/magicui/border-beam";
import NumberTicker from "@/components/magicui/number-ticker";
import { cn } from "@/lib/utils";
import useMarkerStore from "@/stores/markerStore";
import { Marker } from "@/types";

export const StatsCard = () => {
  const markers: Marker[] = useMarkerStore((state) => state.markers);

  return (
    <div className="relative overflow-hidden mb-32 mt-12 w-full flex flex-col justify-center items-center bg-white border border-gray-200 rounded-lg shadow p-6">
      <h2>Statistiques</h2>
      <div className=" flex flex-col items-center justify-center lg:grid lg:grid-cols-2 gap-4 mt-8">
        <div className="text-center lg:h-24">
          <p className="text-lg">Nombre de points posés</p>
          <span className="whitespace-pre-wrap text-2xl font-bold tracking-tighter text-black">
            {markers.length !== 0 ? <NumberTicker value={markers.length} /> : 0}
          </span>
        </div>
        <div className="text-center lg:h-24">
          <p className="text-lg">Supers points restant // TODO</p>
          <span className="whitespace-pre-wrap text-2xl font-bold tracking-tighter text-black">
            {markers.length !== 0 ? <NumberTicker value={markers.length} /> : 0}
          </span>
          <a href="/">
            <div className="z-10 flex items-center justify-center">
              <AnimatedGradientText>
                🚀 <hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300" />{" "}
                <span
                  className={cn(`inline animate-gradient bg-gradient-to-r from-[#00a661] via-[#00ffb3] to-[#00994d] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent
`)}
                >
                  Acheter des super points
                </span>
              </AnimatedGradientText>
            </div>
          </a>
        </div>
        <div className="text-center lg:h-24">
          <p className="text-lg">Nombre de boussoles // TODO</p>
          <span className="whitespace-pre-wrap text-2xl font-bold tracking-tighter text-black">
            {markers.length !== 0 ? <NumberTicker value={markers.length} /> : 0}
          </span>
        </div>
        <div className="text-center lg:h-24">
          <p className="text-lg">Nombre de likes sur tes points // TODO</p>
          <span className="whitespace-pre-wrap text-2xl font-bold tracking-tighter text-black">
            {markers.length !== 0 ? <NumberTicker value={markers.length} /> : 0}
          </span>
        </div>
      </div>
      <BorderBeam
        size={800}
        duration={12}
        delay={36}
        colorFrom="#9FCF6D"
        colorTo="#7CC772"
      />
    </div>
  );
};

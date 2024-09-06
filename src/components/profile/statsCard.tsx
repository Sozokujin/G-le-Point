"use client";

import { BorderBeam } from "@/components/magicui/border-beam";
import NumberTicker from "@/components/magicui/number-ticker";
import useMarkerStore from "@/stores/markerStore";
import useUserStore from "@/stores/userStore";
import { useEffect } from "react";

export const StatsCard = () => {
  const markers = useMarkerStore((state) => state.userMarkers);
  const getMarkers = useMarkerStore((state) => state.getMarkers);
  const { user } = useUserStore();

  useEffect(() => {
    if (user) {
      const loadMarkers = async () => {
        await getMarkers(user.uid);
      };

      loadMarkers();
    }
  }, [getMarkers, user]);

  return (
    <div className="relative overflow-hidden mb-32 mt-12 w-full flex flex-col justify-center items-center bg-white border border-gray-200 rounded-lg shadow p-6">
      <h2>Statistiques</h2>
      <div className="flex flex-col items-center justify-center lg:grid lg:grid-cols-2 gap-4 mt-8">
        <div className="text-center lg:h-24">
          <p className="text-lg">Nombre de points posés</p>
          <span className="whitespace-pre-wrap text-2xl font-bold tracking-tighter text-black">
            {markers.length !== 0 ? <NumberTicker value={markers.length} /> : 0}
          </span>
        </div>
        <div className="text-center lg:h-24">
          <p className="text-lg">Supers points restant // TODO</p>
          <span className="whitespace-pre-wrap text-2xl font-bold tracking-tighter text-black">
            0 // TO DO
          </span>
        </div>
        <div className="text-center lg:h-24">
          <p className="text-lg">Nombre de boussoles // TODO</p>
          <span className="whitespace-pre-wrap text-2xl font-bold tracking-tighter text-black">
            0 // TO DO
          </span>
        </div>
        <div className="text-center lg:h-24">
          <p className="text-lg">Nombre de likes sur tes points // TODO</p>
          <span className="whitespace-pre-wrap text-2xl font-bold tracking-tighter text-black">
            0 // TO DO
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

import { FirebaseUser } from "@/types";
import Image from "next/image";

interface LeaderboardProps {
  players: FirebaseUser[];
}

export default function LeaderboardList({ players }: LeaderboardProps) {
  return (
    <div className="w-full max-w-[800px]">
      {players.map((player, index) => (
        <div
          key={index}
          className="flex items-center justify-between px-4 py-2 rounded-lg bg-slate-100"
        >
          <div className="flex flex-row items-center justify-between gap-6">
            <span className="text-gray-500">{index + 4}</span>
            <Image
              width={40}
              height={40}
              className="rounded-full ml-2"
              src={player.photoURL ?? ""}
              alt={player.username ?? ""}
            />
          </div>
          <p className="ml-2">{player.username ?? player.displayName}</p>

          <p>{player.score}</p>
        </div>
      ))}
    </div>
  );
}

import { FirebaseUser } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface LeaderboardProps {
    players: FirebaseUser[];
}

export default function LeaderboardList({ players }: LeaderboardProps) {
    if (players.length === 0) {
        return;
    }
    return (
        <div className="overflow-y-auto max-h-52 w-full max-w-[800px]">
            {players.map((player, index) => (
                <div key={index} className="flex items-center justify-between px-4 py-2 rounded-lg bg-slate-100 my-2">
                    <div className="flex flex-row items-center justify-between gap-6">
                        <span className="text-gray-500">{index + 4}</span>
                        <Avatar className="w-12 h-12 ring-2 ring-offset-2">
                            <AvatarImage src={player.photoURL ?? ''} alt={player.username ?? ''} />
                            <AvatarFallback>{player.username?.slice(0, 1) ?? player.displayName?.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                    </div>
                    <p className="ml-2">{player.username ?? player.displayName}</p>

                    <p>{player.score}</p>
                </div>
            ))}
        </div>
    );
}

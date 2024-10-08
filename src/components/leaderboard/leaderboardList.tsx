import { FirebaseUser } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useUserStore from '@/stores/userStore';

interface LeaderboardProps {
    players: FirebaseUser[];
}

export default function LeaderboardList({ players }: LeaderboardProps) {
    const { currentUser } = useUserStore();

    if (players.length === 0) return;

    return (
        <ol className="w-full h-full overflow-y-auto relative space-y-2">
            {players.map((player, index) => (
                <li
                    key={index}
                    id={player.uid}
                    className={`flex items-center justify-between px-4 py-2 rounded-lg ${
                        player.uid === currentUser?.uid
                            ? 'bg-glp-green text-white sticky top-0 bottom-0 z-50'
                            : 'bg-slate-100 text-gray-500'
                    }`}
                >
                    <div className="flex flex-row items-center justify-between gap-6">
                        <span>{index + 4}</span>
                        <Avatar className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ring-2 ring-offset-2">
                            <AvatarImage src={player.photoURL ?? ''} alt={player.username ?? ''} />
                            <AvatarFallback>{player.username?.slice(0, 1) ?? player.displayName?.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                    </div>
                    <p className="ml-2">{player.username ?? player.displayName}</p>
                    <p>{player.score}</p>
                </li>
            ))}
        </ol>
    );
}

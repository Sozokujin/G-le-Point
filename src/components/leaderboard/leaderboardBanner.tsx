import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FirebaseUser } from '@/types';
import NumberTicker from '../magicui/number-ticker';

const colors = ['bg-yellow-500', 'bg-slate-400', 'bg-amber-600'];
const sizes = ['h-72 md:h-64 w-36 md:w-48 pt-4', 'h-64 md:h-52 w-32 md:w-44 pt-4', 'h-64 md:h-52 w-32 md:w-44 pt-4'];
const positions = ['order-2', 'order-1', 'order-3'];
const bgColor = ['bg-slate-200', 'bg-slate-100', 'bg-slate-100'];
const rounded = ['rounded-t-xl', 'rounded-l-xl', 'rounded-r-xl'];

interface LeaderboardProps {
    players: FirebaseUser[];
}

//FIXME: This component is not fully responsive
export default function LeaderboardBanners({ players }: LeaderboardProps) {
    if (players.length === 0) {
        return <div>Pas de joueurs</div>;
    }

    return (
        <div className="w-full flex items-end justify-center p-8 rounded-lg">
            {players.map((player, index) => (
                <div key={index} className={`relative flex flex-col items-center ${positions[index]}`}>
                    <div
                        className={`${sizes[index]} ${bgColor[index]} ${rounded[index]} flex flex-col items-center justify-around relative`}
                    >
                        <Avatar
                            className={`${
                                index === 0
                                    ? 'w-16 h-16 ring-4 ring-yellow-500'
                                    : index === 1
                                      ? 'w-12 h-12 ring-2 ring-slate-400'
                                      : 'w-12 h-12 ring-2 ring-amber-600'
                            } ${colors[index]} ring-offset-2`}
                        >
                            <AvatarImage src={player.photoURL ?? ''} alt={player.username ?? ''} />
                            <AvatarFallback>{player.username?.slice(0, 1) ?? player.displayName?.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div className={`text-center ${index === 0 ? 'mb-20' : 'mb-20'} text-sm font-semibold text-gray-800`}>
                            <p className="pt-2">{player.username ?? player.displayName}</p>
                            <div
                                className={`mt-2 text-lg font-bold text-white ${colors[index]} px-2 py-1 rounded-xl w-fit mx-auto`}
                            >
                                {player.score > 0 ? <NumberTicker className="text-white" value={player.score} /> : <span>0</span>}
                            </div>
                        </div>
                        {index === 0 && (
                            <div className="absolute -top-10">
                                <span className="text-5xl">👑</span>
                            </div>
                        )}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                            <div
                                className={`flex items-center justify-center ${index === 0 ? 'text-5xl' : 'text-4xl'} font-bold`}
                            >
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

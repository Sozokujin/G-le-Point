import { FirebaseUser } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NumberTicker from '@/components/magicui/number-ticker';

const colors = ['bg-yellow-500', 'bg-slate-400', 'bg-amber-600'];

interface LeaderboardProps {
    players: FirebaseUser[];
}

export default function LeaderboardBanners({ players }: LeaderboardProps) {
    const getBannerClasses = (index: number) => {
        const common = 'flex flex-col gap-4 items-center justify-between relative pb-4';

        switch (index) {
            case 0:
                return common + ' basis-[36%] h-64 sm:h-72 order-2 bg-slate-200 rounded-t-xl pt-6';
            case 1:
                return common + ' basis-[32%] h-60 sm:h-64 order-1 bg-slate-100 rounded-l-xl pt-4';
            case 2:
                return common + ' basis-[32%] h-56 sm:h-60 order-3 bg-slate-100 rounded-r-xl pt-4';
            default:
                return '';
        }
    }

    const getAvatarClasses = (index: number) => {
        switch (index) {
            case 0:
                return `w-14 h-14 sm:w-16 sm:h-16 ring-4 ring-offset-2 ring-yellow-500 ${colors[index]}`;
            case 1:
                return `w-10 h-10 sm:w-12 sm:h-12 ring-2 ring-offset-2 ring-slate-400 ${colors[index]}`;
            case 2:
                return `w-10 h-10 sm:w-12 sm:h-12 ring-2 ring-offset-2 ring-amber-600 ${colors[index]}`;
            default:
                return '';
        }
    }
    
    if (players.length === 0) {
        return <div>Pas de joueurs</div>;
    }

    return (
        <div className="mx-auto w-full max-w-2xl flex gap items-end justify-center xs:px-4 sm:px-8 py-2 rounded-lg">
            {players.map((player, index) => (
                <div key={index} className={getBannerClasses(index)}>
                    <Avatar className={getAvatarClasses(index)}>
                        <AvatarImage src={player.photoURL ?? ''} alt={player.username ?? ''} />
                        <AvatarFallback>{player.username?.slice(0, 1) ?? player.displayName?.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <p className="leading-5 text-sm text-center font-semibold text-gray-800">
                        {player.username ?? player.displayName}
                    </p>
                    <div className={`text-base sm:text-lg font-bold text-white px-2 py-1 rounded-xl w-fit mx-auto ${colors[index]}`}>
                        {player.score > 0 ? <NumberTicker className="text-white" value={player.score} /> : <span>0</span>}
                    </div>
                    <span className={`block font-bold ${index === 0 ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'}`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                    {index === 0 && (
                        <div className="absolute -top-10">
                            <span className="text-5xl">👑</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

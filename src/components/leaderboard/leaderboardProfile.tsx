import useUserStore from '@/stores/userStore';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function LeaderboardProfile() {
    const { currentUser } = useUserStore();
    return (
        <div className="w-full rounded-xl max-w-[800px]">
            <div className="flex items-center justify-between px-4 py-2 rounded-lg bg-green-200 my-2">
                <div className="flex flex-row items-center justify-between gap-6">
                    <span className="text-gray-500">1</span>
                    <Avatar className="w-12 h-12 ring-2 ring-green-400 ring-offset-2">
                        <AvatarImage src={currentUser?.photoURL ?? ''} alt={currentUser?.username ?? ''} />
                        <AvatarFallback>
                            {currentUser?.username?.slice(0, 1) ?? currentUser?.displayName?.slice(0, 1)}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <p className="ml-2">{currentUser?.username ?? currentUser?.displayName}</p>
                <p>{currentUser?.score ?? 0}</p>
            </div>
        </div>
    );
}

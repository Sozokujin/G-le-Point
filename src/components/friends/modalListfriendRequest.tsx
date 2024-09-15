import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { acceptFriendRequest, declineFriendRequest } from '@/services/firebase/friends';
import { useFriendStore } from '@/stores/friendStore';
import useUserStore from '@/stores/userStore';
import { CheckIcon, XIcon } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

export const ModalListFriendRequest = () => {
    const { friendRequests, getFriendRequests } = useFriendStore();
    const user = useUserStore((state) => state.currentUser);

    useEffect(() => {
        if (!user) return;
        getFriendRequests(); // XXX: Always fetch friend requests (store bypass)
    }, [getFriendRequests, user]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="relative w-fit">
                    Demandes d&apos;amis
                    {friendRequests.length > 0 && (
                        <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2">
                            {friendRequests.length}
                        </div>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <VisuallyHidden.Root>
                    <DialogTitle> Demandes d&apos;amis</DialogTitle>
                </VisuallyHidden.Root>
                {friendRequests.length !== 0 ? (
                    <>
                        <h2 className="text-primary text-xl font-bold">Vos demandes d&apos;amis</h2>
                        <ul className="max-h-96 overflow-y-auto flex flex-col gap-3">
                            {friendRequests.map((friendRequest, key) => (
                                <FriendRequestLine key={key} friendRequest={friendRequest} />
                            ))}
                        </ul>
                    </>
                ) : (
                    <DialogHeader>
                        <h2 className="text-primary text-xl font-bold">Vous n&apos;avez pas de demandes d&apos;amis</h2>
                    </DialogHeader>
                )}
            </DialogContent>
        </Dialog>
    );
};

const FriendRequestLine = ({ friendRequest }: { friendRequest: any }) => {
    const { removeFriendRequest, getFriendRequests, addFriend } = useFriendStore();

    const handleAcceptFriendRequest = useCallback(
        async (uid: string) => {
            await acceptFriendRequest(uid);
            await getFriendRequests();
            removeFriendRequest(friendRequest.id);
            addFriend(friendRequest);
            toast("Demande d'ami acceptée");
        },
        [friendRequest, getFriendRequests, removeFriendRequest, addFriend]
    );

    const handleDeclineFriendRequest = useCallback(
        async (uid: string) => {
            await declineFriendRequest(uid);
            await getFriendRequests();
            removeFriendRequest(friendRequest.id);
            toast("Demande d'ami refusée");
        },
        [friendRequest, getFriendRequests, removeFriendRequest]
    );

    return (
        <li className="h-20 flex justify-between items-center gap-4 p-2 rounded cursor-pointer border border-transparent sm:hover:bg-slate-200">
            <div className="flex justify-center items-center gap-4">
                <Avatar className="h-9 w-9 flex">
                    <AvatarImage src={friendRequest.photoURL!} alt={`${friendRequest.username}'s avatar`} />
                    <AvatarFallback>{friendRequest.username?.slice(0, 1) || '??'}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none truncate">{friendRequest.username}</p>
                    <p className="text-sm text-muted-foreground truncate">{friendRequest.email}</p>
                </div>
            </div>
            <div className="flex gap-4">
                <Button onClick={() => handleAcceptFriendRequest(friendRequest.uid)} className="rounded-full p-2">
                    <CheckIcon />
                    <span className="sr-only">Accepter</span>
                </Button>
                <Button
                    onClick={() => handleDeclineFriendRequest(friendRequest.uid)}
                    variant={'secondary'}
                    className="rounded-full p-2"
                >
                    <XIcon />
                    <span className="sr-only">Refuser</span>
                </Button>
            </div>
        </li>
    );
};

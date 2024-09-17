import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckIcon, XIcon } from 'lucide-react';
import { useFriendStore } from '@/stores/friendStore';
import useUserStore from '@/stores/userStore';
import { FirebaseUser, FriendRequest } from '@/types';
import { acceptFriendRequest, declineFriendRequest } from '@/services/firebase/friends';
import { toast } from 'sonner';

interface FriendRequestLineProps {
    request: FriendRequest;
    onAccept: () => void;
    onDecline: () => void;
}

const FriendRequestLine = ({ request, onAccept, onDecline }: FriendRequestLineProps) => {
    const { users } = useUserStore();
    const [requestUser, setRequestUser] = useState<FirebaseUser | null>(null);

    useEffect(() => {
        const user = users.find((u) => u.uid === request.from);
        if (user) {
            setRequestUser(user);
        }
    }, [request.from, users]);

    if (!requestUser) {
        return <li className="h-20 flex items-center justify-center">Loading...</li>;
    }

    return (
        <li className="h-20 flex justify-between items-center gap-4 p-2 rounded cursor-pointer border border-transparent sm:hover:bg-slate-200">
            <div className="flex justify-center items-center gap-4">
                <Avatar className="h-9 w-9 flex">
                    <AvatarImage src={requestUser.photoURL || ''} alt={`${requestUser.username}'s avatar`} />
                    <AvatarFallback>{requestUser.username?.slice(0, 1) || '?'}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none truncate">{requestUser.username}</p>
                    <p className="text-sm text-muted-foreground truncate">{requestUser.email}</p>
                </div>
            </div>
            <div className="flex gap-4">
                <Button onClick={onAccept} className="rounded-full p-2 w-10 h-10">
                    <CheckIcon className="h-4 w-4" />
                    <span className="sr-only">Accepter</span>
                </Button>
                <Button onClick={onDecline} variant="secondary" className="rounded-full p-2 w-10 h-10">
                    <XIcon className="h-4 w-4" />
                    <span className="sr-only">Refuser</span>
                </Button>
            </div>
        </li>
    );
};

export const ModalListFriendRequest = () => {
    const { friendRequests, getFriendRequests, removeFriendRequest, addFriend } = useFriendStore();
    const { fetchUsersByIds, currentUser } = useUserStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            const fetchData = async () => {
                setIsLoading(true);
                await getFriendRequests();
                const userIds = friendRequests.map((request) => request.from);
                await fetchUsersByIds(userIds);
                setIsLoading(false);
            };
            fetchData();
        }
    }, [currentUser]);

    const handleAcceptFriendRequest = async (request: FriendRequest) => {
        console.log("request:", request);
        try {
            await acceptFriendRequest(request.from);
            removeFriendRequest(request.uid);
            const user = useUserStore.getState().users.find((u) => u.uid === request.from);
            if (user) {
                addFriend(user);
            }
            toast.success("Demande d'ami acceptée");
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l'acceptation de la demande d'ami");
        }
    };

    const handleDeclineFriendRequest = async (request: FriendRequest) => {
        try {
            await declineFriendRequest(request.from);
            removeFriendRequest(request.uid);
            toast.info("Demande d'ami refusée");
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors du refus de la demande d'ami");
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="relative">
                    Demandes d&apos;amis
                    {friendRequests.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {friendRequests.length}
                        </span>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Demandes d&apos;amis</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    {isLoading ? (
                        <p className="text-center text-muted-foreground">Chargement...</p>
                    ) : friendRequests.length > 0 ? (
                        <ul className="space-y-4 max-h-[60vh] overflow-y-auto">
                            {friendRequests.map((request) => (
                                <FriendRequestLine
                                    key={request.uid}
                                    request={request}
                                    onAccept={() => handleAcceptFriendRequest(request)}
                                    onDecline={() => handleDeclineFriendRequest(request)}
                                />
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-muted-foreground">Aucune demande d&apos;ami en attente</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlusIcon } from '@heroicons/react/24/solid';
import { sendFriendRequest } from '@/services/firebase/friends';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { useFriendStore } from '@/stores/friendStore';
import useUserStore from '@/stores/userStore';

export const ModalSendFriendRequest = () => {
    const { invitationCode, getInvitationCode } = useFriendStore();
    const { currentUser } = useUserStore();
    const [newFriendInvitationCode, setNewFriendInvitationCode] = useState<string | null>(null);

    useEffect(() => {
        if (!invitationCode && currentUser) {
            getInvitationCode();
        }
    });

    const handleSendFriendRequest = async () => {
        if (newFriendInvitationCode === invitationCode) {
            toast.error('Vous ne pouvez pas vous ajouter vous-même !');
            return;
        }

        await sendFriendRequest(newFriendInvitationCode)
            .then(() => {
                toast.success("Demande d'ami envoyée !");
            })
            .catch((e) => {
                toast.error(e.message);
            });
    };

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="px-0 w-10 h-10 rounded-full">
                        <UserPlusIcon className="h-5 w-5" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    {' '}
                    <VisuallyHidden.Root>
                        <DialogTitle> Ajouter un ami</DialogTitle>
                    </VisuallyHidden.Root>
                    <h2 className="text-primary text-xl font-bold">Ajouter un ami</h2>
                    <Input
                        onChange={(e) => setNewFriendInvitationCode(e.target.value)}
                        placeholder="Entrez le code d'invitation de votre ami"
                        id="invitationCode"
                        type="text"
                    />
                    <DialogClose asChild>
                        <Button onClick={() => handleSendFriendRequest()}>Envoyer la demande</Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        </>
    );
};

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { createGroup } from '@/services/firebase/groups';
import { useFriendStore } from '@/stores/friendStore';
import { FirebaseUser } from '@/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FriendLine } from '@/components/friends/friendList';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

export const ModalCreateGroup = () => {
    const { friends, getFriends } = useFriendStore();
    useEffect(() => {
        if (friends.length === 0) {
            getFriends();
        }
    }, [getFriends, friends.length]);

    const [selectedFriends, setSelectedFriends] = useState<FirebaseUser[]>([]); // Gère la sélection des amis
    const [groupName, setGroupName] = useState<string>('');
    const isButtonDisabled = groupName.trim() === '' || selectedFriends.length < 1;
    const toggleFriendSelection = (friend: FirebaseUser) => {
        setSelectedFriends((prevSelected) => {
            if (prevSelected.includes(friend)) {
                return prevSelected.filter((selected) => selected !== friend);
            } else {
                return [...prevSelected, friend];
            }
        });
    };

    useEffect(() => {}, [selectedFriends]);

    const createGroupHandler = async () => {
        const selectedFriendsUids = selectedFriends.map((friend) => {
            return friend.uid;
        });
        setSelectedFriends([]);
        setGroupName('');
        await createGroup(groupName, selectedFriendsUids);
        toast.success('Groupe créé !');
    };

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="px-0 w-10 h-10 rounded-full">
                        <PlusCircleIcon className="h-6 w-6" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <VisuallyHidden.Root>
                        <DialogTitle>Créer un groupe </DialogTitle>
                    </VisuallyHidden.Root>
                    <div className="flex flex-col gap-2">
                        <h2 className="text-primary text-xl font-bold">Créer un groupe</h2>
                        <Input
                            type="text"
                            placeholder="Nom du groupe"
                            className="input"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                        {groupName === '' && <p className="text-red-500 text-sm">Le nom du groupe ne peut pas être vide</p>}
                        <h3 className="text-primary text-lg font-bold">Sélectionner des amis</h3>
                        {selectedFriends.length === 0 && <p className="text-red-500 text-sm">Veuillez selectionner au moins un amis</p>}
                        <ul>
                            {friends.length !== 0 ? (
                                friends.map((friend, index) => (
                                    <FriendLine
                                        key={index}
                                        friend={friend}
                                        selected={selectedFriends.includes(friend)}
                                        onSelect={() => toggleFriendSelection(friend)}
                                    />
                                ))
                            ) : (
                                <p>Vous n&apos;avez pas encore d&apos;amis</p>
                            )}
                        </ul>

                        <DialogClose asChild>
                            <Button className="btn btn-primary" disabled={isButtonDisabled} onClick={() => createGroupHandler()}>
                                Créer
                            </Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

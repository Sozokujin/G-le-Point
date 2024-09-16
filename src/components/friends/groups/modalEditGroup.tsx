import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { updateGroupName, addUserToGroup } from '@/services/firebase/groups';
import { useFriendStore } from '@/stores/friendStore';
import { FirebaseUser, Group } from '@/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FriendLine } from '../friendList';
import { Edit } from 'lucide-react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useGroupStore } from '@/stores/groupStore';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

interface EditGroupModalProps {
    group: Group;
}

export const ModalEditGroup = ({ group }: EditGroupModalProps) => {
    const { friends, getFriends } = useFriendStore();
    const updateGroup = useGroupStore((state) => state.updateGroup);

    const [selectedFriends, setSelectedFriends] = useState<FirebaseUser[]>([]);
    const [members, setMembers] = useState<FirebaseUser[]>([]);
    const [groupName, setGroupName] = useState<string>(group.name);
    const [isOpen, setIsOpen] = useState(false);
    const isButtonDisabled = groupName.trim() === '' || groupName === group.name

    useEffect(() => {
        if (friends.length === 0) {
            getFriends();
        }
    }, [getFriends, friends.length]);

    useEffect(() => {
        const initialMembers = friends.filter((friend) => group.members.includes(friend.uid));
        setMembers(initialMembers);
    }, [group, friends]);

    const toggleFriendSelection = (friend: FirebaseUser) => {
        setSelectedFriends((prevSelected) => {
            if (prevSelected.includes(friend)) {
                return prevSelected.filter((selected) => selected !== friend);
            } else {
                return [...prevSelected, friend];
            }
        });
    };

    const updateGroupHandler = async () => {
        try {
            if (groupName !== group.name) {
                await updateGroupName(group.id, groupName);
            }

            for (const friend of selectedFriends) {
                if (!group.members.includes(friend.uid)) {
                    await addUserToGroup(group.id, friend.uid);
                }
            }

            const updatedMembers = Array.from(new Set([...group.members, ...selectedFriends.map((f) => f.uid)]));

            updateGroup(group.id, {
                name: groupName,
                members: updatedMembers
            });

            toast.success('Groupe mis à jour !');
            setIsOpen(false);
        } catch (error) {
            console.error('error:', error);
            toast.error('Erreur lors de la mise à jour du groupe');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier le groupe
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
                <VisuallyHidden.Root>
                    <DialogTitle> Modifier le groupe </DialogTitle>
                </VisuallyHidden.Root>
                <div className="flex flex-col gap-2">
                    <h2 className="text-primary text-xl font-bold">Modifier le groupe</h2>
                    <Input
                        type="text"
                        placeholder="Nom du groupe"
                        className="input"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                    {groupName === '' && <p className="text-red-500 text-sm">Le nom du groupe ne peut pas être vide</p>}
                    <h3 className="text-primary text-lg font-bold">Ajoutez des amis</h3>
                    <ul>
                        {friends.length !== 0 ? (
                            friends.map((friend, index) => (
                                <FriendLine
                                    key={index}
                                    friend={friend}
                                    selected={selectedFriends.includes(friend)}
                                    disabled={members.some((m) => m.uid === friend.uid)}
                                    onSelect={() => toggleFriendSelection(friend)}
                                />
                            ))
                        ) : (
                            <p>Vous n&apos;avez pas encore d&apos;amis</p>
                        )}
                    </ul>

                    <DialogClose asChild>
                        <Button className="btn btn-primary" disabled={isButtonDisabled} onClick={updateGroupHandler}>
                            Mettre à jour
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
};

import React, { useState } from 'react';
import { FirebaseUser } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Flag, Info, MoreHorizontal, UserMinus } from 'lucide-react';
import { cn } from '@/lib/utils';
import ConfirmationDialog from '../ui/confirmation-dialog';
import { unfriend } from '@/services/firebase/friends';
import { toast } from 'sonner';
import SeeProfileModal from '../modalSeeProfile';

interface FriendHeaderProps {
    friend: FirebaseUser;
    onFriendRemoved: () => void;
    className?: string;
}

export default function FriendHeader({ friend, onFriendRemoved, className }: FriendHeaderProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = async () => {
        try {
            await unfriend(friend.uid);
            onFriendRemoved();
            toast.success('Ami supprimé!');
        } catch (error) {
            console.error('error:', error);
            toast.error('Une erreur est survenue.');
        }
        setIsOpen(false);
    };

    const handleCancel = () => {
        setIsOpen(false);
    };

    return (
        <div className={cn('flex items-center justify-between p-4 bg-background rounded-lg shadow min-h-24', className)}>
            <div className="flex items-center space-x-4">
                <Avatar>
                    <AvatarImage src={friend.photoURL ?? ''} alt={friend.username ?? ''} />
                    <AvatarFallback>{friend.username?.slice(0, 1) ?? friend.email?.slice(0, 1) ?? '?'}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-lg font-semibold">{friend.username ?? friend.displayName ?? 'Sans Nom'}</h2>
                    <p className="text-sm text-muted-foreground">{friend.email}</p>
                </div>
            </div>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="default" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <SeeProfileModal
                        user={friend}
                        trigger={
                            <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                                <Info className="mr-2 h-4 w-4" />
                                Voir le profil
                            </DropdownMenuItem>
                        }
                    />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Flag className="mr-2 h-4 w-4" />
                        Signaler
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <ConfirmationDialog
                        trigger={
                            <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                                <UserMinus className="mr-2 h-4 w-4" />
                                Supprimer l&apos;ami
                            </DropdownMenuItem>
                        }
                        title="Etes-vous sûr(e)?"
                        description={`Voulez-vous vraiment supprimer ${friend.displayName ?? friend.username ?? 'cet ami'} de vos amis? Vous ne pourrez pas annuler cette action.`}
                        destructive
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                    />
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

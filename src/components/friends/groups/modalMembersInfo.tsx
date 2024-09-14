import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Crown, UserMinus } from 'lucide-react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { FirebaseUser } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import useUserStore from '@/stores/userStore';

interface MembersInfoModalProps {
    groupName: string;
    groupOwnerId: string;
    members: FirebaseUser[];
}

const MembersInfoModal: React.FC<MembersInfoModalProps> = ({ groupName, members, groupOwnerId }) => {
    const { currentUser } = useUserStore();
    const isCurrentUserOwner = currentUser?.uid === groupOwnerId;

    const handleKickMember = async (memberId: string) => {
        try {
            toast.success('Member kicked successfully');
        } catch (error) {
            toast.error('Failed to kick member');
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Users className="mr-2 h-4 w-4" />
                    Voir les membres
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader className="text-center pb-4 border-b flex-shrink-0">
                    <DialogTitle className="text-2xl font-semibold text-green-600">Membres de {groupName}</DialogTitle>
                    <p className="text-base text-gray-500 mt-2">{members.length} membres</p>
                </DialogHeader>
                <ScrollArea className="flex-grow mt-4 overflow-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                        {members.map((member) => (
                            <div
                                key={member.uid}
                                className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${member.uid === groupOwnerId ? 'bg-yellow-50 hover:bg-yellow-100' : 'bg-gray-50 hover:bg-gray-100'}`}
                            >
                                <Avatar className="h-16 w-16 border-2 border-green-200">
                                    <AvatarImage src={member.photoURL ?? ''} alt={member.username ?? ''} />
                                    <AvatarFallback className="bg-green-100 text-green-600 text-xl">
                                        {member.username?.charAt(0) ?? '?'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <p className="text-lg font-medium text-gray-900 truncate">
                                            {member.username ?? 'Sans nom'}
                                        </p>
                                        {member.uid === groupOwnerId && <Crown className="h-4 w-4 text-yellow-500" />}
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">{member.email}</p>
                                </div>
                                {isCurrentUserOwner && member.uid !== groupOwnerId && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleKickMember(member.uid)}
                                        className="ml-2"
                                    >
                                        <UserMinus className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default MembersInfoModal;

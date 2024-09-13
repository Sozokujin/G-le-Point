'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ClipboardDocumentIcon, MagnifyingGlassIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useFriendStore } from '@/stores/friendStore';
import useUserStore from '@/stores/userStore';
import { useIsMobile } from '@/utils/isMobile';
import { FirebaseUser } from '@/types/index';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ModalListFriendRequest } from '@/components/friends/modalListfriendRequest';
import { ModalSendFriendRequest } from '@/components/friends/modalSendFriendRequest';

interface FriendListProps {
    selectedFriend: FirebaseUser | null;
    setSelectedFriend?: (friend: FirebaseUser) => void;
}

export const FriendList = ({ selectedFriend, setSelectedFriend }: FriendListProps) => {
    const { isMobile, isPending } = useIsMobile();
    const { currentUser } = useUserStore();
    const { getFriends, friends, invitationCode, getInvitationCode, filteredFriends, setFilteredFriends } = useFriendStore();

    const [showPopupCopy, setShowPopupCopy] = useState(false);

    const selectFriend = (friend: FirebaseUser | null) => {
        if (!setSelectedFriend) return;

        setSelectedFriend(friend as FirebaseUser);
    };

    const handleSearchChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const searchQuery = event.target.value.toLowerCase();
            const filtered = friends.filter(
                (friend) =>
                    friend.displayName?.toLowerCase().includes(searchQuery) || friend.email?.toLowerCase().includes(searchQuery)
            );

            setFilteredFriends(filtered);
        },
        [friends, setFilteredFriends]
    );

    const copyToClipboard = useCallback(() => {
        if (!invitationCode) return;

        navigator.clipboard.writeText(invitationCode);
        setShowPopupCopy(true);
        setTimeout(() => setShowPopupCopy(false), 3000);
    }, [invitationCode]);

    useEffect(() => {
        if (!currentUser) return;

        getFriends();
        getInvitationCode();
    }, [currentUser, getFriends, getInvitationCode]);

    useEffect(() => {
        console.log('isMobile', isMobile);
        if (selectedFriend || friends.length === 0 || isMobile || isPending) return;

        selectFriend(friends[0]);
    }, [friends, selectedFriend, isMobile, isPending]);

    return (
        <Card className="relative p-5 flex flex-col gap-4 h-full overflow-y-auto">
            <div className="w-full flex justify-between">
                <p className="text-primary text-3xl font-bold">Mes amis</p>
                <ModalSendFriendRequest />
            </div>
            <div className="flex sm:flex-col-reverse justify-between gap-2 lg:items-center lg:flex-row">
                <div>
                    Mon code : <span className="text-glp-green font-bold">{invitationCode}</span>
                    {!showPopupCopy ? (
                        <ClipboardDocumentIcon
                            className="cursor-pointer ml-2 inline-block h-4 text-muted-foreground"
                            onClick={copyToClipboard}
                        />
                    ) : (
                        <CheckIcon className="cursor-pointer ml-2 inline-block h-4 text-glp-green" />
                    )}
                </div>
                <ModalListFriendRequest />
            </div>
            <Separator />
            <div className="relative w-full">
                <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Rechercher..."
                    className="w-full rounded-lg bg-background pl-8"
                    onChange={handleSearchChange}
                />
            </div>
            <section className="grow relative block">
                <ul className="flex flex-col gap-1 max-h-[calc(100%-56px)] overflow-y-auto">
                    {filteredFriends.length !== 0 ? (
                        filteredFriends.map((friend: FirebaseUser) => (
                            <FriendLine
                                key={friend.uid}
                                friend={friend}
                                selected={selectedFriend?.uid === friend.uid}
                                onSelect={() => selectFriend(friend)}
                            />
                        ))
                    ) : (
                        <div>
                            <p>Rien à afficher...</p>
                        </div>
                    )}
                </ul>
            </section>
        </Card>
    );
};

export const FriendLine = React.memo(
    ({ friend, selected, onSelect }: { friend: FirebaseUser; selected: boolean; onSelect: () => void }) => {
        return (
            <div
                onClick={onSelect}
                className={`flex items-center gap-4 p-2 rounded cursor-pointer border border-transparent sm:hover:bg-slate-200 ${
                    selected ? 'bg-slate-100' : ''
                }`}
            >
                <Avatar className="h-9 w-9 flex">
                    <AvatarImage src={friend.photoURL!} alt={`${friend.displayName}'s avatar`} />
                    <AvatarFallback>{friend.displayName?.slice(0, 1) || '??'}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none truncate">{friend.displayName}</p>
                    <p className="text-sm text-muted-foreground truncate">{friend.email}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full ml-auto">
                    POINT NBR
                </span>
            </div>
        );
    }
);

FriendLine.displayName = 'FriendLine'; // For ReactMemo

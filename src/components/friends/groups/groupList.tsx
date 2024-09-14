'use client';

import React, { useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useGroupStore } from '@/stores/groupStore';
import useUserStore from '@/stores/userStore';
import { useIsMobile } from '@/utils/isMobile';
import { FirebaseUser, Group } from '@/types/index';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import GroupAvatar, { AvatarUser } from '@/components/ui/group-avatar';
import { ModalCreateGroup } from '@/components/friends/groups/ModalCreateGroup';

interface GroupListProps {
    selectedGroup: Group | null;
    setSelectedGroup?: (group: Group) => void;
}

export const GroupList = ({ selectedGroup, setSelectedGroup }: GroupListProps) => {
    const { isMobile, isPending } = useIsMobile();
    const { groups, getGroups } = useGroupStore();
    const { users, fetchUsersByIds, currentUser } = useUserStore();

    const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
    const [groupUsers, setGroupUsers] = useState<{ [key: string]: AvatarUser[] }>({});

    const selectGroup = (group: Group | null) => {
        if (!setSelectedGroup) return;

        setSelectedGroup(group as Group);
    };

    const transformToAvatarUser = (user: FirebaseUser): AvatarUser => ({
        id: user.uid,
        name: user.displayName || user.email || 'Unknown User',
        image: user.photoURL
    });

    useEffect(() => {
        if (!currentUser) return;

        if (groups.length === 0) {
            getGroups();
        } else {
            setFilteredGroups(groups);
        }
    }, [groups, getGroups, currentUser]);

    useEffect(() => {
        if (selectedGroup || groups.length === 0 || isMobile || isPending) return;

        selectGroup(groups[0]);
    }, [groups, selectedGroup, isMobile, isPending]);

    useEffect(() => {
        const groupMembersIds = groups.reduce((acc, group) => [...acc, ...group.members], [] as string[]);
        fetchUsersByIds(groupMembersIds);
    }, [groups, fetchUsersByIds]);

    useEffect(() => {
        if (!users) return;

        const newGroupUsers = groups.reduce(
            (acc, group) => {
                acc[group.id] = group.members
                    .map((memberId) => users.find((user) => user.uid === memberId))
                    .filter((user): user is FirebaseUser => user !== undefined)
                    .map(transformToAvatarUser);
                return acc;
            },
            {} as { [key: string]: AvatarUser[] }
        );

        setGroupUsers((prevGroupUsers) => {
            if (JSON.stringify(prevGroupUsers) !== JSON.stringify(newGroupUsers)) {
                return newGroupUsers;
            }
            return prevGroupUsers;
        });
    }, [groups, users]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchQuery = event.target.value.toLowerCase();
        if (searchQuery === '') {
            setFilteredGroups(groups);
        } else {
            setFilteredGroups(groups.filter((group) => group.name.toLowerCase().includes(searchQuery)));
        }
    };

    return (
        <Card className="relative p-5 flex flex-col gap-4 h-full overflow-y-auto">
            <div className="w-full flex justify-between">
                <p className="text-primary text-3xl font-bold">Mes Groupes</p>
                <ModalCreateGroup />
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
                    {filteredGroups.length !== 0 ? (
                        filteredGroups.map((group) => (
                            <GroupLine
                                key={group.id}
                                group={group}
                                groupUsers={groupUsers[group.id] || []}
                                selected={selectedGroup?.id === group.id}
                                onSelect={() => selectGroup(group)}
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

interface GroupLineProps {
    group: Group;
    groupUsers: AvatarUser[];
    selected: boolean;
    onSelect?: () => void;
}
export const GroupLine = React.memo(({ group, groupUsers, selected, onSelect }: GroupLineProps) => {
    return (
        <div
            className={`flex items-center gap-4 p-2 rounded cursor-pointer border border-transparent sm:hover:bg-slate-200 ${
                selected ? 'bg-slate-100' : ''
            }`}
            onClick={onSelect}
        >
            <GroupAvatar users={groupUsers} size="sm" />
            <div className="grid gap-1">
                <p className="text-sm font-medium leading-none truncate">{group.name || 'Groupe sans nom'}</p>
                <p className="text-xs text-muted-foreground truncate">{groupUsers.length} Membres</p>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full ml-auto">
                POINT NBR
            </span>
        </div>
    );
});

GroupLine.displayName = 'GroupLine';

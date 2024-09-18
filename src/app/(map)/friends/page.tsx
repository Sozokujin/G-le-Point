'use client';

import { useEffect, useState } from 'react';
import { useIsMobile } from '@/utils/isMobile';
import { Group, Marker, FirebaseUser } from '@/types/index';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { getUserMarkers, getGroupMarkers } from '@/services/firebase/markers';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { MarkersList } from '@/components/marker/markersList';
import { FriendList } from '@/components/friends/friendList';
import FriendHeader from '@/components/friends/friend-header';
import { GroupList } from '@/components/friends/groups/groupList';
import GroupHeader from '@/components/friends/groups/group-header';
import { useGroupStore } from '@/stores/groupStore';

const Friends = () => {
    const { isMobile } = useIsMobile();
    const [selectedFriend, setSelectedFriend] = useState<FirebaseUser | null>(null);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [displayMarkers, setDisplayMarkers] = useState<Marker[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const groups = useGroupStore((state) => state.groups);
    const selectedGroup = groups.find((g) => g.id === selectedGroupId) || null;

    useEffect(() => {
        if (selectedGroupId) {
            const updatedGroup = groups.find((g) => g.id === selectedGroupId);
            if (updatedGroup) {
                setSelectedGroupId(updatedGroup.id);
                updateGroupMarkers(updatedGroup);
            }
        }
    }, [groups, selectedGroupId]);

    useEffect(() => {
        if (!selectedFriend) {
            setDisplayMarkers([]);
        }
    } , [selectedFriend]);

    const handleSelectedFriendChange = async (friend: FirebaseUser) => {
        setDisplayMarkers([]);
        setSelectedGroupId(null);
        setSelectedFriend(friend);
        setDisplayMarkers(friend ? await getUserMarkers(friend.uid) : []);
        setDrawerOpen(true);
    };

    const handleSelectedGroupChange = async (group: Group) => {
        setDisplayMarkers([]);
        setSelectedFriend(null);
        setSelectedGroupId(group.id);
        updateGroupMarkers(group);
        setDrawerOpen(true);
    };

    const updateGroupMarkers = async (group: Group) => {
        setDisplayMarkers(group ? await getGroupMarkers(group.id) : []);
    };

    const closeDrawer = () => {
        setDisplayMarkers([]);
        setDrawerOpen(false);
        setSelectedFriend(null);
        setSelectedGroupId(null);
    };

    const handleFriendRemoved = () => {
        setSelectedFriend(null);
    };

    const handleGroupRemoved = () => {
        setSelectedGroupId(null);
    };

    return (
        <div className="h-svh bg-muted p-2 sm:p-4 flex gap-2">
            <section className="sm:w-5/12 w-full">
                <Tabs onValueChange={closeDrawer} defaultValue="friends" className="w-full h-full flex flex-col">
                    <Card className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-slate-200">
                            <TabsTrigger value="friends">Amis</TabsTrigger>
                            <TabsTrigger value="groups">Groupes</TabsTrigger>
                        </TabsList>
                    </Card>
                    <TabsContent className="grow" value="friends">
                        <FriendList selectedFriend={selectedFriend} setSelectedFriend={handleSelectedFriendChange} />
                    </TabsContent>
                    <TabsContent className="grow" value="groups">
                        <GroupList selectedGroup={selectedGroup} setSelectedGroup={handleSelectedGroupChange} />
                    </TabsContent>
                </Tabs>
            </section>
            {isMobile ? (
                <Drawer open={drawerOpen} onClose={closeDrawer}>
                    {/* DO NOT REMOVE VisuallyHidden, NEEDED FOR SCREEN READER */}
                    <VisuallyHidden.Root>
                        <DrawerTitle>Friends list</DrawerTitle>
                        <DrawerDescription>List of your friends</DrawerDescription>
                    </VisuallyHidden.Root>
                    <DrawerContent className="h-[90%] p-4">
                        {selectedFriend && (
                            <FriendHeader
                                className="my-4 bg-slate-100"
                                friend={selectedFriend}
                                onFriendRemoved={handleFriendRemoved}
                            />
                        )}
                        {selectedGroup && (
                            <GroupHeader className="m-4 bg-slate-100" group={selectedGroup} onGroupRemoved={handleGroupRemoved} />
                        )}
                        <MarkersList markers={displayMarkers} showUser={!!selectedGroup} />
                    </DrawerContent>
                </Drawer>
            ) : (
                <section className="sm:w-7/12 sm:flex flex-col hidden bg-white rounded shadow p-2">
                    {selectedFriend && (
                        <FriendHeader
                            className="mb-4 bg-slate-100"
                            friend={selectedFriend}
                            onFriendRemoved={handleFriendRemoved}
                        />
                    )}
                    {selectedGroup && (
                        <GroupHeader className="mb-4 bg-slate-100" group={selectedGroup} onGroupRemoved={handleGroupRemoved} />
                    )}
                    <div className="flex grow overflow-y-auto mb-[4.5rem]">
                        <MarkersList markers={displayMarkers} showUser={!!selectedGroup} />
                    </div>
                </section>
            )}
        </div>
    );
};

export default Friends;

'use client';

import { useState } from 'react';
import { useIsMobile } from '@/utils/isMobile';
// import markerStore from '@/stores/markerStore';
import { Group, Marker, FirebaseUser } from '@/types/index';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { getUserMarkers, getGroupMarkers } from '@/services/firebase/markers';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { MarkerList } from '@/components/marker/marker-list';
import { FriendList } from '@/components/friends/friendList';
import FriendHeader from '@/components/friends/friend-header';
import { GroupList } from '@/components/friends/groups/groupList';
import GroupHeader from '@/components/friends/groups/group-header';

const Friends = () => {
    const { isMobile } = useIsMobile();
    // const { friendsMarkers, getFriendsMarkers, groupMarkers, getGroupMarkers } = markerStore(); //FIXME: REFACTO MARKERSTORE !!!!!!
    const [selectedFriend, setSelectedFriend] = useState<FirebaseUser | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [displayMarkers, setDisplayMarkers] = useState<Marker[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleSelectedFriendChange = async (friend: FirebaseUser) => {
        setDisplayMarkers([]);
        setSelectedGroup(null);
        setSelectedFriend(friend);
        setDisplayMarkers(friend ? await getUserMarkers(friend.uid) : []);
        setDrawerOpen(true);
    };

    const handleSelectedGroupChange = async (group: Group) => {
        setDisplayMarkers([]);
        setSelectedFriend(null);
        setSelectedGroup(group);
        setDisplayMarkers(group ? await getGroupMarkers(group.id) : []);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setSelectedFriend(null);
        setSelectedGroup(null);
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
                    <DrawerContent className="h-[90%]">
                        {selectedFriend && (
                            <FriendHeader
                                className="m-4 bg-slate-100"
                                friendId={selectedFriend?.uid}
                                name={selectedFriend?.displayName}
                                email={selectedFriend?.email}
                                photoUrl={selectedFriend?.photoURL}
                            />
                        )}
                        {selectedGroup && <GroupHeader className="m-4 bg-slate-100" group={selectedGroup} />}
                        <MarkerList markers={displayMarkers} showUser={!!selectedGroup} />
                    </DrawerContent>
                </Drawer>
            ) : (
                <section className="sm:w-7/12 sm:flex flex-col hidden bg-white rounded shadow p-2">
                    {selectedFriend && (
                        <FriendHeader
                            friendId={selectedFriend?.uid}
                            className="mb-4 bg-slate-100"
                            name={selectedFriend?.displayName}
                            email={selectedFriend?.email}
                            photoUrl={selectedFriend?.photoURL}
                        />
                    )}
                    {selectedGroup && <GroupHeader className="mb-4 bg-slate-100" group={selectedGroup} />}
                    <div className="flex grow overflow-y-auto mb-[4.5rem]">
                        <MarkerList markers={displayMarkers} showUser={!!selectedGroup} />
                    </div>
                </section>
            )}
        </div>
    );
};

export default Friends;

"use client";

import { FriendList } from "@/components/friends/friendList";
import { GroupList } from "@/components/friends/groups/groupList";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Group, Marker } from "@/types/index";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import useIsMobile from "@/utils/isMobile";
import { FirebaseUser } from "@/types";
import { useState } from "react";
import markerStore from "@/stores/markerStore";
import { getUserMarkers, getGroupMarkers } from "@/services/firebase/markers";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { MarkerList } from "@/components/marker/marker-list";
import FriendHeader from "@/components/friends/friend-header";
import GroupHeader from "@/components/friends/groups/group-header";

const Friends = () => {
  const isMobile = useIsMobile();
  // const { friendsMarkers, getFriendsMarkers, groupMarkers, getGroupMarkers } = markerStore(); //FIXME: REFACTO MARKERSTORE !!!!!!
  const [selectedFriend, setSelectedFriend] = useState<FirebaseUser | null>(
    null
  );
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [displayMarkers, setDisplayMarkers] = useState<Marker[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const handleSelectedFriendChange = async (friend: FirebaseUser) => {
    setDisplayMarkers([]);
    setSelectedGroup(null);
    setSelectedFriend(friend);
    setDisplayMarkers(await getUserMarkers(friend.uid));
    if (isInitialLoad) {
      // je trouve pas mieux
      setIsInitialLoad(false);
      return;
    }
    setDrawerOpen(true);
  };

  const handleSelectedGroupChange = async (group: Group) => {
    setDisplayMarkers([]);
    setSelectedFriend(null);
    setSelectedGroup(group);
    setDisplayMarkers(await getGroupMarkers(group.id));
    setDrawerOpen(true);
  };

  const resetDrawerState = () => {
    setDrawerOpen(false);
    setIsInitialLoad(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <div className="w-full h-full flex gap-2 p-2 bg-muted">
      <section className="sm:w-5/12 w-full h-full">
        <Tabs
          defaultValue="friends"
          className="w-full h-full flex flex-col"
          onValueChange={() => resetDrawerState()}
        >
          <Card className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-200">
              <TabsTrigger value="friends">Amis</TabsTrigger>
              <TabsTrigger value="groups">Groupes</TabsTrigger>
            </TabsList>
          </Card>
          <TabsContent className="grow" value="friends">
            <FriendList onSelectedFriendChange={handleSelectedFriendChange} />
          </TabsContent>
          <TabsContent className="grow" value="groups">
            <GroupList onSelectGroupChange={handleSelectedGroupChange} />
          </TabsContent>
        </Tabs>
      </section>
      {isMobile ? (
        <Drawer open={drawerOpen} onClose={handleCloseDrawer}>
          {/* DO NOT REMOVE VisuallyHidden, NEEDED FOR SR */}
          <VisuallyHidden.Root>
            <DrawerTitle>Friends list</DrawerTitle>
            <DrawerDescription>List of your friends</DrawerDescription>
          </VisuallyHidden.Root>
          <DrawerContent className="h-[90%]">
            {selectedFriend && (
              <FriendHeader
                className="m-4 bg-slate-100"
                name={selectedFriend?.displayName}
                email={selectedFriend?.email}
                photoUrl={selectedFriend?.photoURL}
              />
            )}
            {selectedGroup && (
              <GroupHeader className="m-4 bg-slate-100" group={selectedGroup} />
            )}
            <MarkerList markers={displayMarkers} showUser={!!selectedGroup} />
          </DrawerContent>
        </Drawer>
      ) : (
        <section className="sm:w-7/12 sm:flex flex-col hidden h-full bg-white rounded shadow p-2">
          {selectedFriend && (
            <FriendHeader
              className="mb-4 bg-slate-100"
              name={selectedFriend?.displayName}
              email={selectedFriend?.email}
              photoUrl={selectedFriend?.photoURL}
            />
          )}
          {selectedGroup && (
            <GroupHeader className="mb-4 bg-slate-100" group={selectedGroup} />
          )}
          <div className="flex grow overflow-y-auto mb-[4.5rem]">
            <MarkerList markers={displayMarkers} showUser={!!selectedGroup} />
          </div>
        </section>
      )}
    </div>
  );
};

export default Friends;

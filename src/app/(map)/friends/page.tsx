"use client";

import { FriendList } from "@/components/friends/friendList";
import { GroupList } from "@/components/friends/groups/groupList";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Marker } from "@/types/index";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import useIsMobile from "@/utils/isMobile";
import { FirebaseUser } from "@/types";
import { useState } from "react";
import { getFriendsMarkers, getMarkers } from "@/services/firebase/markers";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

const Friends = () => {
  const isMobile = useIsMobile();
  const [selectedFriend, setSelectedFriend] = useState<FirebaseUser | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [displayMarkers, setDisplayMarkers] = useState<Marker[]>([]);

  const handleSelectedFriendChange = async (friend: FirebaseUser) => {
    setDisplayMarkers([]);
    setSelectedFriend(friend);
    setDisplayMarkers(await getMarkers(friend.uid));
    console.log(displayMarkers);
    console.log(friend);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <div className="w-full h-full flex gap-2 p-2 bg-muted">
      <section className="sm:w-5/12 w-full h-full">
        <Tabs defaultValue="friends" className="w-full h-full flex flex-col">
          <Card className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-200">
              <TabsTrigger value="friends">Amis</TabsTrigger>
              <TabsTrigger value="groups">Groupes</TabsTrigger>
            </TabsList>
          </Card>
          <TabsContent className="grow" value="friends">
            <FriendList onSelectedFriendChange={handleSelectedFriendChange} />
          </TabsContent>
          <TabsContent value="groups">
            <GroupList />
          </TabsContent>
        </Tabs>
      </section>
      {isMobile ? (
        <Drawer open={drawerOpen} onClose={handleCloseDrawer}>
          <VisuallyHidden.Root>
            <DrawerTitle>
              Friends list
            </DrawerTitle>
            <DrawerDescription>
              List of your friends
            </DrawerDescription>
          </VisuallyHidden.Root>
          <DrawerContent className="h-[90%]">
            {selectedFriend?.displayName}
            {displayMarkers.map((marker) => (
              <div key={marker.id}>{marker.name}</div>
            ))}
          </DrawerContent>
        </Drawer>
      ) : (
        <section className="sm:w-7/12 sm:block hidden h-full bg-white rounded shadow">
          {selectedFriend?.displayName}
          {displayMarkers.map((marker) => (
            <div key={marker.id}>{marker.name}</div>
          ))}
        </section>
      )}
    </div>
  );
};

export default Friends;

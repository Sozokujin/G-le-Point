"use client";

import { FriendList } from "@/components/friends/friendList";
import { GroupList } from "@/components/friends/groups/groupList";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import useIsMobile from "@/utils/isMobile";
import { FirebaseUser } from "@/types";
import { useState } from "react";

const Friends = () => {
  const isMobile = useIsMobile();
  const [selectedFriend, setSelectedFriend] = useState<FirebaseUser | null>(null);
  const handleSelectedFriendChange = (friend: FirebaseUser | null) => {
    setSelectedFriend(friend);
  };
  return (
    <div className="w-full h-full flex gap-2 p-2 bg-muted">
      <section className="sm:w-5/12 w-full h-full">
        <Tabs defaultValue="friends" className="w-full h-full flex flex-col">
          <Card className="w-full">
            <TabsList className="grid w-full grid-cols-2">
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
        <Drawer>
          <DrawerContent className="h-[90%]"></DrawerContent>
        </Drawer>
      ) : (
        <section className="sm:w-7/12 sm:block hidden h-full bg-white rounded shadow">
          LISTE DES POINTS ICI
        </section>
      )}
    </div>
  );
};

export default Friends;

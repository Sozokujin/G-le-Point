"use client";

import { FriendList } from "@/components/friends/friendList";
import { GroupList } from "@/components/friends/groups/groupList";
import { Card } from "@/components/ui/card";

const Friends = () => {
  return (
    <div className="w-full h-full flex gap-2 p-2 bg-muted">
      <section className="sm:w-5/12 w-full h-full">
        <Card className="h-full">
          <FriendList />
        </Card>
      </section>
      <section className="sm:w-7/12 sm:block hidden h-full bg-white rounded shadow"> LISTE DES POINTS ICI</section>
    </div>
  );
};

export default Friends;

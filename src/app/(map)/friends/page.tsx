"use client";

import { FriendList } from "@/components/friends/friendList";
import { GroupList } from "@/components/friends/groups/groupList";

const Friends = () => {
  return (
    <>
      <GroupList/>
      <FriendList />
    </>
  );
};

export default Friends;

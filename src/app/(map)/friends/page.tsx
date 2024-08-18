"use client";

import { redirectTo } from "@/lib/actions";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";
import { FriendList } from "@/components/friends/friendList";
import { GroupList } from "@/components/friends/groups/groupList";

const Friends = () => {
  const { isAuthenticated } = useAuthStore();


  useEffect(() => {
    if (!isAuthenticated) {
      redirectTo("/login");
    }
  }, [isAuthenticated]);


  return (
    <>
    <GroupList/>
    <FriendList />
    </>
  );
};

export default Friends;

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
    <div className="w-full h-full flex">
      <section className="md:w-5/12 w-full h-full bg-blue-400">
        <FriendList />
      </section>
      <section className="md:w-7/12 h-full bg-red-400">

      </section>
    </div>
  );
};

export default Friends;

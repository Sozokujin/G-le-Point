"use client";

import { redirectTo } from "@/lib/actions";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";
import { FriendList } from "@/components/friends/friendList";
import { FriendRequest } from "@/components/friends/friendRequest";

const Friends = () => {
  const { isAuthenticated } = useAuthStore();

  const [displayFriend, setDisplayFriend] = useState<string>("friendList");


  useEffect(() => {
    if (!isAuthenticated) {
      redirectTo("/login");
    }
  }, [isAuthenticated]);


  return (
    <div>
      <div className="w-full h-24 border-b-2 border-green-500 flex flex-row">
        <div onClick={() => setDisplayFriend("friendList") } className="flex justify-center items-center h-full px-4 w-1/2">
          Amis & groupes
        </div>
        <div onClick={() => setDisplayFriend("friendRequest")} className="flex justify-center items-center h-full px-4 w-1/2">
          Ajouter un ami
        </div>
        
      </div>
      <div>
        {displayFriend === "friendList" ? (
          <FriendList />
        ) : (
          <FriendRequest />
        )
          }
      </div>
    </div>
  );
};

export default Friends;

"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirectTo } from "@/lib/actions";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";

import { getAllFriends, sendFriendRequest } from "@/services/firebase/friends";

const Friends = () => {
  const { isAuthenticated } = useAuthStore();

  const [friends, setFriends] = useState<any[]>([]);
  const [invitationCode, setInvitationCode] = useState('');

  const handleSendFriendRequest = async (event: any) => {
    event.preventDefault();
      await sendFriendRequest(invitationCode);
      setInvitationCode('');
  };

  useEffect(() => {
    if (!isAuthenticated) {
      redirectTo("/login");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchFriends = async () => {
      const friends = await getAllFriends();
      setFriends(friends);
    };

    fetchFriends();
  }, []);


  return (
    <div>
      <Label htmlFor="invitationCode">Code d&apos;invitation</Label>
      <form onSubmit={handleSendFriendRequest}>
        <Input type="text" id="invitationCode" value={invitationCode} onChange={(e) => setInvitationCode(e.target.value)} placeholder="Entrez un code d'invitation" />
        <Button type="submit">Envoyer une demande d&apos;amitié</Button>
      </form>

      <div>
        <h2>Mes amis</h2>
        <ul>
          {friends.length !== 0 ? (
            friends.map((friend, key) => {
              return <li key={key}>{friend.displayName}</li>;
            })
          ) : (
            <div>
              <p>Vous n&apos;avez pas encore d&apos;amis</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Friends;

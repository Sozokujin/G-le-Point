"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/db/firebase";
import { redirectTo } from "@/lib/actions";
import { useAuthStore } from "@/stores/authStore";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

const Friends = () => {
  const { isAuthenticated, user } = useAuthStore();

  const [friends, setFriends] = useState<any[]>([]);

  const invitationCodeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      redirectTo("/login");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    getAllFriends();
  }, []);

  const getAllFriends = async () => {
    const currentUser = useAuthStore.getState().user;
    const usersCollectionRef = collection(db, "users");
    const q = query(usersCollectionRef, where("uid", "==", currentUser?.uid));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return alert("Utilisateur introuvable");
    }

    const friendsUid = querySnapshot.docs[0].data().friends;
    if (friendsUid.length === 0) {
      return;
    }
    const q2 = query(usersCollectionRef, where("uid", "in", friendsUid));
    const querySnapshot2 = await getDocs(q2);
    const friends = querySnapshot2.docs.map((doc) => doc.data());
    setFriends(friends);
  };

  const sendFriendRequest = async () => {
    const invitationCode = invitationCodeRef.current?.value;

    if (!invitationCode) {
      return alert("Veuillez renseigner un code d'invitation");
    }

    const usersCollectionRef = collection(db, "users");
    const q = query(
      usersCollectionRef,
      where("invitationCode", "==", invitationCode)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return alert("Code d'invitation invalide");
    }

    const currentUser = useAuthStore.getState().user;
    const userDocRef = doc(db, "users", querySnapshot.docs[0].id);

    const friends = querySnapshot.docs[0].data().friends
      ? querySnapshot.docs[0].data().friends
      : [];
    if (!friends.includes(currentUser?.uid)) {
      friends.push(currentUser?.uid);
      await updateDoc(userDocRef, {
        friends: friends,
      });
    }
  };

  return (
    <div>
      <Card className="p-4 flex flex-col gap-4">
        <Label htmlFor="invitationCode">Code d&apos;invitation</Label>
        <Input
          ref={invitationCodeRef}
          placeholder="Entrez le code d'invitation d'un ami"
          id="invitationCode"
          type="text"
        />
        <Button onClick={sendFriendRequest}>Envoyer la demande</Button>

        <span>Mon code : {}</span>
      </Card>

      <div>
        <h2 className="text-primary text-xl font-bold px-2 py-4">Vos amis</h2>
        <ul className="flex gap-3">
          {friends.length !== 0 ? (
            friends.map((friend, key) => {
              return (
                <li
                  className="h-24 w-full border-primary border-y-2 p-2 rounded-sm"
                  key={key}
                >
                  <span className="text-primary font-semibold">
                    {friend.displayName}
                  </span>
                </li>
              );
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

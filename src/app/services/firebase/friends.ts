import { db } from "@/app/services/firebase/config";

import {
  useAuthStore,
} from "@/app/stores/authStore";

import {  collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

export const getAllFriends = async () => {
    try {
      const currentUser = useAuthStore.getState().user;
      const usersCollectionRef = collection(db, "users");
      const q = query(usersCollectionRef, where("uid", "==", currentUser?.uid));
  
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        alert("Utilisateur introuvable");
        return [];
      }
  
      const friendsUid = querySnapshot.docs[0].data().friends;
      if (friendsUid.length === 0) {
        return [];
      }
      const q2 = query(usersCollectionRef, where("uid", "in", friendsUid));
      const querySnapshot2 = await getDocs(q2);
      
      const friends = querySnapshot2.docs.map((doc) => doc.data());
      return friends;
    } catch (error) {
      console.error('Error fetching friends:', error);
      return [];
    }
  };

export const sendFriendRequest = async (invitationCode: string | undefined) => {
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




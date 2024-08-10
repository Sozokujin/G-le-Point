import { db } from "@/services/firebase/config";

import {
  useAuthStore,
} from "@/stores/authStore";

import {  collection, getDocs, query, where, addDoc, doc } from "firebase/firestore";

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
      console.log(friends);
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

    const friendRequest = collection(db, "friendRequests");
    await addDoc(friendRequest, {
      from: currentUser?.uid,
      to: querySnapshot.docs[0].data().uid,
      status: "pending",
    });
  };

export const getFriendRequests = async () => {
    const currentUser = useAuthStore.getState().user;
    const friendRequestsCollectionRef = collection(db, "friendRequests");
    const q = query(friendRequestsCollectionRef, where("to", "==", currentUser?.uid), where("status", "==", "pending"));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return [];
    }

    return querySnapshot.docs.map((doc) => doc.data());
};


export const getInvitationCode = async () => {
    const currentUser = useAuthStore.getState().user;
    const usersCollectionRef = collection(db, "users");
    const q = query(usersCollectionRef, where("uid", "==", currentUser?.uid));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return alert("Utilisateur introuvable");
    }

    return querySnapshot.docs[0].data().invitationCode;
  };





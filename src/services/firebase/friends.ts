import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  updateDoc,
  arrayUnion
} from "firebase/firestore";
import { db } from "@/services/firebase/config";
import useUserStore from "@/stores/userStore";
export const getAllFriends = async () => {
  try {
    const currentUser = useUserStore.getState().user;
    if (!currentUser) throw new Error("Utilisateur non authentifié");
    const usersCollectionRef = collection(db, "users");
    const q = query(usersCollectionRef, where("uid", "==", currentUser.uid));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      alert("Utilisateur introuvable");
      return [];
    }

    const friendsUid = querySnapshot.docs[0].data().friends;
    if (friendsUid.length === 0)  throw new Error("Aucun ami trouvé");

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
  if (!invitationCode) return alert("Code d'invitation non fourni");

  const usersCollectionRef = collection(db, "users");
  const q = query(
    usersCollectionRef,
    where("invitationCode", "==", invitationCode)
  );

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return alert("Code d'invitation invalide");

  const currentUser = useUserStore.getState().user;
  if (!currentUser?.uid) return alert("Utilisateur non authentifié");
  const friendRequest = collection(db, "friendRequests");
  await addDoc(friendRequest, {
    from: currentUser.uid,
    to: querySnapshot.docs[0].data().uid,
    status: "pending",
  });
};

export const getFriendRequests = async () => {
    const currentUser = useUserStore.getState().user;
    const friendRequestsCollectionRef = collection(db, "friendRequests");
    if(!currentUser) return [];
    const q = query(friendRequestsCollectionRef, where("to", "==", currentUser.uid), where("status", "==", "pending"));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return [];

    const q2 = query(collection(db, "users"), where("uid", "in", querySnapshot.docs.map((doc) => doc.data().from)));

    const querySnapshot2 = await getDocs(q2);

    return querySnapshot2.docs.map((doc) => doc.data());
};

export const acceptFriendRequest = async (from: string) => {
  const currentUser = useUserStore.getState().user;

  if (!currentUser?.uid) return alert("Utilisateur non authentifié");

  const friendRequestsCollectionRef = collection(db, "friendRequests");
  const q = query(
    friendRequestsCollectionRef,
    where("from", "==", from),
    where("to", "==", currentUser.uid),
    where("status", "==", "pending")
  );

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return alert("Demande introuvable");

  const docId = querySnapshot.docs[0].id;

  await updateDoc(doc(friendRequestsCollectionRef, docId), {
    status: "accepted",
  });

  const usersCollectionRef = collection(db, "users");

  // Requête pour trouver le document de l'utilisateur actuel par son UID
  const currentUserQuery = query(usersCollectionRef, where("uid", "==", currentUser.uid));
  const currentUserSnapshot = await getDocs(currentUserQuery);

  let currentUserDocRef;
  if (!currentUserSnapshot.empty) {
    currentUserDocRef = doc(usersCollectionRef, currentUserSnapshot.docs[0].id);
  } else {
    console.error("Aucun document trouvé pour l'utilisateur actuel.");
    return;
  }

  const friendUserQuery = query(usersCollectionRef, where("uid", "==", from));
  const friendUserSnapshot = await getDocs(friendUserQuery);

  let friendUserDocRef;
  if (!friendUserSnapshot.empty) {
    friendUserDocRef = doc(usersCollectionRef, friendUserSnapshot.docs[0].id);
  } else {
    console.error("Aucun document trouvé pour l'ami.");
    return;
  };

  await updateDoc(currentUserDocRef, {
    friends: arrayUnion(from),
  });

  await updateDoc(friendUserDocRef, {
    friends: arrayUnion(currentUser.uid),
  });
};

export const declineFriendRequest = async (from: string) => {
  const currentUser = useUserStore.getState().user;

  if (!currentUser?.uid) return;

  const friendRequestsCollectionRef = collection(db, "friendRequests");
  const q = query(
    friendRequestsCollectionRef,
    where("from", "==", from),
    where("to", "==", currentUser.uid),
    where("status", "==", "pending")
  );

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return alert("Demande introuvable");

  const docId = querySnapshot.docs[0].id;

  await updateDoc(doc(friendRequestsCollectionRef, docId), {
    status: "declined",
  });
}


export const getInvitationCode = async () => {
  const currentUser = useUserStore.getState().user;
  if(!currentUser) return alert("Utilisateur non authentifié");
  const usersCollectionRef = collection(db, "users");
  const q = query(usersCollectionRef, where("uid", "==", currentUser.uid));

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return alert("Utilisateur introuvable");

  return querySnapshot.docs[0].data().invitationCode;
};

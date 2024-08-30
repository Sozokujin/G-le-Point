import { db } from "@/services/firebase/config";
import { Group, Marker } from "@/types/index";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export const addMarker = async (marker: Marker) => {
  const markersCollectionRef = collection(db, "markers");
  await addDoc(markersCollectionRef, marker);
};

export const getMarkers = async (userUid: any) => {
  const markersCollectionRef = collection(db, "markers");
  const querry = query(markersCollectionRef, where("user.uid", "==", userUid));
  const querySnapshot = await getDocs(querry);
  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
};

export const getFriendsMarkers = async (userUid: any) => {
  const markersCollectionRef = collection(db, "markers");
  const userCollectionRef = collection(db, "users");

  const userDocSnapshot = await getDocs(userCollectionRef);

  const friends: [] = userDocSnapshot.docs
    .map((doc) => doc.data())
    .find((user) => user.uid === userUid)?.friends;

  if (!friends || friends.length == 0) return [];

  const querry = query(markersCollectionRef, where("user.uid", "in", friends));
  const querySnapshot = await getDocs(querry);
  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
};

export const getGroupsMarkers = async (userUid: any) => {
  // const markersCollectionRef = collection(db, "markers");
  // const groupCollectionRef = collection(db, "groups");
  // const groupDocSnapshot = await getDocs(groupCollectionRef);
  // const groups: [] = groupDocSnapshot.docs
  //   .map((doc) => doc.data())
  //   .find((group) => group.users.includes(userUid))?.markers;
  // if (!groups || groups.length == 0) return [];
  // const querry = query(markersCollectionRef, where("id", "in", groups));
  // const querySnapshot = await getDocs(querry);
  // return querySnapshot.docs.map((doc) => ({
  //   ...doc.data(),
  //   id: doc.id,
  // }));
};

export const addMarkerGroup = async (
  markerId: string,
  groups: Group[],
  userId: string
) => {
  for (const group of groups) {
    const groupDocRef = doc(db, "groups", group.id);

    await updateDoc(groupDocRef, {
      markers: arrayUnion({
        idMarker: markerId,
        idUser: userId,
      }),
    });
  }
};

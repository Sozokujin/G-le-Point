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

export const getGroupsMarkers = async (userUid: string) => {
  const markersCollectionRef = collection(db, "markers");
  const groupCollectionRef = collection(db, "groups");

  // Get all groups where the user is a member
  const groupDocSnapshot = await getDocs(groupCollectionRef);

  // Find all markers from the groups where the user is a member
  const userGroups = groupDocSnapshot.docs
    .map((doc) => doc.data())
    .filter((group) => group.members.includes(userUid))
    .flatMap((group) => group.markers) // Flatten the array of markers
    .filter((marker) => marker !== undefined); // Ensure no undefined values

  if (!userGroups || userGroups.length === 0) return [];

  const chunkSize = 10;
  const markers = [];

  for (let i = 0; i < userGroups.length; i += chunkSize) {
    const chunk = userGroups
      .slice(i, i + chunkSize)
      .map((marker) => marker.idMarker); // Extract idMarker
    if (chunk.length > 0) {
      console.log(chunk); // This should print an array of strings (marker IDs)
      const markersQuery = query(
        markersCollectionRef,
        where("id", "in", chunk)
      );
      const querySnapshot = await getDocs(markersQuery);
      markers.push(
        ...querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    }
  }

  return markers;
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

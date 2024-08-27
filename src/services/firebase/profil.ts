import { db } from "@/services/firebase/config";
import { FirebaseUser } from "@/types";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export const updateUser = async (user: FirebaseUser) => {
  const userCollectionRef = collection(db, "users");
  const currentUserQuery = query(
    userCollectionRef,
    where("uid", "==", user.uid)
  );

  const currentUserSnapshot = await getDocs(currentUserQuery);

  let currentUserDocRef;
  if (!currentUserSnapshot.empty) {
    currentUserDocRef = doc(userCollectionRef, currentUserSnapshot.docs[0].id);
  } else {
    console.error("Aucun document trouvé pour l'utilisateur actuel.");
    return;
  }

  updateDoc(currentUserDocRef, {
    username: user.username,
    bio: user.bio,
  });
};

export const getBio = async (user: string): Promise<string> => {
  const currentUser = collection(db, "users");
  const currentUserQuery = query(currentUser, where("uid", "==", user));
  const querySnapshot = await getDocs(currentUserQuery);
  console.log(querySnapshot);
  if (!querySnapshot.empty) {
    let bio = "";
    querySnapshot.forEach((doc) => {
      console.log(doc.data().bio);
      bio = doc.data().bio;
    });
    return bio;
  }
  return "";
};

export const getUsername = async (user: string): Promise<string> => {
  const currentUser = collection(db, "users");
  const currentUserQuery = query(currentUser, where("uid", "==", user));
  const querySnapshot = await getDocs(currentUserQuery);
  console.log(querySnapshot);
  if (!querySnapshot.empty) {
    let username = "";
    querySnapshot.forEach((doc) => {
      username = doc.data().username;
    });
    return username;
  }
  return "";
};

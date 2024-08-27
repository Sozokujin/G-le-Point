import { db } from "@/services/firebase/config";
import { collection, doc, updateDoc } from "firebase/firestore";

export const updateUser = async (user: any) => {
  const userCollectionRef = collection(db, "users");
  const userDocRef = doc(userCollectionRef, user.uid); // Replace `user.uid` with the actual document ID
  await updateDoc(userDocRef, user);
};

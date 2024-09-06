import {
  collection,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./config";

const listScore: { [key: string]: number } = {
  add_markers: 10,
  add_super_markers: 100,
  check_markers: 1000,
  markers_liked: 10,
};
export const addScore = async (userId: string, eventType: string) => {
  const numberScore = listScore[eventType];
  if (!numberScore) return;

  try {
    const usersCollectionRef = collection(db, "users");
    const q = query(usersCollectionRef, where("uid", "==", userId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return new Response("User not found", { status: 404 });
    }

    const userDoc = querySnapshot.docs[0];
    const userRef = userDoc.ref;

    await updateDoc(userRef, {
      score: increment(numberScore),
    });

    return new Response("Score incremented", {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating score:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

import { FirebaseUser } from "@/types";
import {
  collection,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./config";

/**
 * Liste des types d'événements et de leur score associé
 */
const listScore: { [key: string]: number } = {
  markers: 10,
  super_markers: 100,
  check_markers: 1000,
  markers_liked: 10,
};

/**
 * Gère l'incrémentation du score de l'utilisateur
 * @param userId ID de l'utilisateur
 * @param eventType Type d'événement
 * @param operation Opération à effectuer (true: incrémenter, false: décrémenter)
 */

export const manageScore = async (
  userId: string,
  eventType: string,
  operation: boolean
) => {
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

    if (!operation) {
      await updateDoc(userRef, {
        score: increment(-numberScore),
      });

      return new Response("Score decremented", {
        status: 200,
      });
    }
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

export const getTopUsersByScore = async () => {
  try {
    const usersCollectionRef = collection(db, "users");

    const q = query(usersCollectionRef, orderBy("score", "desc"), limit(100));

    const querySnapshot = await getDocs(q);
    const users: FirebaseUser[] = querySnapshot.docs.map((doc) => ({
      uid: doc.data().uid,
      displayName: doc.data().displayName,
      email: doc.data().email,
      photoURL: doc.data().photoURL,
      username: doc.data().username,
      bio: doc.data().bio,
      score: doc.data().score,
    }));
    return users;
  } catch (error) {
    console.error("Error getting top users:", error);
    return [];
  }
};

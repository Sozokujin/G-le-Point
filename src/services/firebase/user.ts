import { FirebaseUser } from "@/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./config";

export const getUserById = async (uid: string): Promise<FirebaseUser | null> => {
  try {
    const userCollectionRef = collection(db, "users");
    const userQuery = query(userCollectionRef, where("uid", "==", uid));

    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      console.error("Aucun utilisateur trouvé pour cet ID.");
      return null;
    } else {
      let user: FirebaseUser | null = null;
      userSnapshot.forEach((doc) => {
        user = doc.data() as FirebaseUser;
      });

      return user;
    }
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
};

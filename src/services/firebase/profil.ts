import { db } from "@/services/firebase/config";
import useUserStore from "@/stores/userStore";
import { FirebaseUser } from "@/types";
import {
  deleteUser,
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  reauthenticateWithPopup,
  signOut,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { toast } from "sonner";

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

export const deleteAccount = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const { clearUser } = useUserStore.getState();

  if (user) {
    const uid = user.uid;

    try {
      let provider;
      const currentProviderId = user.providerData[0]?.providerId;

      switch (currentProviderId) {
        case "google.com":
          provider = new GoogleAuthProvider();
          break;
        case "facebook.com":
          provider = new FacebookAuthProvider();
          break;
        case "microsoft.com":
          provider = new OAuthProvider("microsoft.com");
          break;
        case "twitter.com":
          provider = new OAuthProvider("twitter.com");
          break;
        default:
          console.error(
            "Fournisseur non supporté ou utilisateur non authentifié via un fournisseur SSO reconnu."
          );
          return;
      }

      await reauthenticateWithPopup(user, provider);

      // Delete - Firestore
      const db = getFirestore();
      const userCollectionRef = collection(db, "users");
      const currentUserQuery = query(
        userCollectionRef,
        where("uid", "==", uid)
      );

      const currentUserSnapshot = await getDocs(currentUserQuery);

      if (!currentUserSnapshot.empty) {
        const currentUserDocRef = doc(
          userCollectionRef,
          currentUserSnapshot.docs[0].id
        );
        await deleteDoc(currentUserDocRef);
      } else {
        console.error("Aucun document trouvé pour l'utilisateur actuel.");
        return;
      }

      // Delete - Firebase Authentication
      await deleteUser(user);
      toast("Votre compte a été supprimé avec succès.");

      // Logout user
      await signOut(auth);
      clearUser();
      fetch("/api/logout");
      window.location.href = "/";
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      toast("Une erreur s'est produite lors de la suppression du compte.");
    }
  } else {
    toast("Aucun utilisateur connecté.");
  }
};

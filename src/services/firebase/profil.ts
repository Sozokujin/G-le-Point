import { auth, db } from "@/services/firebase/config";
import useUserStore from "@/stores/userStore";
import { FirebaseUser } from "@/types";
import {
  deleteUser,
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  reauthenticateWithPopup,
  signOut
} from "firebase/auth";
import {
  collection,
  deleteDoc,
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

export const deleteAccount = async () => {
  try {
    const { user, clearUser } = useUserStore.getState();

    if (!user || !user.uid) {
      console.error("Utilisateur non valide ou non authentifié.");
      return;
    }

    let provider;
    const currentProviderId = auth.currentUser?.providerData[0]?.providerId;

    try {
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

      await reauthenticateWithPopup(auth.currentUser!, provider);
      console.log("Utilisateur réauthentifié.");
    } catch (error) {
      console.error("Erreur lors de la réauthentification :", error);
      return;
    }

    try {
      // Suppression - Firestore
      const userCollectionRef = collection(db, "users");
      const currentUserQuery = query(
        userCollectionRef,
        where("uid", "==", user.uid)
      );

      const currentUserSnapshot = await getDocs(currentUserQuery);

      if (!currentUserSnapshot.empty) {
        const currentUserDocRef = doc(
          userCollectionRef,
          currentUserSnapshot.docs[0].id
        );
        await deleteDoc(currentUserDocRef);
        console.log("Document utilisateur supprimé de Firestore.");
      } else {
        console.error("Aucun document trouvé pour l'utilisateur actuel.");
        return;
      }
    } catch (error) {
      console.error(
        "Erreur lors de la suppression du document Firestore :",
        error
      );
      return;
    }

    try {
      // Suppression - Firebase Authentication
      await deleteUser(auth.currentUser!);
      console.log("Utilisateur supprimé de Firebase Authentication.");
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de l'utilisateur Firebase Authentication :",
        error
      );
      return;
    }

    await signOut(auth);
    clearUser();
    await fetch("/api/logout");
    console.log("Utilisateur déconnecté.");
  } catch (error) {
    console.error("Erreur lors de la suppression du compte :", error);
  }
};

import { auth, db } from "@/services/firebase/config";
import useUserStore from "@/stores/userStore";
import { FirebaseUser } from "@/types";
import {
  deleteUser,
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  reauthenticateWithPopup,
  signOut,
} from "firebase/auth";
import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDocs,
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
  const user = auth.currentUser;
  const { clearUser } = useUserStore.getState();

  if (!user) {
    toast("Vous devez être connecté pour supprimer votre compte.");
    return;
  }

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

    // 1 - Delete friends (request & send)
    const friendRequestsRef = collection(db, "friendRequests");
    const sentRequestsQuery = query(
      friendRequestsRef,
      where("from", "==", uid)
    );
    const receivedRequestsQuery = query(
      friendRequestsRef,
      where("to", "==", uid)
    );

    const sentRequestsSnapshot = await getDocs(sentRequestsQuery);
    const receivedRequestsSnapshot = await getDocs(receivedRequestsQuery);

    sentRequestsSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    receivedRequestsSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    // 2 - Delete friends groups
    const groupsRef = collection(db, "groups");
    const groupsQuery = query(groupsRef, where("groupOwner", "==", uid));

    const groupsSnapshot = await getDocs(groupsQuery);

    groupsSnapshot.forEach(async (groupDoc) => {
      const groupData = groupDoc.data();

      if (groupData.groupOwner === uid) {
        await deleteDoc(groupDoc.ref);
      } else {
        const markersSubcollectionRef = collection(groupDoc.ref, "markers");
        const markersQuery = query(
          markersSubcollectionRef,
          where("idUser", "==", uid)
        );
        const markersSnapshot = await getDocs(markersQuery);

        markersSnapshot.forEach(async (markerDoc) => {
          await deleteDoc(markerDoc.ref);
        });

        await updateDoc(groupDoc.ref, {
          markers: arrayRemove(uid),
        });
      }
    });

    // 3 - Delete markers
    const markersRef = collection(db, "markers");
    const markersQuery = query(markersRef, where("user.uid", "==", uid));

    const markersSnapshot = await getDocs(markersQuery);

    markersSnapshot.forEach(async (markerDoc) => {
      await deleteDoc(markerDoc.ref);
    });

    const userCollectionRef = collection(db, "users");
    const currentUserQuery = query(userCollectionRef, where("uid", "==", uid));

    const currentUserSnapshot = await getDocs(currentUserQuery);

    if (currentUserSnapshot.empty) {
      console.error("Aucun document trouvé pour l'utilisateur actuel.");
      return;
    }

    const currentUserDocRef = doc(
      userCollectionRef,
      currentUserSnapshot.docs[0].id
    );
    await deleteDoc(currentUserDocRef);

    // Delete - Firebase Authentication
    await deleteUser(user);

    // Logout user
    await signOut(auth);
    clearUser();
    fetch("/api/logout");
    window.location.href = "/?account=deleted";
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    toast("Une erreur s'est produite lors de la suppression du compte.");
  }
};

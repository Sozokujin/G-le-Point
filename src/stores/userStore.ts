import { auth } from "@/services/firebase/config";
import {
  getBio,
  getSuperMarkers,
  getUsername,
} from "@/services/firebase/profil";
import { FirebaseUser, UserStore } from "@/types/index";
import { onAuthStateChanged } from "firebase/auth";
import { create } from "zustand";

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user: FirebaseUser) => set({ user }),
  clearUser: () => set({ user: null }),
}));

onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser) {
    useUserStore.getState().setUser({
      uid: firebaseUser.uid,
      displayName: firebaseUser.displayName,
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL,
      username: await getUsername(firebaseUser.uid),
      bio: await getBio(firebaseUser.uid),
      superMarkers: await getSuperMarkers(firebaseUser.uid),
    });
  } else {
    useUserStore.getState().clearUser();
  }
});

export default useUserStore;

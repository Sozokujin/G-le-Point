import { create } from "zustand";
import { UserStore, FirebaseUser } from "@/types/index";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase/config";
import { getBio, getUsername } from "@/services/firebase/profil";

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
    });
  } else {
    useUserStore.getState().clearUser();
  }
});

export default useUserStore;
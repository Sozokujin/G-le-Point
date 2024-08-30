import { create } from "zustand";
import { UserStore, FirebaseUser } from "@/types/index";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase/config";

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user: FirebaseUser) => set({ user }),
  clearUser: () => set({ user: null }),
}));

onAuthStateChanged(auth, (firebaseUser) => {
  if (firebaseUser) {
    useUserStore.getState().setUser({
      uid: firebaseUser.uid,
      displayName: firebaseUser.displayName,
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL,
    });
  } else {
    useUserStore.getState().clearUser();
  }
});

export default useUserStore;
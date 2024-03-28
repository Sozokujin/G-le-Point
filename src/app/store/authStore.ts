import { create } from "zustand";
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../db/firebase";

const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
}

const googleLogOut = () => {
    return signOut(auth);
}

const useAuthStore: any = create((set: any) => ({
    user: null,
    isAuthenticated: false,
    login: (user: any) => set({ user:user, isAuthenticated: true}),
    logout: () => set({ user: null, isAuthenticated: false}),
}));  

onAuthStateChanged(auth, (user) => {
    if (user) {
      useAuthStore.getState().login(user);
    } else {
      useAuthStore.getState().logout();
    }
  });

export { useAuthStore, googleSignIn, googleLogOut };


import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { create } from "zustand";
import { auth } from "../db/firebase";

const googleSignIn = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

const googleLogOut = () => {
  return signOut(auth);
};

const useAuthStore = create((set: any) => ({
  user: null as any,
  isAuthenticated: false,
  isAuthChecking: true, // Nouvel état pour suivre la vérification initiale
  login: (user: any) =>
    set({ user, isAuthenticated: true, isAuthChecking: false }),
  logout: () =>
    set({ user: null, isAuthenticated: false, isAuthChecking: false }),
}));

onAuthStateChanged(auth, (user) => {
  if (user) {
    useAuthStore.getState().login(user);
  } else {
    useAuthStore.getState().logout();
  }
});

export { googleLogOut, googleSignIn, useAuthStore };

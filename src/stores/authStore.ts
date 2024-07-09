import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { create } from "zustand";
import { auth } from "../db/firebase";

export interface FirebaseUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null | undefined;
}

interface AuthStore {
  user: FirebaseUser | null;
  isAuthenticated: boolean;
  isAuthChecking: boolean;
  login: (user: FirebaseUser) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isAuthChecking: true,
  login: (user: FirebaseUser) => {
    set({ user, isAuthenticated: true, isAuthChecking: false });
  },

  logout: () =>
    set({ user: null, isAuthenticated: false, isAuthChecking: false }),
}));

const googleSignIn = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

const logOut = () => {
  return signOut(auth);
};

const faceBookSignIn = () => {
  const provider = new FacebookAuthProvider();
  return signInWithPopup(auth, provider);
};

onAuthStateChanged(auth, (firebaseUser) => {
  if (firebaseUser) {
    useAuthStore.getState().login({
      uid: firebaseUser.uid,
      displayName: firebaseUser.displayName,
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL,
    });
  } else {
    useAuthStore.getState().logout();
  }
});

export { faceBookSignIn, googleSignIn, logOut, useAuthStore };

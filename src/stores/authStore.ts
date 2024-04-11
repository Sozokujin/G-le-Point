import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { create } from "zustand";
import { auth } from "../db/firebase";

interface FirebaseUser {
  uid: string | null;
  displayName: string | null;
  email: string | null;
  photoURL: string | null | undefined;
}

export interface User extends FirebaseUser {
  friends: string[];
  invitationCode: string;
}
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isAuthChecking: boolean;
  login: (user: any) => void;
  logout: () => void;
}

const googleSignIn = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

const googleLogOut = () => {
  return signOut(auth);
};

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isAuthChecking: true, // Nouvel état pour suivre la vérification initiale
  login: (user: any) =>
    set({ user, isAuthenticated: true, isAuthChecking: false }),
  logout: () =>
    set({ user: null, isAuthenticated: false, isAuthChecking: false }),
}));

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

export { googleLogOut, googleSignIn, useAuthStore };

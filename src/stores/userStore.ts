import { auth } from "@/services/firebase/config";
import {
  getBio,
  getSuperMarkers,
  getUsername,
} from "@/services/firebase/profil";
import { FirebaseUser, UserStore } from "@/types/index";
import { onAuthStateChanged } from "firebase/auth";
import { create } from "zustand";
import { getUserById, getUsersByIds } from "@/services/firebase/user";

const useUserStore = create<UserStore>((set) => ({
  currentUser: null,
  users: [],
  setCurrentUser: (currentUser: FirebaseUser) => set({ currentUser }),
  clearCurrentUser: () => set({ currentUser: null }),
  setUsers: (users: FirebaseUser[]) => set({ users }),
  clearUsers: () => set({ users: [] }),
  fetchUserById: async (id: string) => {
    const user = await getUserById(id);
    set((state) => {
      const userExists = state.users.some((u) => u.uid === user?.uid);
      if (userExists) return state; //sinon ca trigger un change de users et ca cree une infinite loop dans useEffect
      return { users: [...state.users, user].filter((u) => u !== null) };
    });
  },
  fetchUsersByIds: async (ids: string[]) => {
    const users = await getUsersByIds(ids);
    set((state) => {
      const newUsers = users.filter((user) => !state.users.some((u) => u.uid === user.uid));
      if (newUsers.length === 0) return state;
      return { users: [...state.users, ...newUsers] };
    });
  },
}));

onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser) {
    const user = {
      uid: firebaseUser.uid,
      displayName: firebaseUser.displayName,
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL,
      username: await getUsername(firebaseUser.uid),
      bio: await getBio(firebaseUser.uid),
      superMarkers: await getSuperMarkers(firebaseUser.uid),
    };
    useUserStore.getState().setCurrentUser(user);
  } else {
    useUserStore.getState().clearCurrentUser();
  }
});

export default useUserStore;

import { getAllFriends } from "@/services/firebase/friends";
import { FirebaseUser } from "@/types";
import { create } from "zustand";

const useFriendStore = create((set: any) => ({
    friends: [] as FirebaseUser[],
    getFriends: async () => {
    const friends = await getAllFriends();
    set({ friends });
    },
    addFriend: (friend: any) => set((state: any) => ({ friends: [...state.friends, friend] })),
    removeFriend: (friend: any) => set((state: any) => ({ friends: state.friends.filter((f: any) => f !== friend) })),
    clearFriends: () => set({ friends: [] }),
    }));

export default useFriendStore;
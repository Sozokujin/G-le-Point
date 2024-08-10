import { getAllFriends, getFriendRequests } from "@/services/firebase/friends";
import { FirebaseUser } from "@/types";
import { create } from "zustand";


export const useFriendStore = create((set: any) => ({
    friends: [] as FirebaseUser[],
    getFriends: async () => {
    const friends = await getAllFriends();
    set({ friends });
    },
    addFriend: (friend: any) => set((state: any) => ({ friends: [...state.friends, friend] })),
    removeFriend: (friend: any) => set((state: any) => ({ friends: state.friends.filter((f: any) => f !== friend) })),
    clearFriends: () => set({ friends: [] }),
    }));


export const useFriendRequestStore = create((set: any) => ({
    friendRequests: [] as any[],
    getFriendRequests: async () => {
    const friendRequests = await getFriendRequests();
    set({ friendRequests });
    },
}));
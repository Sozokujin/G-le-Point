import { getAllFriends, getFriendRequests } from "@/services/firebase/friends";
import { FirebaseUser } from "@/types";
import { create } from "zustand";

export const useFriendStore = create((set: any, get: any) => ({
    friends: [] as FirebaseUser[],
    searchQuery: '',
    getFriends: async () => {
        const friends = get().friends;
        if (friends.length > 0) {
            return friends;
        }
        const fetchedFriends = await getAllFriends();
        set({ friends: fetchedFriends });
        return fetchedFriends;
    },

    addFriend: (friend: FirebaseUser) => set((state: any) => ({ friends: [...state.friends, friend] })),
    removeFriend: (friend: FirebaseUser) => set((state: any) => ({ friends: state.friends.filter((f: any) => f !== friend) })),
    clearFriends: () => set({ friends: [] }),
    setSearchQuery: (query: string) => set({ searchQuery: query }),
    filteredFriends: () => {
        const { friends, searchQuery } = get();
        if (!searchQuery) {
            set(friends);
        }
        set(friends.filter((friend: FirebaseUser) =>
            friend.displayName!.toLowerCase().includes(searchQuery.toLowerCase()) || friend.email!.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }
}));

export const useFriendRequestStore = create((set: any) => ({
    friendRequests: [] as any[],
    getFriendRequests: async () => {
        const friendRequests = await getFriendRequests();
        set({ friendRequests });
    },
    removeFriendRequest: (friendRequest: any) => set((state: any) => ({ friendRequests: state.friendRequests.filter((f: any) => f !== friendRequest) })),
}));
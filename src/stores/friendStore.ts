import { getAllFriends, getFriendRequests, getInvitationCode } from "@/services/firebase/friends";
import { FirebaseUser } from "@/types";
import { create } from "zustand";

interface FriendState {
    friends: FirebaseUser[];
    friendRequests: any[];
    invitationCode: string | null;
    selectedFriend: FirebaseUser | null;
    filteredFriends: FirebaseUser[];
    getFriends: () => Promise<void>;
    getFriendRequests: () => Promise<void>;
    setSelectedFriend: (friend: FirebaseUser | null) => void;
    setFilteredFriends: (friends: FirebaseUser[]) => void;
    addFriend: (friend: FirebaseUser) => void;
    removeFriend: (friendId: string) => void;
    removeFriendRequest: (requestId: string) => void;
    clearFriends: () => void;
    getInvitationCode: () => Promise<void>;
}

export const useFriendStore = create<FriendState>((set, get) => ({
    friends: [],
    friendRequests: [],
    invitationCode: null,
    selectedFriend: null,
    filteredFriends: [],
    getFriends: async () => {
        const fetchedFriends = await getAllFriends();
        set({ friends: fetchedFriends, filteredFriends: fetchedFriends });
    },
    getFriendRequests: async () => {
        const fetchedRequests = await getFriendRequests();
        set({ friendRequests: fetchedRequests });
    },
    setSelectedFriend: (friend) => set({ selectedFriend: friend }),
    setFilteredFriends: (friends) => set({ filteredFriends: friends }),
    addFriend: (friend) => set((state) => ({ friends: [...state.friends, friend] })),
    removeFriend: (friendId) => set((state) => ({
        friends: state.friends.filter((f) => f.uid !== friendId),
        filteredFriends: state.filteredFriends.filter((f) => f.uid !== friendId),
    })),
    removeFriendRequest: (requestId) => set((state) => ({
        friendRequests: state.friendRequests.filter((r) => r.id !== requestId),
    })),
    clearFriends: () => set({ friends: [], filteredFriends: [] }),
    getInvitationCode: async () => {
        const code = await getInvitationCode();
        set({ invitationCode: code });
    },
}));
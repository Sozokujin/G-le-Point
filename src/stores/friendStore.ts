import { deepEqual } from '@/lib/utils';
import { getAllFriends, getFriendRequests, getInvitationCode } from '@/services/firebase/friends';
import { FirebaseUser, FriendRequest } from '@/types';
import { create } from 'zustand';

interface FriendState {
    friends: FirebaseUser[];
    friendRequests: FriendRequest[];
    invitationCode: string | null;
    filteredFriends: FirebaseUser[];
    getFriends: () => Promise<void>;
    getFriendRequests: () => Promise<void>;
    setFilteredFriends: (friends: FirebaseUser[]) => void;
    addFriend: (friend: FirebaseUser) => void;
    removeFriend: (friendId: string) => void;
    removeFriendRequest: (requestId: string) => void;
    clearFriends: () => void;
    getInvitationCode: () => Promise<void>;
    reset: () => void;
}

const initialState: Omit<
    FriendState,
    | 'getFriends'
    | 'getFriendRequests'
    | 'setFilteredFriends'
    | 'addFriend'
    | 'removeFriend'
    | 'removeFriendRequest'
    | 'clearFriends'
    | 'getInvitationCode'
    | 'reset'
> = {
    friends: [],
    friendRequests: [],
    invitationCode: null,
    filteredFriends: []
};

export const useFriendStore = create<FriendState>((set, get) => ({
    ...initialState,
    getFriends: async () => {
        const fetchedFriends = await getAllFriends();
        set({ friends: fetchedFriends, filteredFriends: fetchedFriends });
    },
    getFriendRequests: async () => {
        const fetchedRequests = await getFriendRequests();
        const currentRequests = get().friendRequests;
        if (fetchedRequests && !deepEqual(fetchedRequests, currentRequests)) {
            set({ friendRequests: fetchedRequests });
        }
    },
    setFilteredFriends: (friends) => set({ filteredFriends: friends }),
    addFriend: (friend) => set((state) => ({ friends: [...state.friends, friend], filteredFriends: [...state.friends, friend] })),
    removeFriend: (friendId: string) =>
        set((state) => ({
            friends: state.friends.filter((f) => f.uid !== friendId),
            filteredFriends: state.filteredFriends.filter((f) => f.uid !== friendId)
        })),
    removeFriendRequest: (requestId: string) => {
        set((state) => ({
            friendRequests: state.friendRequests.filter((r) => r.uid !== requestId)
        }));
    },
    clearFriends: () => set({ friends: [], filteredFriends: [] }),
    getInvitationCode: async () => {
        const code = await getInvitationCode();
        set({ invitationCode: code });
    },
    reset: () => set(() => ({ ...initialState }))
}));

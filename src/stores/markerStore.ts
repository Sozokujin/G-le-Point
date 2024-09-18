import {
    addLike,
    addReport,
    createMarker,
    deleteMarker,
    getFriendsMarkers,
    getGroupsMarkers,
    getPublicMarkers,
    getUserMarkers,
    removeLike,
    removeReport
} from '@/services/firebase/markers';
import { Marker } from '@/types/index';
import { create } from 'zustand';

export interface MarkerState {
    userMarkers: Marker[];
    friendsMarkers: Marker[];
    groupsMarkers: Marker[];
    publicMarkers: Marker[];
    lastMarker: Marker | null;
    addMarker: (marker: Omit<Marker, 'id'>) => Promise<string | null>;
    removeMarker: (marker: Marker) => void;
    clearUserMarkers: () => void;
    clearFriendsMarkers: () => void;
    clearGroupsMarkers: () => void;
    clearPublicMarkers: () => void;
    getUserMarkers: (userUid: string) => Promise<void>;
    getFriendsMarkers: (userUid: string) => Promise<void>;
    getGroupsMarkers: (userUid: string) => Promise<void>;
    getPublicMarkers: (userUid: string) => Promise<void>;
    deleteMarker: (markerId: string) => Promise<void>;
    toggleLikeMarker: (markerId: string, userId: string) => Promise<void>;
    toggleReportMarker: (markerId: string, userId: string) => Promise<void>;
    reset: () => void;
}

const initialState: Omit<
    MarkerState,
    | 'addMarker'
    | 'removeMarker'
    | 'clearUserMarkers'
    | 'clearFriendsMarkers'
    | 'clearGroupsMarkers'
    | 'clearPublicMarkers'
    | 'getUserMarkers'
    | 'getFriendsMarkers'
    | 'getGroupsMarkers'
    | 'getPublicMarkers'
    | 'deleteMarker'
    | 'toggleLikeMarker'
    | 'toggleReportMarker'
    | 'reset'
> = {
    userMarkers: [],
    friendsMarkers: [],
    groupsMarkers: [],
    publicMarkers: [],
    lastMarker: null
};

export const useMarkerStore = create<MarkerState>((set, get) => ({
    ...initialState,

    addMarker: async (marker: Omit<Marker, 'id'>): Promise<string | null> => {
        try {
            const id = await createMarker(marker);
            if (id) {
                const newMarker: Marker = { id, ...marker };
                set((state: MarkerState) => ({
                    userMarkers: [...state.userMarkers, newMarker],
                    lastMarker: newMarker
                }));
                return id;
            } else {
                console.error('Failed to create marker: No ID returned');
                return null;
            }
        } catch (error) {
            console.error('Error adding marker:', error);
            return null;
        }
    },

    removeMarker: (marker: Marker) =>
        set((state: MarkerState) => ({
            userMarkers: state.userMarkers.filter((m: Marker) => m.id !== marker.id)
        })),

    clearUserMarkers: () => set({ userMarkers: [] }),
    clearFriendsMarkers: () => set({ friendsMarkers: [] }),
    clearGroupsMarkers: () => set({ groupsMarkers: [] }),
    clearPublicMarkers: () => set({ publicMarkers: [] }),

    getUserMarkers: async (userUid: string) => {
        const userMarkers = await getUserMarkers(userUid);
        set({ userMarkers });
    },

    getFriendsMarkers: async (userUid: string) => {
        const friendsMarkers = await getFriendsMarkers(userUid);
        set({ friendsMarkers });
    },

    getGroupsMarkers: async (userUid: string) => {
        const groupsMarkers = await getGroupsMarkers(userUid);
        set({ groupsMarkers });
    },

    getPublicMarkers: async (userUid: string) => {
        const publicMarkers = await getPublicMarkers(userUid);
        set({ publicMarkers });
    },

    deleteMarker: async (markerId: string) => {
        if (!markerId) {
            console.error('Invalid marker ID');
            return;
        }
        await deleteMarker(markerId);
        set((state: MarkerState) => ({
            userMarkers: state.userMarkers.filter((m: Marker) => m.id !== markerId),
            friendsMarkers: state.friendsMarkers.filter((m: Marker) => m.id !== markerId),
            groupsMarkers: state.groupsMarkers.filter((m: Marker) => m.id !== markerId),
            publicMarkers: state.publicMarkers.filter((m: Marker) => m.id !== markerId)
        }));
    },

    toggleLikeMarker: async (markerId: string, userId: string) => {
        const state = get();

        const marker =
            state.friendsMarkers.find((m) => m.id === markerId) ||
            state.groupsMarkers.find((m) => m.id === markerId) ||
            state.publicMarkers.find((m) => m.id === markerId);

        if (!marker) return;

        const hasLiked = marker.likedBy.includes(userId);

        const updatedMarker = {
            ...marker,
            likeCount: hasLiked ? marker.likeCount - 1 : marker.likeCount + 1,
            likedBy: hasLiked ? marker.likedBy.filter((id) => id !== userId) : [...marker.likedBy, userId]
        };

        set((state) => ({
            friendsMarkers: state.friendsMarkers.map((m) => (m.id === markerId ? updatedMarker : m)),
            groupsMarkers: state.groupsMarkers.map((m) => (m.id === markerId ? updatedMarker : m)),
            publicMarkers: state.publicMarkers.map((m) => (m.id === markerId ? updatedMarker : m))
        }));

        if (hasLiked) {
            await removeLike(markerId, userId);
        } else {
            await addLike(markerId, userId);
        }
    },

    toggleReportMarker: async (markerId: string, userId: string) => {
        const state = get();

        const marker =
            state.friendsMarkers.find((m) => m.id === markerId) ||
            state.groupsMarkers.find((m) => m.id === markerId) ||
            state.publicMarkers.find((m) => m.id === markerId);

        if (!marker) return;

        const hasReported = marker.reportedBy.includes(userId);

        const updatedMarker = {
            ...marker,
            reportCount: hasReported ? marker.reportCount - 1 : marker.reportCount + 1,
            reportedBy: hasReported ? marker.reportedBy.filter((id) => id !== userId) : [...marker.reportedBy, userId]
        };

        set((state) => ({
            friendsMarkers: state.friendsMarkers.map((m) => (m.id === markerId ? updatedMarker : m)),
            groupsMarkers: state.groupsMarkers.map((m) => (m.id === markerId ? updatedMarker : m)),
            publicMarkers: state.publicMarkers.map((m) => (m.id === markerId ? updatedMarker : m))
        }));

        if (hasReported) {
            await removeReport(markerId, userId);
        } else {
            await addReport(markerId, userId);
        }
    },

    reset: () => set(() => ({ ...initialState }))
}));

export default useMarkerStore;
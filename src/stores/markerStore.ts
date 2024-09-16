import {
    addLike,
    addMarker,
    addReport,
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
    addMarker: (marker: Marker) => void;
    addClickedMarker: (marker: Marker) => void;
    clearLastMarker: () => void;
    removeMarker: (marker: Marker) => void;
    clearUserMarkers: () => void;
    clearFriendsMarkers: () => void;
    clearGroupsMarkers: () => void;
    clearPublicMarkers: () => void;
    getUserMarkers: (userUid: string) => void;
    getFriendsMarkers: (userUid: string) => void;
    getGroupsMarkers: (userUid: string) => void;
    getPublicMarkers: (userUid: string) => void;
    deleteMarker: (markerId: string) => void;
    toggleLikeMarker: (markerId: string, userId: string) => void;
    toggleReportMarker: (markerId: string, userId: string) => void;
}

export const useMarkerStore = create<MarkerState>((set, get) => ({
    userMarkers: [],
    friendsMarkers: [],
    groupsMarkers: [],
    publicMarkers: [],
    lastMarker: null,

    addMarker: async (marker: Marker) => {
        await addMarker(marker);
        set((state: MarkerState) => ({
            userMarkers: [...state.userMarkers, marker],
            lastMarker: marker
        }));
    },

    addClickedMarker: (marker: Marker) => set({ lastMarker: marker }),

    clearLastMarker: () => set({ lastMarker: null }),

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
        await deleteMarker(markerId);
        set((state: any) => ({
            userMarkers: state.userMarkers.filter((m: Marker) => m.id !== markerId)
        }));
    },

    toggleLikeMarker: async (markerId: string, userId: string) => {
        const state = get();
        
        const marker =
            state.friendsMarkers.find((m) => m.id === markerId)
            || state.groupsMarkers.find((m) => m.id === markerId)
            || state.publicMarkers.find((m) => m.id === markerId);

        if (!marker) return;

        const hasLiked = marker.likedBy.includes(userId);

        const updatedMarker = {
            ...marker,
            likeCount: hasLiked ? marker.likeCount - 1 : marker.likeCount + 1,
            likedBy: hasLiked
                ? marker.likedBy.filter((id) => id !== userId)
                : [...marker.likedBy, userId],
        };

        set((state) => {
            return {
                friendsMarkers: state.friendsMarkers.map((m) =>
                    m.id === markerId ? updatedMarker : m
                ),
                groupsMarkers: state.groupsMarkers.map((m) =>
                    m.id === markerId ? updatedMarker : m
                ),
                publicMarkers: state.publicMarkers.map((m) =>
                    m.id === markerId ? updatedMarker : m
                ),
            };
        });

        if (hasLiked) {
            await removeLike(markerId, userId);
        } else {
            await addLike(markerId, userId);
        }
    },

    toggleReportMarker: async (markerId: string, userId: string) => {
        const state = get();

        const marker =
            state.friendsMarkers.find((m) => m.id === markerId) 
            || state.groupsMarkers.find((m) => m.id === markerId)
            || state.publicMarkers.find((m) => m.id === markerId);

        if (!marker) return;

        const hasReported = marker.reportedBy.includes(userId);

        const updatedMarker = {
            ...marker,
            reportCount: hasReported ? marker.reportCount - 1 : marker.reportCount + 1,
            reportedBy: hasReported
                ? marker.reportedBy.filter((id) => id !== userId)
                : [...marker.reportedBy, userId],
        };

        set((state) => {
            return {
                friendsMarkers: state.friendsMarkers.map((m) =>
                    m.id === markerId ? updatedMarker : m
                ),
                groupsMarkers: state.groupsMarkers.map((m) =>
                    m.id === markerId ? updatedMarker : m
                ),
                publicMarkers: state.publicMarkers.map((m) =>
                    m.id === markerId ? updatedMarker : m
                ),
            };
        });

        if (hasReported) {
            await removeReport(markerId, userId);
        } else {
            await addReport(markerId, userId);
        }
    }
}));

export default useMarkerStore;

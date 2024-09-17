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
    likedMarkers: string[];
    reportedMarkers: string[];
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
    reset: () => void;
}

const initialState: Omit<MarkerState, 'addMarker' | 'addClickedMarker' | 'clearLastMarker' | 'removeMarker' | 'clearUserMarkers' | 'clearFriendsMarkers' | 'clearGroupsMarkers' | 'clearPublicMarkers' | 'getUserMarkers' | 'getFriendsMarkers' | 'getGroupsMarkers' | 'getPublicMarkers' | 'deleteMarker' | 'toggleLikeMarker' | 'toggleReportMarker' | 'reset'> = {
    userMarkers: [],
    friendsMarkers: [],
    groupsMarkers: [],
    publicMarkers: [],
    lastMarker: null,
    likedMarkers: [],
    reportedMarkers: [],
};

export const useMarkerStore = create<MarkerState>((set, get) => ({
    ...initialState,
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
        const updatedMarkers = state.userMarkers.map((marker: Marker) => {
            if (marker.id === markerId) {
                if (marker.likedBy.includes(userId)) {
                    marker.likeCount -= 1;
                    marker.likedBy = marker.likedBy.filter((id) => id !== userId);
                } else {
                    marker.likeCount += 1;
                    marker.likedBy.push(userId);
                }
            }
            return marker;
        });

        set({ userMarkers: updatedMarkers });

        const marker = updatedMarkers.find((m: Marker) => m.id === markerId);
        if (marker && marker.likedBy.includes(userId)) {
            await addLike(markerId, userId);
        } else {
            await removeLike(markerId, userId);
        }
    },

    toggleReportMarker: async (markerId: string, userId: string) => {
        const state = get();
        const updatedMarkers = state.userMarkers.map((marker: Marker) => {
            if (marker.id === markerId) {
                if (marker.reportedBy.includes(userId)) {
                    marker.reportCount -= 1;
                    marker.reportedBy = marker.reportedBy.filter((id) => id !== userId);
                } else {
                    marker.reportCount += 1;
                    marker.reportedBy.push(userId);
                }
            }
            return marker;
        });

        set({ userMarkers: updatedMarkers });

        const marker = updatedMarkers.find((m: Marker) => m.id === markerId);
        if (marker && marker.reportedBy.includes(userId)) {
            await addReport(markerId, userId);
        } else {
            await removeReport(markerId, userId);
        }
    },

    reset: () => set(() => ({ ...initialState }))
}));

export default useMarkerStore;

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
  removeReport,
} from "@/services/firebase/markers";
import { Marker } from "@/types/index";
import { create } from "zustand";

const useMarkerStore = create((set: any, get: any) => ({
  userMarkers: [] as Marker[],
  friendsMarkers: [] as Marker[],
  groupsMarkers: [] as Marker[],
  publicMarkers: [] as Marker[],
  lastMarker: null as Marker | null,
  likedMarkers: new Set() as Set<string>,
  reportedMarkers: new Set() as Set<string>,

  // Ajout d'une propriété pour gérer le cache
  markersLoaded: {
    user: false,
    friends: false,
    groups: false,
    public: false,
  },

  addMarker: async (marker: Marker) => {
    await addMarker(marker);
    set((state: any) => ({ userMarkers: [...state.userMarkers, marker] }));
    set({ lastMarker: marker });
  },

  addClickedMarker: (marker: Marker) => set({ lastMarker: marker }),

  clearLastMarker: () => set({ lastMarker: null }),

  removeMarker: (marker: Marker) =>
    set((state: any) => ({
      userMarkers: state.userMarkers.filter((m: Marker) => m.id !== marker.id),
    })),

  clearUserMarkers: () =>
    set({
      userMarkers: [],
      markersLoaded: { ...get().markersLoaded, user: false },
    }),
  clearFriendsMarkers: () =>
    set({
      friendsMarkers: [],
      markersLoaded: { ...get().markersLoaded, friends: false },
    }),
  clearGroupsMarkers: () =>
    set({
      groupsMarkers: [],
      markersLoaded: { ...get().markersLoaded, groups: false },
    }),

  // Méthode pour récupérer les marqueurs utilisateurs avec cache
  getMarkers: async (userUid: any) => {
    const { userMarkers, markersLoaded } = get();

    // Si les marqueurs utilisateurs ont déjà été chargés, on ne refait pas l'appel
    if (markersLoaded.user && userMarkers.length > 0) return;

    const markersData = await getUserMarkers(userUid);
    set({
      userMarkers: markersData,
      markersLoaded: { ...markersLoaded, user: true },
    });
  },

  // Méthode pour récupérer les marqueurs amis avec cache
  getFriendsMarkers: async (userUid: any) => {
    const { friendsMarkers, markersLoaded } = get();

    if (markersLoaded.friends && friendsMarkers.length > 0) return;

    set({ friendsMarkers: [] }); // Optionnel, permet de réinitialiser les marqueurs précédents avant l'appel
    const markersData = await getFriendsMarkers(userUid);
    set({
      friendsMarkers: markersData,
      markersLoaded: { ...markersLoaded, friends: true },
    });
  },

  // Méthode pour récupérer les marqueurs de groupe avec cache
  getGroupsMarkers: async (userUid: any) => {
    const { groupsMarkers, markersLoaded } = get();

    if (markersLoaded.groups && groupsMarkers.length > 0) return;

    set({ groupsMarkers: [] });
    const markersData = await getGroupsMarkers(userUid);
    set({
      groupsMarkers: markersData,
      markersLoaded: { ...markersLoaded, groups: true },
    });
  },

  getPublicMarkers: async (userUid: any) => {
    const { publicMarkers, markersLoaded } = get();

    if (markersLoaded.public && publicMarkers.length > 0) return;

    set({ publicMarkers: [] });
    const markersData = await getPublicMarkers(userUid);
    set({
      publicMarkers: markersData,
      markersLoaded: { ...markersLoaded, public: true },
    });
  },

  deleteMarker: async (markerId: string) => {
    if (markerId) {
      await deleteMarker(markerId);
      set((state: any) => ({
        userMarkers: state.userMarkers.filter((m: Marker) => m.id !== markerId),
      }));
    }
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

    const marker = updatedMarkers.find((m: any) => m.id === markerId);
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

    set({
      userMarkers: updatedMarkers,
    });

    const marker = updatedMarkers.find((m: any) => m.id === markerId);
    if (marker && marker.reportedBy.includes(userId)) {
      await addReport(markerId, userId);
    } else {
      await removeReport(markerId, userId);
    }
  },
}));

export default useMarkerStore;

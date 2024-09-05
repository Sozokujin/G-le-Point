import {
  addMarker,
  getFriendsMarkers,
  getGroupsMarkers,
  getPublicMarkers,
  getUserMarkers,
} from "@/services/firebase/markers";
import { Marker } from "@/types/index";
import { create } from "zustand";

const useMarkerStore = create((set: any) => ({
  userMarkers: [] as Marker[],
  friendsMarkers: [] as Marker[],
  groupsMarkers: [] as Marker[],
  publicMarkers: [] as Marker[],

  addMarker: async (marker: Marker) => {
    await addMarker(marker);
    set((state: any) => ({ userMarkers: [...state.userMarkers, marker] }));
  },

  removeMarker: (marker: Marker) =>
    set((state: any) => ({
      userMarkers: state.userMarkers.filter((m: Marker) => m.id !== marker.id),
    })),

  clearUserMarkers: () => set({ userMarkers: [] }),
  clearFriendsMarkers: () => set({ friendsMarkers: [] }),
  clearGroupsMarkers: () => set({ groupsMarkers: [] }),

  getMarkers: async (userUid: any) => {
    const markersData = await getUserMarkers(userUid);
    set({ userMarkers: markersData });
  },

  getFriendsMarkers: async (userUid: any) => {
    set({ friendsMarkers: [] });
    const markersData = await getFriendsMarkers(userUid);
    set({ friendsMarkers: markersData });
  },

  getGroupsMarkers: async (userUid: any) => {
    set({ groupsMarkers: [] });
    const markersData = await getGroupsMarkers(userUid);
    set({ groupsMarkers: markersData });
  },

  getPublicMarkers: async () => {
    set({ publicMarkers: [] });
    const markersData = await getPublicMarkers();
    set({ publicMarkers: markersData });
  },
}));

export default useMarkerStore;

import {
  addMarker,
  getFriendsMarkers,
  getGroupsMarkers,
  getMarkers,
} from "@/services/firebase/markers";
import { Marker } from "@/types/index";
import { create } from "zustand";

const useMarkerStore = create((set: any) => ({
  userMarkers: [] as Marker[],
  friendsMarkers: [] as Marker[],
  groupsMarkers: [] as Marker[],

  addMarker: async (marker: Marker) => {
    await addMarker(marker);
    set((state: any) => ({ userMarkers: [...state.userMarkers, marker] }));
  },

  removeMarker: (marker: Marker) =>
    set((state: any) => ({
      userMarkers: state.userMarkers.filter((m: Marker) => m.id !== marker.id),
    })),

  clearMarkers: () => set({ userMarkers: [] }),

  getMarkers: async (userUid: any) => {
    const markersData = await getMarkers(userUid);
    set({ userMarkers: markersData });
  },

  getFriendsMarkers: async (userUid: any) => {
    const markersData = await getFriendsMarkers(userUid);
    set((state: any) => ({
      friendsMarkers: [...state.friendsMarkers, ...markersData],
    }));
  },

  getGroupsMarkers: async (userUid: any) => {
    const markersData = await getGroupsMarkers(userUid);
    console.log(markersData);
    set((state: any) => ({
      groupsMarkers: [...state.groupsMarkers, ...markersData],
    }));
  },
}));

export default useMarkerStore;

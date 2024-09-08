import {
  addMarker,
  getFriendsMarkers,
  getGroupsMarkers,
  getGroupMarkers,
  getPublicMarkers,
  getUserMarkers,
} from "@/services/firebase/markers";
import { Marker } from "@/types/index";
import { group } from "console";
import { create } from "zustand";

const useMarkerStore = create((set: any, get: any) => ({
  userMarkers: [] as Marker[],
  friendsMarkers: [] as Marker[],
  groupsMarkers: [] as Marker[],
  groupMarkers: [] as Marker[],
  publicMarkers: [] as Marker[],
  lastMarker: null as Marker | null,

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
  getMarkers: async (userUid: string) => {
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
  getFriendsMarkers: async (userUid: string) => {
    const { friendsMarkers, markersLoaded } = get();

    if (markersLoaded.friends && friendsMarkers.length > 0) return;

    set({ friendsMarkers: [] }); // Optionnel, permet de réinitialiser les marqueurs précédents avant l'appel
    const markersData = await getFriendsMarkers(userUid);
    set({
      friendsMarkers: markersData,
      markersLoaded: { ...markersLoaded, friends: true },
    });
  },

  getGroupMarkers: async (groupId: string) => {
    const { groupMarkers } = get();

    if (groupMarkers.length > 0) return;

    set({ groupMarkers: [] });
    const markersData = await getGroupMarkers(groupId);
    set({groupMarkers: markersData,});
  },

  // Méthode pour récupérer les marqueurs de groupe avec cache
  getGroupsMarkers: async (userUid: string) => {
    const { groupsMarkers, markersLoaded } = get();

    if (markersLoaded.groups && groupsMarkers.length > 0) return;

    set({ groupsMarkers: [] });
    const markersData = await getGroupsMarkers(userUid);
    set({
      groupsMarkers: markersData,
      markersLoaded: { ...markersLoaded, groups: true },
    });
  },

  // Méthode pour récupérer les marqueurs publics avec cache
  getPublicMarkers: async (userUid: string) => {
    const { publicMarkers, markersLoaded } = get();

    if (markersLoaded.public && publicMarkers.length > 0) return;

    set({ publicMarkers: [] });
    const markersData = await getPublicMarkers(userUid);
    console.log(markersData);
    set({
      publicMarkers: markersData,
      markersLoaded: { ...markersLoaded, public: true },
    });
  },
}));

export default useMarkerStore;

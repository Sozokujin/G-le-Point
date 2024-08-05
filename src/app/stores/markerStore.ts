import { create } from 'zustand';
import { addMarkerToFirebase, fetchMarkersFromFirebase, fetchFriendsMarkersFromFirebase } from '@/app/services/firebase/markers';
import { Marker } from '@/app/types/types';

const useMarkerStore = create((set: any) => ({
  markers: [] as Marker[],
  addMarker: async (marker: Marker) => {
    await addMarkerToFirebase(marker);
    set((state: any) => ({ markers: [...state.markers, marker] }));
  },
  removeMarker: (marker: Marker) =>
    set((state: any) => ({
      markers: state.markers.filter((m: Marker) => m !== marker),
    })),
  clearMarkers: () => set({ markers: [] }),
  getMarkers: async (userUid: any) => {
    const markersData = await fetchMarkersFromFirebase(userUid);
    set({ markers: markersData });
  },
  getFriendsMarkers: async (userUid: any) => {
    const markersData = await fetchFriendsMarkersFromFirebase(userUid);
    set((state: any) => ({ markers: [...state.markers, ...markersData] }));
  },
}));

export default useMarkerStore;

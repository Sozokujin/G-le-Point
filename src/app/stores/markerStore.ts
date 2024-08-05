import { create } from 'zustand';
import { addMarker, getMarkers, getFriendsMarkers } from '@/app/services/firebase/markers';
import { Marker } from '@/app/types/types';

const useMarkerStore = create((set: any) => ({
  markers: [] as Marker[],
  addMarker: async (marker: Marker) => {
    await addMarker(marker);
    set((state: any) => ({ markers: [...state.markers, marker] }));
  },
  removeMarker: (marker: Marker) =>
    set((state: any) => ({
      markers: state.markers.filter((m: Marker) => m !== marker),
    })),
  clearMarkers: () => set({ markers: [] }),
  getMarkers: async (userUid: any) => {
    const markersData = await getMarkers(userUid);
    set({ markers: markersData });
  },
  getFriendsMarkers: async (userUid: any) => {
    const markersData = await getFriendsMarkers(userUid);
    set((state: any) => ({ markers: [...state.markers, ...markersData] }));
  },
}));

export default useMarkerStore;

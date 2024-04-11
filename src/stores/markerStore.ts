import { db } from "@/db/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { create } from "zustand";

interface Marker {
  name: string;
  description: string | null;
  tags: string[];
  address: string | null;
  latitude: number;
  longitude: number;
  user: {
    uid: string | null;
    displayName: string | null;
  };
}

const useMarkerStore = create((set: any) => ({
  markers: [] as Marker[],
  addMarker: async (marker: Marker) =>
    set((state: any) => {
      const markersCollectionRef = collection(db, "markers");
      addDoc(markersCollectionRef, marker);
      return { markers: [...state.markers, marker] };
    }),
  removeMarker: (marker: Marker) =>
    set((state: any) => ({
      markers: state.markers.filter((m: Marker) => m !== marker),
    })),
  clearMarkers: () => set({ markers: [] }),
  getMarkers: async (user: any) => {
    const markersCollectionRef = collection(db, "markers");
    const querry = query(markersCollectionRef, where("userUid", "==", user));
    const querySnapshot = await getDocs(querry);
    const markersData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    set({ markers: markersData });
  },
}));

export { useMarkerStore };

"use client";
import ModalCreateMarker from "@/components/modelCreateMarker";
import { useAuthStore } from "@/store/authStore";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState } from "react";
import Map, { GeolocateControl, Marker, NavigationControl } from "react-map-gl";
import classes from "../Page.module.css";

export default function Home() {
  const { user } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);

  interface Marker {
    longitude: number;
    latitude: number;
  }

  const [markers, setMarkers] = useState<Marker[]>([]);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_APIKEY;

  // const handleMapClick = (event: { lngLat: any }) => {
  //   const { lngLat } = event;
  //   const newMarker = {
  //     longitude: lngLat.lng,
  //     latitude: lngLat.lat,
  //   };
  //   setMarkers([...markers, newMarker]);
  //   const colref = collection(db, "markers");
  //   addDoc(colref, {
  //     location: newMarker.latitude + "," + newMarker.longitude,
  //   });
  // };

  // const clearMarker = () => {
  //   setMarkers([]);
  // };

  return (
    <main className={classes.mainStyle}>
      <Map
        mapboxAccessToken={mapboxToken}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: "100%", height: "90%" }}
        initialViewState={{
          latitude: 35.668641,
          longitude: 139.750567,
          zoom: 10,
        }}
        maxZoom={30}
        minZoom={3}
      >
        <GeolocateControl position="top-left" />
        <NavigationControl position="top-left" />
        {markers.map((marker, index) => (
          <Marker
            key={index}
            longitude={marker.longitude}
            latitude={marker.latitude}
          />
        ))}
        <ModalCreateMarker />
      </Map>
    </main>
  );
}

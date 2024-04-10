"use client";
import ModalCreateMarker from "@/components/modelCreateMarker";
import { useAuthStore } from "@/store/authStore";
import "mapbox-gl/dist/mapbox-gl.css";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Map, { GeolocateControl, Marker, NavigationControl } from "react-map-gl";
import classes from "../Page.module.css";

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  interface Marker {
    longitude: number;
    latitude: number;
  }

  useEffect(() => {
    if (!isAuthenticated) {
      redirect("/login");
    }
  }, [isAuthenticated]);

  const [markers, setMarkers] = useState<Marker[]>([]);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_APIKEY;

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

"use client";
import ModalCreateMarker from "@/components/modalCreateMarker";
import { redirectTo } from "@/lib/actions";
import { useAuthStore } from "@/stores/authStore";
import { useMarkerStore } from "@/stores/markerStore";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import Map, { GeolocateControl, Marker } from "react-map-gl";
import classes from "../Page.module.css";

export default function Home() {
  const { isAuthenticated, user, isAuthChecking } = useAuthStore();
  const { markers, getMarkers } = useMarkerStore();

  const map = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      redirectTo("/login");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthChecking && user?.uid) {
      console.log(user.uid);
      getMarkers(user.uid);
    }
  }, [user, getMarkers, isAuthChecking]);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_APIKEY;

  return (
    <main className={classes.mainStyle}>
      <Map
        mapboxAccessToken={mapboxToken}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: "100%", height: "90%" }}
        initialViewState={{
          latitude: 45.75208233358573,
          longitude: 4.839489220284681,
          zoom: 12,
        }}
        maxZoom={30}
        minZoom={3}
        ref={map}
      >
        <GeolocateControl position="top-left" />
        {markers.map((marker, index) => {
          return (
            <Marker
              key={index}
              latitude={marker.latitude}
              longitude={marker.longitude}
              style={{
                backgroundColor: "#ff0000", // Couleur de fond rouge
                width: "20px", // Largeur du marqueur
                height: "20px", // Hauteur du marqueur, // Rendre le marqueur circulaire
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "2px solid #ffffff",
              }}
              onClick={() => {
                console.log(marker);
              }}
            />
          );
        })}
        <ModalCreateMarker />
      </Map>
    </main>
  );
}

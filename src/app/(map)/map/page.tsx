"use client";

import { useEffect, useRef, useState } from "react";
import Map, { GeolocateControl, Marker } from "react-map-gl";
import { useAuthStore } from "@/stores/authStore";
import { Switch } from "@/components/ui/switch";
import ModalMarker from "@/components/modalMarker";
import useMarkerStore from "@/stores/markerStore";
import classes from "../../Page.module.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Home() {
  const [displayFriendsMarkers, setDisplayFriendsMarkers] = useState<boolean>(false);
  const [modalMarker, setModalMarker] = useState<any>(null);

  const { user, isAuthChecking } = useAuthStore();
  const { markers, getMarkers, getFriendsMarkers } = useMarkerStore();

  const map = useRef(null);

  useEffect(() => {
    if (!isAuthChecking && user?.uid) {
      getMarkers(user.uid);
      displayFriendsMarkers ? getFriendsMarkers(user.uid) : null;
    }
  }, [
    user,
    getFriendsMarkers,
    getMarkers,
    isAuthChecking,
    displayFriendsMarkers,
  ]);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_APIKEY;

  return (
    <main className={classes.mainStyle}>
      <Map
        mapboxAccessToken={mapboxToken}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: "100%", height: "100%" }}
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
                backgroundColor: "blue", // Couleur de fond rouge
                width: "20px", // Largeur du marqueur
                height: "20px", // Hauteur du marqueur, // Rendre le marqueur circulaire
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "2px solid #ffffff",
                cursor: "pointer",
              }}
              onClick={() => {
                console.log(marker);
                setModalMarker(marker);
              }}
            />
          );
        })}
        <Switch
          checked={displayFriendsMarkers}
          onCheckedChange={() =>
            setDisplayFriendsMarkers(!displayFriendsMarkers)
          }
          className="absolute top-4 right-4 z-10"
        />
        {modalMarker && (
          <ModalMarker marker={modalMarker} setModalMarker={setModalMarker} />
        )}
      </Map>
    </main>
  );
}

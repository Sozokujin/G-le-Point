"use client";

import { ModalListMarkers } from "@/components/map/modalListMarkers";
import ModalMarker from "@/components/modalMarker";
import { redirectTo } from "@/lib/actions";
import { useAuthStore } from "@/stores/authStore";
import useMarkerStore from "@/stores/markerStore";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import type { FeatureCollection } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CircleLayer, MapRef, SymbolLayer } from "react-map-gl";
import Map, { GeolocateControl, Layer, Source } from "react-map-gl";
import classes from "../../Page.module.css";

export default function Home() {
  const [modalMarker, setModalMarker] = useState<any>(null);

  const { isAuthenticated, user, isAuthChecking } = useAuthStore();
  const { markers, getMarkers, getFriendsMarkers } = useMarkerStore();

  const map = useRef<MapRef | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      redirectTo("/login");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthChecking && user?.uid) {
      getMarkers(user.uid);
    }
  }, [user, getFriendsMarkers, getMarkers, isAuthChecking]);

  const handleClickUnclusteredPoint = useCallback((e: any) => {
    const features = e.features[0];
    if (features && features.properties) {
      const properties = features.properties;
      setModalMarker(markers.find((marker) => marker.id === properties.id));
    }
  }, []);

  useEffect(() => {
    if (map.current) {
      const currentMap = map.current.getMap();

      currentMap.on("click", "unclustered-point", handleClickUnclusteredPoint);
    }
  }, [handleClickUnclusteredPoint]);

  if (map.current) {
    const currentMap = map.current.getMap();
    currentMap.on("load", () => {
      currentMap.loadImage(
        "images/logo-glepoint-secondaire.png",
        (error: any, image: any) => {
          if (error) throw error;
          if (!currentMap.hasImage("custom-marker")) {
            currentMap.addImage("custom-marker", image);
          }
        }
      );
    });
  }

  const geoJsonMarker: FeatureCollection = {
    type: "FeatureCollection",
    features: markers.map((marker) => ({
      type: "Feature",
      properties: {
        name: marker.name,
        description: marker.description,
      },
      geometry: {
        type: "Point",
        coordinates: [marker.longitude, marker.latitude],
      },
    })),
  };

  const clusterLayer: CircleLayer = {
    id: "cluster",
    type: "circle",
    source: "my-data",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#51bbd6",
        10,
        "#f1f075",
        100,
        "#f28cb1",
      ],
      "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
    },
  };

  const clusterCountLayer: SymbolLayer = {
    id: "cluster-count",
    type: "symbol",
    source: "my-data",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
  };

  const unclusteredPointLayer: SymbolLayer = {
    id: "unclustered-point",
    type: "symbol",
    source: "my-data",
    filter: ["!", ["has", "point_count"]],
    layout: {
      "icon-image": "custom-marker",
      "icon-size": 0.5,
      "icon-allow-overlap": true,
    },
  };

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
        <Source
          id="my-data"
          type="geojson"
          data={geoJsonMarker}
          cluster={true}
          clusterMaxZoom={10} // Max zoom to cluster points on
          clusterRadius={100} // Radius of each cluster when clustering points
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>

        <GeolocateControl position="top-left" />
        <ModalListMarkers />
        {modalMarker && (
          <ModalMarker marker={modalMarker} setModalMarker={setModalMarker} />
        )}
      </Map>
    </main>
  );
}

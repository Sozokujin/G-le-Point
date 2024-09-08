"use client";

import Filter from "@/components/map/filter";
import { ModalListMarkers } from "@/components/map/modalListMarkers";
import ModalMarker from "@/components/modalMarker";
import useMarkerStore from "@/stores/markerStore";
import useUserStore from "@/stores/userStore";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import type { Feature, FeatureCollection, Point } from "geojson";
import { CircleLayerSpecification, SymbolLayerSpecification } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import Map, { GeolocateControl, Layer, MapRef, Source } from "react-map-gl";
import classes from "../../Page.module.css";

export default function Home() {
  const { currentUser } = useUserStore();
  const [modalMarker, setModalMarker] = useState<any>(null);
  const [showFriends, setShowFriends] = useState(true);
  const [showGroups, setShowGroups] = useState(true);
  const [showPublic, setShowPublic] = useState(true);
  const map = useRef<MapRef | null>(null);
  const {
    userMarkers,
    friendsMarkers,
    groupsMarkers,
    publicMarkers,
    lastMarker,
    getMarkers,
    getFriendsMarkers,
    getGroupsMarkers,
    getPublicMarkers,
    clearLastMarker,
  } = useMarkerStore();

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      getMarkers(currentUser.uid);
      getFriendsMarkers(currentUser.uid);
      getGroupsMarkers(currentUser.uid);
      getPublicMarkers(currentUser.uid);
    }
  }, [currentUser, getFriendsMarkers, getMarkers, getGroupsMarkers]);

  const handleClickUnclusteredPoint = (e: any) => {
    const features = e.features[0];

    if (features && features.properties && map.current) {
      const currentMap = map.current.getMap();
      const properties = features.properties;
      setModalMarker(
        userMarkers.find((marker) => marker.id === properties.id) ||
          friendsMarkers.find((marker) => marker.id === properties.id) ||
          groupsMarkers.find((marker) => marker.id === properties.id) ||
          publicMarkers.find((marker) => marker.id === properties.id)
      );
      currentMap.flyTo({
        center: features.geometry.coordinates,
        zoom: 15,
      });
    }
  };

  useEffect(() => {
    console.log("modalMarker", modalMarker);
  }, [modalMarker]);

  useEffect(() => {
    if (lastMarker && map.current) {
      const currentMap = map.current.getMap();

      currentMap.flyTo({
        center: [lastMarker.longitude, lastMarker.latitude],
        zoom: 15,
      });
      clearLastMarker();
    }
  }, [lastMarker, clearLastMarker]);

  if (map.current) {
    const currentMap = map.current.getMap();
    currentMap.on("load", () => {
      currentMap.loadImage("images/logo-user.png", (error: any, image: any) => {
        if (error) throw error;
        if (!currentMap.hasImage("logo-user")) {
          currentMap.addImage("logo-user", image);
        }
      });
      currentMap.loadImage(
        "images/logo-friend.png",
        (error: any, image: any) => {
          if (error) throw error;
          if (!currentMap.hasImage("logo-friend")) {
            currentMap.addImage("logo-friend", image);
          }
        }
      );
      currentMap.loadImage(
        "images/logo-group.png",
        (error: any, image: any) => {
          if (error) throw error;
          if (!currentMap.hasImage("logo-group")) {
            currentMap.addImage("logo-group", image);
          }
        }
      );
      currentMap.loadImage(
        "images/logo-public.png",
        (error: any, image: any) => {
          if (error) throw error;
          if (!currentMap.hasImage("logo-public")) {
            currentMap.addImage("logo-public", image);
          }
        }
      );
    });

    currentMap.on("mouseenter", "unclustered-point", () => {
      currentMap.getCanvas().style.cursor = "pointer";
    });

    currentMap.on("mouseleave", "unclustered-point", () => {
      currentMap.getCanvas().style.cursor = "";
    });

    currentMap.on("click", "unclustered-point", handleClickUnclusteredPoint);
  }

  const combinedMarkers: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: [
      ...userMarkers.map<Feature<Point>>((marker) => ({
        type: "Feature",
        properties: {
          id: marker.id,
          name: marker.name,
          description: marker.description,
          type: "user",
        },
        geometry: {
          type: "Point",
          coordinates: [marker.longitude, marker.latitude],
        },
      })),
      ...(showFriends
        ? friendsMarkers.map<Feature<Point>>((marker) => ({
            type: "Feature",
            properties: {
              id: marker.id,
              name: marker.name,
              description: marker.description,
              likedBy: marker.likedBy,
              likeCount: marker.likeCount,
              type: "friend",
            },
            geometry: {
              type: "Point",
              coordinates: [marker.longitude, marker.latitude],
            },
          }))
        : []),
      ...(showGroups
        ? groupsMarkers.map<Feature<Point>>((marker) => ({
            type: "Feature",
            properties: {
              id: marker.id,
              name: marker.name,
              description: marker.description,
              likedBy: marker.likedBy,
              likeCount: marker.likeCount,
              type: "group",
            },
            geometry: {
              type: "Point",
              coordinates: [marker.longitude, marker.latitude],
            },
          }))
        : []),
      ...(showPublic
        ? publicMarkers.map<Feature<Point>>((marker) => ({
            type: "Feature",
            properties: {
              id: marker.id,
              name: marker.name,
              description: marker.description,
              likedBy: marker.likedBy,
              likeCount: marker.likeCount,
              type: "public",
            },
            geometry: {
              type: "Point",
              coordinates: [marker.longitude, marker.latitude],
            },
          }))
        : []),
    ],
  };

  const clusterLayer: CircleLayerSpecification = {
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

  const clusterCountLayer: SymbolLayerSpecification = {
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

  const unclusteredPointLayer: SymbolLayerSpecification = {
    id: "unclustered-point",
    type: "symbol",
    source: "my-data",
    filter: ["!", ["has", "point_count"]],
    layout: {
      "icon-image": [
        "match",
        ["get", "type"],
        "user",
        "logo-user",
        "friend",
        "logo-friend",
        "group",
        "logo-group",
        "public",
        "logo-public",
        "default-marker",
      ],
      "icon-size": 0.5,
      "icon-allow-overlap": true,
      "icon-anchor": "bottom",
    },
  };

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_APIKEY;

  return (
    <main className={classes.mainStyle}>
      <Filter
        showFriends={showFriends}
        setShowFriends={setShowFriends}
        showGroups={showGroups}
        setShowGroups={setShowGroups}
        showPublic={showPublic}
        setShowPublic={setShowPublic}
      />
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
          data={combinedMarkers}
          cluster={true}
          clusterMaxZoom={10}
          clusterRadius={100}
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

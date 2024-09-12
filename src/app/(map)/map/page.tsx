'use client';

import type { Feature, FeatureCollection, Point } from 'geojson';
import { CircleLayerSpecification, SymbolLayerSpecification } from 'mapbox-gl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map, { GeolocateControl, Layer, MapRef, Source } from 'react-map-gl';
import ModalMarker from '@/components/modalMarker';
import ListButtonsMaps from '@/components/stripe/listButtonsMap';
import { ModalListMarkers } from '@/components/map/modalListMarkers';
import Filter from '@/components/map/filter';
import useMarkerStore from '@/stores/markerStore';
import useUserStore from '@/stores/userStore';
import { Marker } from '@/types/index';
import classes from '../../Page.module.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function Home() {
    const { currentUser } = useUserStore();
    const {
        userMarkers,
        friendsMarkers,
        groupsMarkers,
        publicMarkers,
        lastMarker,
        getUserMarkers,
        getFriendsMarkers,
        getGroupsMarkers,
        getPublicMarkers,
        clearLastMarker
    } = useMarkerStore();

    const [modalMarker, setModalMarker] = useState<Marker | null>(null);
    const [showFriends, setShowFriends] = useState<boolean>(true);
    const [showGroups, setShowGroups] = useState<boolean>(true);
    const [showPublic, setShowPublic] = useState<boolean>(true);

    const map = useRef<MapRef | null>(null);
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_APIKEY;

    const allMarkersFiltered = useMemo<FeatureCollection<Point>>(() => {
        const getMarkerGeoJson = (markers: Marker[], markerType: string): Feature<Point>[] => {
            return markers.map((marker: Marker) => ({
                type: 'Feature',
                properties: {
                    ...marker,
                    type: markerType
                },
                geometry: {
                    type: 'Point',
                    coordinates: [marker.longitude, marker.latitude]
                }
            }));
        };

        return {
            type: 'FeatureCollection',
            features: [
                ...getMarkerGeoJson(userMarkers, 'user'),
                ...(showFriends ? getMarkerGeoJson(friendsMarkers, 'friend') : []),
                ...(showGroups ? getMarkerGeoJson(groupsMarkers, 'group') : []),
                ...(showPublic ? getMarkerGeoJson(publicMarkers, 'public') : [])
            ]
        };
    }, [userMarkers, friendsMarkers, groupsMarkers, publicMarkers, showFriends, showGroups, showPublic]);

    const onMapLoad = useCallback(() => {
        const currentMap = map.current!;

        const loadImage = (url: string, id: string) => {
            currentMap.loadImage(url, (error: any, image: any) => {
                if (error) throw error;
                if (!currentMap.hasImage(id)) {
                    currentMap.addImage(id, image);
                }
            });
        };

        loadImage('images/logo-user.png', 'logo-user');
        loadImage('images/logo-friend.png', 'logo-friend');
        loadImage('images/logo-group.png', 'logo-group');
        loadImage('images/logo-public.png', 'logo-public');
    }, []);

    const onMarkerClick = useCallback((e: any) => {
        const clickedFeature = e.features[0];
        if (!clickedFeature || !clickedFeature.properties || !map.current) return;

        setModalMarker({
            ...clickedFeature.properties,
            user: JSON.parse(clickedFeature.properties.user)
        });

        map.current.flyTo({
            center: clickedFeature.geometry.coordinates,
            zoom: 15
        });
    }, []);

    useEffect(() => {
        if (currentUser && currentUser.uid) {
            getUserMarkers(currentUser.uid);
            getFriendsMarkers(currentUser.uid);
            getGroupsMarkers(currentUser.uid);
            getPublicMarkers(currentUser.uid);
        }
    }, [currentUser, getUserMarkers, getFriendsMarkers, getGroupsMarkers, getPublicMarkers]);

    useEffect(() => {
        if (lastMarker && map.current) {
            const currentMap = map.current.getMap();

            currentMap.flyTo({
                center: [lastMarker.longitude, lastMarker.latitude],
                zoom: 15
            });
            clearLastMarker();
        }
    }, [lastMarker, clearLastMarker]);

    const clusterLayer: CircleLayerSpecification = {
        id: 'cluster',
        type: 'circle',
        source: 'my-data',
        filter: ['has', 'point_count'],
        paint: {
            'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 10, '#f1f075', 100, '#f28cb1'],
            'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
        }
    };

    const clusterCountLayer: SymbolLayerSpecification = {
        id: 'cluster-count',
        type: 'symbol',
        source: 'my-data',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    };

    const unclusteredPointLayer: SymbolLayerSpecification = {
        id: 'unclustered-point',
        type: 'symbol',
        source: 'my-data',
        filter: ['!', ['has', 'point_count']],
        layout: {
            'icon-image': [
                'match',
                ['get', 'type'],
                'user',
                'logo-user',
                'friend',
                'logo-friend',
                'group',
                'logo-group',
                'public',
                'logo-public',
                'default-marker'
            ],
            'icon-size': 0.5,
            'icon-allow-overlap': true,
            'icon-anchor': 'bottom'
        }
    };

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
                ref={map}
                onLoad={onMapLoad}
                onClick={onMarkerClick}
                onMouseEnter={() => (map.current!.getCanvas().style.cursor = 'pointer')}
                onMouseLeave={() => (map.current!.getCanvas().style.cursor = '')}
                interactiveLayerIds={['unclustered-point']}
                mapboxAccessToken={mapboxToken}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                style={{ width: '100%', height: '100%' }}
                initialViewState={{
                    latitude: 45.75208233358573,
                    longitude: 4.839489220284681,
                    zoom: 12
                }}
                maxZoom={30}
                minZoom={3}
            >
                <Source
                    id="my-data"
                    type="geojson"
                    data={allMarkersFiltered}
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
                <ListButtonsMaps />
                {modalMarker && <ModalMarker marker={modalMarker} setModalMarker={setModalMarker} />}
            </Map>
        </main>
    );
}

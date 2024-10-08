'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CircleLayerSpecification, SymbolLayerSpecification } from 'mapbox-gl';
import Map, { GeolocateControl, Layer, MapRef, Source } from 'react-map-gl';
import type { Feature, FeatureCollection, Point } from 'geojson';
import ModalListMarkers from '@/components/map/modalListMarkers';
import MarkerPopup from '@/components/map/markerPopup';
import ModalActions from '@/components/map/modalActions';
import useMarkerStore from '@/stores/markerStore';
import useUserStore from '@/stores/userStore';
import { Marker } from '@/types/index';
import classes from '@/app/Page.module.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function Home() {
    const router = useRouter();
    const searchParams = useSearchParams();
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
        getPublicMarkers
    } = useMarkerStore();

    const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
    const [openModalListMarkers, setOpenModalListMarkers] = useState<boolean>(false);
    const [mapIsLoaded, setMapIsLoaded] = useState<boolean>(false);
    const [mapFilters, setMapFilters] = useState({
        showFriends: true,
        showGroups: true,
        showPublic: true,
        satelliteMap: false
    });

    const map = useRef<MapRef | null>(null);
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_APIKEY;

    const mapStyle = useMemo<string>(() => {
        return mapFilters.satelliteMap ? 'mapbox://styles/mapbox/satellite-streets-v12' : 'mapbox://styles/mapbox/streets-v12';
    }, [mapFilters.satelliteMap]);

    const allMarkersFiltered = useMemo<FeatureCollection<Point>>(() => {
        const getMarkerGeoJson = (markers: Marker[], markerType: string): Feature<Point>[] => {
            return markers.map((marker: Marker) => ({
                type: 'Feature',
                properties: {
                    ...marker,
                    type: marker.isPremium ? 'super' : markerType
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
                ...(mapFilters.showFriends ? getMarkerGeoJson(friendsMarkers, 'friend') : []),
                ...(mapFilters.showGroups ? getMarkerGeoJson(groupsMarkers, 'group') : []),
                ...(mapFilters.showPublic ? getMarkerGeoJson(publicMarkers, 'public') : [])
            ]
        };
    }, [userMarkers, friendsMarkers, groupsMarkers, publicMarkers, mapFilters]);

    const onMapLoad = useCallback(() => {
        if (!map.current) return;

        addMarkerImages();
        setMapIsLoaded(true);

        map.current.on('styledata', addMarkerImages);
        map.current.on('dblclick', (e: any) => {
            e.preventDefault();
            setSelectedMarker(null);
            router.push(`/map?create-at=${e.lngLat.lat},${e.lngLat.lng}`);
        });
    }, []);

    const onMarkerClick = useCallback(
        (e: any) => {
            const clickedFeature = e.features[0];
            if (!clickedFeature || !clickedFeature.properties || clickedFeature.properties.id === selectedMarker?.id) return;

            setSelectedMarker({
                ...clickedFeature.properties,
                user: JSON.parse(clickedFeature.properties.user)
            });

            map.current!.flyTo({
                center: clickedFeature.geometry.coordinates,
                zoom: 15
            });
        },
        [selectedMarker]
    );

    useEffect(() => {
        const coords = searchParams.get('go-to');
        if (!mapIsLoaded || !coords) return;

        const [latitude, longitude] = coords.split(',').map((coord) => parseFloat(coord.trim()));
        if (!latitude || !longitude) return;

        setOpenModalListMarkers(false);

        map.current!.flyTo({
            center: [longitude, latitude],
            zoom: 15
        });
    }, [mapIsLoaded, searchParams]);

    useEffect(() => {
        if (currentUser && currentUser.uid) {
            getUserMarkers(currentUser.uid);
            getFriendsMarkers(currentUser.uid);
            getGroupsMarkers(currentUser.uid);
            getPublicMarkers(currentUser.uid);
        }
    }, [currentUser, getUserMarkers, getFriendsMarkers, getGroupsMarkers, getPublicMarkers]);

    useEffect(() => {
        if (!lastMarker || !mapIsLoaded) return;

        map.current!.flyTo({
            center: [lastMarker.longitude, lastMarker.latitude],
            zoom: 15
        });
    }, [lastMarker, mapIsLoaded]);

    const addMarkerImages = () => {
        const currentMap = map.current!;

        const loadImage = (url: string, id: string) => {
            currentMap.loadImage(url, (error: any, image: any) => {
                if (error) throw error;
                if (!currentMap.hasImage(id)) {
                    currentMap.addImage(id, image);
                }
            });
        };

        loadImage('images/map/logo-user.png', 'logo-user');
        loadImage('images/map/logo-super.png', 'logo-super');
        loadImage('images/map/logo-group.png', 'logo-group');
        loadImage('images/map/logo-friend.png', 'logo-friend');
        loadImage('images/map/logo-public.png', 'logo-public');
    };

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
                'super',
                'logo-super',
                'group',
                'logo-group',
                'friend',
                'logo-friend',
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
            <div className="absolute right-4 top-4 z-10">
                <ModalActions filters={mapFilters} setFilters={setMapFilters} setModalListMarkers={setOpenModalListMarkers} />
            </div>
            <Map
                ref={map}
                onLoad={onMapLoad}
                onClick={onMarkerClick}
                doubleClickZoom={false}
                onMouseEnter={() => (map.current!.getCanvas().style.cursor = 'pointer')}
                onMouseLeave={() => (map.current!.getCanvas().style.cursor = '')}
                interactiveLayerIds={['unclustered-point']}
                mapboxAccessToken={mapboxToken}
                mapStyle={mapStyle}
                style={{ width: '100%', height: '100%' }}
                initialViewState={{
                    latitude: 45.75009,
                    longitude: 4.82323,
                    zoom: 12
                }}
                maxZoom={21}
                minZoom={5}
            >
                <Source
                    id="my-data"
                    type="geojson"
                    data={allMarkersFiltered}
                    cluster={true}
                    clusterMaxZoom={11}
                    clusterRadius={75}
                >
                    <Layer {...clusterLayer} />
                    <Layer {...clusterCountLayer} />
                    <Layer {...unclusteredPointLayer} />
                </Source>

                <GeolocateControl position="top-left" />
                <ModalListMarkers open={openModalListMarkers} setOpen={setOpenModalListMarkers} />
                {selectedMarker && <MarkerPopup marker={selectedMarker} setSelectedMarker={setSelectedMarker} />}
            </Map>
        </main>
    );
}

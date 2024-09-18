import { useEffect, useState, useMemo } from 'react';
import { ExclamationTriangleIcon, HandThumbUpIcon } from '@heroicons/react/20/solid';
import {
    ExclamationTriangleIcon as ExclamationTriangleIconOutline,
    HandThumbUpIcon as HandThumbUpIconOutline,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { Popup } from 'react-map-gl';
import { Marker } from '@/types/index';
import { debounce } from '@/lib/utils';
import useMarkerStore from '@/stores/markerStore';
import useUserStore from '@/stores/userStore';

export default function MarkerPopup({
    marker,
    setSelectedMarker
}: {
    marker: Marker;
    setSelectedMarker: (marker: Marker | null) => void;
}) {
    const { currentUser } = useUserStore();
    const { friendsMarkers, groupsMarkers, publicMarkers, toggleLikeMarker, toggleReportMarker } = useMarkerStore();

    const [currentMarker, setCurrentMarker] = useState(marker);

    useEffect(() => {
        if (marker.id === currentMarker.id) return;
        setCurrentMarker(marker);
    }, [marker, currentMarker]);

    const isLiked = useMemo(() => currentMarker.likedBy.includes(currentUser?.uid ?? ''), [currentMarker, currentUser]);
    const isReported = useMemo(() => currentMarker.reportedBy.includes(currentUser?.uid ?? ''), [currentMarker, currentUser]);
    const isUserMarker = useMemo(() => currentUser?.uid === currentMarker.user.uid, [currentUser, currentMarker]);

    useEffect(() => {
        // Keep the local marker data in sync with the store when the user likes or reports the marker
        const updatedMarker = [...friendsMarkers, ...groupsMarkers, ...publicMarkers].find((m) => m.id === marker.id);

        if (updatedMarker) setCurrentMarker(updatedMarker);
    }, [friendsMarkers, groupsMarkers, publicMarkers, marker.id]);

    const handleLike = () => {
        if (!currentUser || !currentMarker || isUserMarker) return;
        debounce(() => toggleLikeMarker(currentMarker.id, currentUser.uid));
    };

    const handleReport = () => {
        if (!currentUser || !currentMarker || isUserMarker) return;
        debounce(() => toggleReportMarker(currentMarker.id, currentUser.uid));
    };

    const closePopup = () => {
        setSelectedMarker(null);
    };

    return (
        <Popup
            longitude={currentMarker.longitude}
            latitude={currentMarker.latitude}
            closeButton={false}
            closeOnClick={false}
            offset={currentMarker.isPremium ? 38 : 24}
            anchor="bottom"
            maxWidth="400px"
            className="w-full p-2"
        >
            <div className="bg-white rounded-lg shadow-md p-4 relative">
                <XMarkIcon onClick={closePopup} className="absolute top-1 right-1 h-5 w-5 cursor-pointer" />
                <div className="flex w-full items-center justify-between gap-6">
                    <div className="flex-1 flex items-center gap-3">
                        <h3 className="truncate text-sm font-semibold text-gray-900 !my-0">{currentMarker.name}</h3>
                        <div className="flex flex-col gap-1">
                            {currentMarker.isPremium && (
                                <span className="truncate w-fit rounded-full bg-[#FFD700]/20 px-1.5 py-0.5 text-xs font-medium text-orange-400 ring-1 ring-inset ring-[#FFD700]/50">
                                    Super-point
                                </span>
                            )}
                            <span className="truncate w-fit rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                {currentMarker.tags}
                            </span>
                        </div>
                    </div>
                    <p className="!leading-6">Par : {currentMarker.user.username}</p>
                </div>
                <p className="mt-1 text-sm !leading-5 text-gray-500">{currentMarker.description || 'Aucune description'}</p>
                <div className="mt-4 flex justify-around gap-4">
                    <button
                        onClick={handleLike}
                        disabled={isUserMarker}
                        className="inline-flex gap-2 text-glp-green disabled:text-slate-600"
                    >
                        {isLiked ? <HandThumbUpIcon className="h-6 w-6" /> : <HandThumbUpIconOutline className="h-6 w-6" />}
                        <span>{currentMarker.likeCount}</span>
                    </button>
                    {!isUserMarker && (
                        <button onClick={handleReport} className="inline-flex gap-2 text-red-500">
                            {isReported ? (
                                <>
                                    <ExclamationTriangleIcon className="h-6 w-6"></ExclamationTriangleIcon>
                                    <span>Annuler le signalement</span>
                                </>
                            ) : (
                                <>
                                    <ExclamationTriangleIconOutline className="h-6 w-6 text-md bg-white border-glp-red cursor-pointer"></ExclamationTriangleIconOutline>
                                    <span>Signaler</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </Popup>
    );
}

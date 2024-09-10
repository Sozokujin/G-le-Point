import { debounce } from '@/lib/utils';
import useMarkerStore from '@/stores/markerStore';
import useUserStore from '@/stores/userStore';
import { ExclamationTriangleIcon, HandThumbUpIcon } from '@heroicons/react/20/solid';
import {
    ExclamationTriangleIcon as ExclamationTriangleIconOutline,
    HandThumbUpIcon as HandThumbUpIconOutline,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';

const ModalMarker = ({ marker, setModalMarker }: any) => {
    const { currentUser } = useUserStore();
    const {
        toggleLikeMarker,
        toggleReportMarker,
        likedMarkers,
        reportedMarkers,
        userMarkers // Access markers from the state
    } = useMarkerStore();

    // Local state to track the marker in the component
    const [currentMarker, setCurrentMarker] = useState(marker);

    useEffect(() => {
        // Keep the local marker data in sync with the store (for re-renders)
        const updatedMarker = userMarkers.find((m) => m.id === marker.id);
        if (updatedMarker) {
            setCurrentMarker(updatedMarker);
        }
    }, [userMarkers, marker.id]);

    const liked = marker.likedBy.includes(currentUser?.uid ?? '');
    const reported = marker.reportedBy.includes(currentUser?.uid ?? '');

    const handleLike = () => {
        toggleLikeMarker(currentMarker.id, currentUser?.uid ?? '');
    };

    const handleReport = () => {
        toggleReportMarker(currentMarker.id, currentUser?.uid ?? '');
    };

    return (
        <div
            onClick={(e) => e.target === e.currentTarget && setModalMarker(null)}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
            <div className="relative bg-white p-4 rounded-lg shadow-lg w-3/4 md:max-w-[500px]">
                <XMarkIcon onClick={() => setModalMarker(null)} className="absolute top-2 right-2 h-6 w-6 cursor-pointer" />
                <div className="flex gap-4">
                    <div className="flex flex-col gap-4">
                        <Badge className="text-xl font-bold">{currentMarker.name}</Badge>
                        <Badge className="text-xl">{currentMarker.user.username}</Badge>
                    </div>
                    <div>PHOTO</div>
                </div>
                <Textarea
                    className="w-full h-56 resize-none mt-6 focus-visible:ring-0"
                    value={currentMarker.description}
                    readOnly
                />
                <div className="flex gap-2 mt-4 justify-between">
                    <Badge className="text-md">{currentMarker.tags}</Badge>
                    <div>
                        <Badge
                            onClick={debounce(() => handleLike())}
                            className={`text-md bg-white border-glp-green cursor-pointer`}
                        >
                            {liked ? (
                                <HandThumbUpIcon className="h-6 w-6 text-glp-green" />
                            ) : (
                                <HandThumbUpIconOutline className="h-6 w-6 text-glp-green" />
                            )}
                            <span className="text-glp-green ml-2">{currentMarker.likeCount}</span>
                        </Badge>
                        <Badge
                            onClick={debounce(() => handleReport())}
                            className="text-md bg-white border-red-500 cursor-pointer"
                        >
                            {reported ? (
                                <ExclamationTriangleIcon className="h-6 w-6 text-red-500"></ExclamationTriangleIcon>
                            ) : (
                                <ExclamationTriangleIconOutline className="h-6 w-6 text-red-500 text-md bg-white border-glp-red cursor-pointer"></ExclamationTriangleIconOutline>
                            )}
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalMarker;

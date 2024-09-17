'use client';

import { useState } from 'react';
import { Marker } from '@/types/index';
import { useIsMobile } from '@/utils/isMobile';
import { Button } from '@/components/ui/button';
import { Check, Clipboard, MapPin } from 'lucide-react';

interface MarkerListProps {
    markers: Marker[];
    showUser?: boolean;
}

export const MarkerList = ({ markers, showUser = false }: MarkerListProps) => {
    const { isMobile } = useIsMobile();
    const [showPopupCopy, setShowPopupCopy] = useState<{ [key: string]: boolean }>({});

    const copyToClipboard = (marker: Marker) => {
        navigator.clipboard.writeText(marker.latitude + ' , ' + marker.longitude);
        setShowPopupCopy((prev) => ({ ...prev, [marker.id!]: true }));
        setTimeout(() => {
            setShowPopupCopy((prev) => ({ ...prev, [marker.id!]: false }));
        }, 3000);
    };

    if (markers.length === 0) {
        return (
            <div className="flex items-center justify-center grow">
                <p className="text-lg text-slate-400">Aucun Point</p>
            </div>
        );
    }

    return isMobile ? (
        <div className="flex flex-col space-y-4 p-4 h-full overflow-y-auto">
            {markers.map((marker) => (
                <div
                    key={marker.id}
                    className="p-4 bg-slate-100 rounded-lg shadow hover:shadow-md transition-shadow duration-300"
                >
                    <div className="mb-4 flex justify-between items-start">
                        <div className="font-bold text-green-700">{marker.name}</div>
                        {showUser && <div className="text-sm text-slate-400 truncate">{marker.user.username || 'Sans Nom'}</div>}
                    </div>
                    <div className="w-full flex justify-between mb-3">
                        {marker.description && (
                            <div className="text-sm text-slate-500 truncate flex-1 mr-2">{marker.description}</div>
                        )}
                        {marker.address && (
                            <div className="text-sm text-slate-400 truncate flex-shrink-0">
                                {marker.address || `${marker.latitude}, ${marker.longitude}`}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full w-fit mr-auto">
                            {marker.tags || 'Autre'}
                        </div>
                        <Button
                            className="p-1 w-6 h-6 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors duration-300"
                            onClick={() => copyToClipboard(marker)}
                        >
                            {!showPopupCopy[marker.id] ? <Clipboard className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </Button>
                        <Button className="p-1 w-6 h-6 rounded-full bg-green-100 hover:bg-green-200 text-green-700 transition-colors duration-300">
                            <MapPin className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    ) : (
        <div className="space-y-6 p-6 bg-gradient-to-br from-glp-green-50 to-blue-50 rounded-xl overflow-auto w-full">
            {markers.map((marker) => (
                <div
                    key={marker.id}
                    className="bg-white shadow-md rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-grow">
                            <h3 className="text-xl font-semibold text-green-700">{marker.name}</h3>
                            {showUser && <p className="text-sm text-slate-500 mt-1">{marker.user.username || 'Sans Nom'}</p>}
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                            {marker.tags || 'Autre'}
                        </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3 leading-relaxed">{marker.description || 'Aucune description'}</p>
                    <p className="text-sm text-slate-500 mb-4 italic">
                        {marker.address || `${marker.latitude}, ${marker.longitude}`}
                    </p>
                    <div className="flex justify-end space-x-3">
                        <Button
                            className="p-2 w-10 h-10 rounded-full bg-green-100 hover:bg-green-200 text-green-700 transition-colors duration-300"
                            onClick={() => copyToClipboard(marker)}
                        >
                            {!showPopupCopy[marker.id] ? <Clipboard className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                        </Button>
                        <Button className="p-2 w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors duration-300">
                            <MapPin className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
};

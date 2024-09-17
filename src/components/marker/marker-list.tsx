'use client';

import { useState } from 'react';
import { Marker } from '@/types/index';
import { useIsMobile } from '@/utils/isMobile';
import useMarkerStore from '@/stores/markerStore';
import { ClipboardDocumentIcon, CheckIcon, MapPinIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface MarkerListProps {
    markers: Marker[];
    showUser?: boolean;
    forceMobileDisplay?: boolean;
    allowDelete?: boolean;
    className?: string;
}

export const MarkerList = ({
    markers,
    showUser = false,
    forceMobileDisplay = false,
    allowDelete = false,
    className = ''
}: MarkerListProps) => {
    const { isMobile } = useIsMobile();
    const { deleteMarker } = useMarkerStore();

    const [showPopupCopy, setShowPopupCopy] = useState<{ [key: string]: boolean }>({});

    const copyToClipboard = (marker: Marker) => {
        navigator.clipboard.writeText(marker.latitude + ' , ' + marker.longitude);
        setShowPopupCopy((prev) => ({ ...prev, [marker.id!]: true }));
        setTimeout(() => {
            setShowPopupCopy((prev) => ({ ...prev, [marker.id!]: false }));
        }, 3000);
    };

    const DeleteMarkerModal = ({ marker }: { marker: Marker }) => {
        if (!allowDelete) return null;

        return (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="secondary" className="p-1 w-6 h-6 rounded-full">
                        <TrashIcon />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce point ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action ne peut pas être annulée. Cela supprimera définitivement le point.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMarker(marker.id)} className="bg-red-500 hover:bg-red-400">
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    };

    if (markers.length === 0) {
        return (
            <div className="flex items-center justify-center grow">
                <p className="text-lg text-slate-400">Aucun Point</p>
            </div>
        );
    }

    return isMobile || forceMobileDisplay ? (
        <div className={'flex flex-col space-y-4 p-4 h-full overflow-y-auto ' + className}>
            {markers.map((marker) => (
                <div key={marker.id} className="p-4 bg-slate-100 rounded-lg shadow">
                    <div className=" mb-4 flex justify-between">
                        <div className="font-bold">{marker.name}</div>
                        {showUser && (
                            <div className="text-sm text-slate-400 truncate">{marker.user.username || 'Aucun utilisateur'}</div>
                        )}
                    </div>
                    <div className="w-full flex justify-between mb-3">
                        {marker.description && <div className="text-sm text-slate-400 truncate">{marker.description}</div>}
                        {marker.address && (
                            <div className="text-sm text-slate-400 truncate">
                                {marker.address || marker.latitude + ' , ' + marker.longitude}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full w-fit mr-auto">
                            {marker.tags || 'Autre'}
                        </div>
                        <Button onClick={() => copyToClipboard(marker)} className="p-1 w-6 h-6 rounded-full">
                            {!showPopupCopy[marker.id!] ? <ClipboardDocumentIcon /> : <CheckIcon />}
                        </Button>
                        <Button className="p-1 w-6 h-6 rounded-full">
                            <MapPinIcon />
                        </Button>
                        <DeleteMarkerModal marker={marker} />
                    </div>
                </div>
            ))}
        </div>
    ) : (
        <Table>
            <TableHeader className="bg-slate-200">
                <TableRow>
                    <TableHead className="w-[150px] font-bold">Point</TableHead>
                    {showUser && <TableHead className="font-bold">Utilisateur</TableHead>}
                    <TableHead className="font-bold">Tags</TableHead>
                    <TableHead className="font-bold">Description</TableHead>
                    <TableHead className="font-bold">Adresse</TableHead>
                    <TableHead className="text-center font-bold w-24">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {markers.map((marker) => (
                    <TableRow key={marker.id}>
                        <TableCell className="font-medium whitespace-nowrap truncate">{marker.name}</TableCell>
                        {showUser && (
                            <TableCell className="text-slate-400 truncate">
                                {marker.user.username || 'Aucun utilisateur'}
                            </TableCell>
                        )}
                        <TableCell>
                            <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
                                {marker.tags || 'Autre'}
                            </span>
                        </TableCell>
                        <TableCell className="text-slate-400 truncate">{marker.description || 'Aucune description'}</TableCell>
                        <TableCell className="text-slate-400 truncate">
                            {marker.address || marker.latitude + ' , ' + marker.longitude}
                        </TableCell>
                        <TableCell className="text-center w-24">
                            <Button onClick={() => copyToClipboard(marker)} className="p-1 w-6 h-6 rounded-full mr-4">
                                {!showPopupCopy[marker.id!] ? <ClipboardDocumentIcon /> : <CheckIcon />}
                            </Button>
                            <Button className="p-1 w-6 h-6 rounded-full">
                                <MapPinIcon />
                            </Button>
                            <DeleteMarkerModal marker={marker} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

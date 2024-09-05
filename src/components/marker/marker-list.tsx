"use client";

import { Marker } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ClipboardDocumentIcon,
  CheckIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import { Button } from "../ui/button";
import { useState } from "react";

interface MarkerListProps {
  markers: Marker[];
}

export const MarkerList: React.FC<MarkerListProps> = ({ markers }) => {
  const [showPopupCopy, setShowPopupCopy] = useState<{
    [key: string]: boolean;
  }>({});

  const copyToClipboard = (marker: Marker) => {
    navigator.clipboard.writeText(marker.latitude + " , " + marker.longitude);
    setShowPopupCopy((prev) => ({ ...prev, [marker.id]: true }));
    setTimeout(() => {
      setShowPopupCopy((prev) => ({ ...prev, [marker.id]: false }));
    }, 3000);
  };

  return (
    <>
      {markers.length === 0 ? (
        <div className="flex items-center justify-center grow">
          <p className="text-lg text-slate-400">Aucun Point</p>
        </div>
      ) : (
        <Table>
          <TableHeader className="bg-slate-200">
            <TableRow>
              <TableHead className="w-[150px] font-bold">Point</TableHead>
              <TableHead className="font-bold">Tags</TableHead>
              <TableHead className="text-right font-bold">Coords</TableHead>
              <TableHead className="text-right font-bold w-24">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {markers.map((marker) => (
              <TableRow key={marker.id}>
                <TableCell className="font-medium whitespace-nowrap truncate">
                  {marker.name}
                </TableCell>
                <TableCell>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    {marker.tags}
                  </span>
                </TableCell>
                <TableCell className="text-center w-24">
                  <Button
                    className="p-1 w-6 h-6 rounded-full"
                    onClick={() => copyToClipboard(marker)}
                  >
                    {!showPopupCopy[marker.id] ? (
                      <ClipboardDocumentIcon />
                    ) : (
                      <CheckIcon />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <Button className="p-1 w-6 h-6 rounded-full">
                    <MapPinIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

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
import useIsMobile from "@/utils/isMobile";

interface MarkerListProps {
  markers: Marker[];
}

export const MarkerList: React.FC<MarkerListProps> = ({ markers }) => {
  const [showPopupCopy, setShowPopupCopy] = useState<{
    [key: string]: boolean;
  }>({});
  const isMobile = useIsMobile();
  const copyToClipboard = (marker: Marker) => {
    navigator.clipboard.writeText(marker.latitude + " , " + marker.longitude);
    setShowPopupCopy((prev) => ({ ...prev, [marker.id!]: true }));
    setTimeout(() => {
      setShowPopupCopy((prev) => ({ ...prev, [marker.id!]: false }));
    }, 3000);
  };
  return (
    <>
      {markers.length === 0 ? (
        <div className="flex items-center justify-center grow">
          <p className="text-lg text-slate-400">Aucun Point</p>
        </div>
      ) : (
        <>
          {isMobile ? (
            <div className="flex flex-col space-y-4 p-4 h-full overflow-y-auto">
              {markers.map((marker) => (
                <div
                  key={marker.id}
                  className="p-4 bg-slate-100 rounded-lg shadow"
                >
                  <div className="font-bold mb-4">{marker.name}</div>
                  <div className="w-full flex justify-between mb-3">
                    {marker.description && (
                      <div className="text-sm text-slate-400 truncate">
                        {marker.description}
                      </div>
                    )}
                    {marker.address && (
                      <div className="text-sm text-slate-400 truncate">
                        {marker.address}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full w-fit mr-auto">
                      {marker.tags || "Autre"}
                    </div>
                    <Button
                      className="p-1 w-6 h-6 rounded-full"
                      onClick={() => copyToClipboard(marker)}
                    >
                      {!showPopupCopy[marker.id!] ? (
                        <ClipboardDocumentIcon />
                      ) : (
                        <CheckIcon />
                      )}
                    </Button>
                    <Button className="p-1 w-6 h-6 rounded-full">
                      <MapPinIcon />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-200">
                <TableRow>
                  <TableHead className="w-[150px] font-bold">Point</TableHead>
                  <TableHead className="font-bold">Tags</TableHead>
                  <TableHead className="font-bold">Description</TableHead>
                  <TableHead className="font-bold">Adresse</TableHead>
                  <TableHead className="text-center font-bold w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {markers.map((marker) => (
                  <TableRow key={marker.id}>
                    <TableCell className="font-medium whitespace-nowrap truncate">
                      {marker.name}
                    </TableCell>
                    <TableCell>
                      <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
                        {marker.tags || "Autre"}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-400 truncate">
                      {marker.description || "Aucune description"}
                    </TableCell>
                    <TableCell className="text-slate-400 truncate">
                      {marker.address || "Aucune adresse"}
                    </TableCell>
                    <TableCell className="text-center w-24">
                      <Button
                        className="p-1 w-6 h-6 rounded-full mr-4"
                        onClick={() => copyToClipboard(marker)}
                      >
                        {!showPopupCopy[marker.id!] ? (
                          <ClipboardDocumentIcon />
                        ) : (
                          <CheckIcon />
                        )}
                      </Button>
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
      )}
    </>
  );
};

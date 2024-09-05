"use client";

import { Marker } from "@/types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface MarkerListProps {
  markers: Marker[];
}

export const MarkerList: React.FC<MarkerListProps> = ({ markers }) => {
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
              <TableHead className="w-[150px]">Point</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Coords</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {markers.map((marker) => (
              <TableRow key={marker.id}>
                <TableCell className="font-medium whitespace-nowrap truncate">{marker.name}</TableCell>
                <TableCell>{marker.tags}</TableCell>
                <TableCell className="text-right">{marker.longitude + marker.latitude}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </>
    );
};
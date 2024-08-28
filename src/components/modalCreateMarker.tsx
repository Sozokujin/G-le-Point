import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/authStore";
import useMarkerStore from "@/stores/markerStore";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import AutocompleteMapbox from "./map/autocompleteMapbox";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";

const ModalCreateMarker = () => {
  const pointNameRef = useRef<HTMLInputElement>(null);
  const pointDescriptionRef = useRef<HTMLInputElement>(null);
  const pointAddressRef = useRef<HTMLInputElement>(null);
  const pointGpsRef = useRef<HTMLInputElement>(null);

  const [display, setDisplay] = useState<"address" | "gps" | "position" | "">(
    ""
  );
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [addressCoordinates, setAddressCoordinates] = useState<number[]>([]);

  const { addMarker } = useMarkerStore();
  const { user } = useAuthStore();

  const handleSelectTag = (value: string) => setSelectedTag(value);

  const handleAddressCoordinates = (coordinates: number[]) => {
    setAddressCoordinates(coordinates);
  };

  const handlePointPrivacy = useCallback(() => {
    setIsPublic((prev) => !prev);
  }, []);

  const addMarkerCommon = useCallback(
    (latitude: number, longitude: number, address = "") => {
      if (user?.uid && user?.displayName) {
        addMarker({
          id: Math.random().toString(36).substring(2, 9),
          name: pointNameRef.current?.value || "Point",
          description: pointDescriptionRef.current?.value || "",
          tags: selectedTag,
          address,
          latitude,
          longitude,
          isPublic,
          user: {
            uid: user.uid,
            displayName: user.displayName,
          },
        });
      }
    },
    [user, selectedTag, isPublic, addMarker]
  );

  const addMarkerWithCurrentLocation = () => {
    if (!navigator.geolocation)
      return alert(
        "La géolocalisation n'est pas disponible sur votre navigateur"
      );

    navigator.geolocation.getCurrentPosition((position) => {
      addMarkerCommon(position.coords.latitude, position.coords.longitude);
    });
  };

  const addMarkerWithAddress = () => {
    if (addressCoordinates.length === 2) {
      addMarkerCommon(
        addressCoordinates[1],
        addressCoordinates[0],
        pointAddressRef.current?.value || ""
      );
    }
  };

  const addMarkerWithGps = () => {
    const gpsValue = pointGpsRef.current?.value || "";
    const [latitude, longitude] = gpsValue.split(",").map(parseFloat);

    if (!latitude || !longitude) {
      return alert("Le point GPS est invalide");
    }

    addMarkerCommon(latitude, longitude);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Link
          href="/map"
          className="block bg-[#37b978] p-2.5 sm:p-3 rounded-full"
        >
          <PlusIcon className="h-8 w-8 text-white" />
        </Link>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un point</DialogTitle>
          <DialogDescription>
            Ajouter un point pour indiquer un lieu sur la carte
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4">
          <span>Privé</span>
          <Switch checked={isPublic} onCheckedChange={handlePointPrivacy} />
          <span>Public</span>
        </div>
        <Label htmlFor="name">Nom du lieu</Label>
        <Input ref={pointNameRef} id="name" type="text" />
        <Label htmlFor="description">Description</Label>
        <Input ref={pointDescriptionRef} id="description" type="text" />
        <Select onValueChange={handleSelectTag}>
          <SelectTrigger>
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="commerce">Commerce</SelectItem>
            <SelectItem value="point-de-vue">Point de vue</SelectItem>
            <SelectItem value="autre">Autre</SelectItem>
          </SelectContent>
        </Select>
        <div className="w-full h-8 flex flex-row border mb-4 text-xs">
          {["address", "gps", "position"].map((mode) => (
            <div
              key={mode}
              className={`h-full w-full flex items-center justify-center cursor-pointer ${
                display === mode
                  ? "outline outline-4 outline-offset-[-4px] outline-primary"
                  : ""
              }`}
              onClick={() => setDisplay(mode as typeof display)}
            >
              {mode === "address" && "Adresse"}
              {mode === "gps" && "Point GPS"}
              {mode === "position" && "Ma position"}
            </div>
          ))}
        </div>
        {display === "address" && (
          <>
            <AutocompleteMapbox
              onAddressCoordinatesSelected={handleAddressCoordinates}
            />
            <DialogClose asChild>
              <Button onClick={addMarkerWithAddress} className="mt-4">
                Enregistrer le point
              </Button>
            </DialogClose>
          </>
        )}
        {display === "gps" && (
          <>
            <Label htmlFor="gps">Point GPS</Label>
            <Input
              id="gps"
              type="text"
              placeholder="Exemple: 48.86127461, 2.334830083"
              ref={pointGpsRef}
            />
            <DialogClose asChild>
              <Button onClick={addMarkerWithGps} className="mt-4">
                Enregistrer le point
              </Button>
            </DialogClose>
          </>
        )}
        {display === "position" && (
          <DialogClose asChild>
            <Button onClick={addMarkerWithCurrentLocation} className="mt-4">
              Enregistrer le point à ma position
            </Button>
          </DialogClose>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalCreateMarker;

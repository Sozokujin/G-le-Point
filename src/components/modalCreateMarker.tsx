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
import { useRef, useState } from "react";
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

const ModalCreateMarker = () => {
  const pointNameRef = useRef<HTMLInputElement>(null);
  const pointDescriptionRef = useRef<HTMLInputElement>(null);
  const pointAddressRef = useRef<HTMLInputElement>(null);
  const pointGpsRef = useRef<HTMLInputElement>(null);

  const [display, setDisplay] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");

  const { addMarker } = useMarkerStore();

  const { user } = useAuthStore();

  const handleSelectTag = (value: string) => {
    console.log(value);
    setSelectedTag(value);
  };

  const addMarkerWithCurrentLocation = () => {
    const geo = navigator.geolocation;
    if (!geo)
      return alert(
        "La géolocalisation n'est pas disponible sur votre navigateur"
      );
    navigator.geolocation.getCurrentPosition((position) => {
      if (user?.uid && user?.displayName) {
        addMarker({
          id: Math.random().toString(36).substring(2, 9),
          name: pointNameRef.current?.value || "Point",
          description: pointDescriptionRef.current?.value || "",
          tags: selectedTag,
          address: "",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          user: {
            uid: user.uid,
            displayName: user.displayName,
          },
        });
      }
    });
  };

  const addMarkerWithAddress = () => {
    if (!pointAddressRef.current?.value) {
      return alert("Veuillez renseigner une adresse");
    }

    if (user?.uid && user?.displayName) {
      addMarker({
        id: Math.random().toString(36).substring(2, 9),
        name: pointNameRef.current?.value || "Point",
        description: pointDescriptionRef.current?.value || "",
        tags: selectedTag,
        address: pointAddressRef.current?.value || "",
        latitude: 0,
        longitude: 0,
        user: {
          uid: user.uid,
          displayName: user.displayName,
        },
      });
    }
  };

  const addMarkerWithGps = () => {
    if (!pointGpsRef.current?.value) {
      return alert("Veuillez renseigner un point GPS");
    }
    const [latitude, longitude] = pointGpsRef.current?.value.split(",");
    if (!latitude || !longitude) {
      return alert("Le point GPS est invalide");
    }
    if (user?.uid && user?.displayName) {
      addMarker({
        id: Math.random().toString(36).substring(2, 9),
        name: pointNameRef.current?.value || "Point",
        description: pointDescriptionRef.current?.value || "",
        tags: selectedTag,
        address: "",
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        user: {
          uid: user.uid,
          displayName: user.displayName,
        },
      });
    }
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
        <Label htmlFor="name">Nom du lieu</Label>
        <Input ref={pointNameRef} id="name" type="text" />
        <Label htmlFor="description">Description</Label>
        <Input ref={pointDescriptionRef} id="description" type="text" />
        <Select onValueChange={handleSelectTag}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent id="test">
            <SelectItem value="commerce">Commerce</SelectItem>
            <SelectItem value="point-de-vue">Point de vue</SelectItem>
            <SelectItem value="autre">Autre</SelectItem>
          </SelectContent>
        </Select>
        <div>
          <div className="w-full h-8 flex flex-row border mb-4 text-xs">
            <div
              className={`h-full w-full flex items-center justify-center cursor-pointer ${
                display == "address"
                  ? "outline outline-4 outline-offset-[-4px] outline-primary"
                  : ""
              }`}
              onClick={() => setDisplay("address")}
            >
              Adresse
            </div>
            <div
              className={`h-full w-full flex items-center justify-center cursor-pointer ${
                display == "gps"
                  ? "outline outline-4 outline-offset-[-4px] outline-primary"
                  : ""
              }`}
              onClick={() => setDisplay("gps")}
            >
              Point GPS
            </div>
            <div
              className={`h-full w-full flex items-center justify-center cursor-pointer ${
                display == "position"
                  ? "outline outline-4 outline-offset-[-4px] outline-primary"
                  : ""
              }`}
              onClick={() => setDisplay("position")}
            >
              Ma position
            </div>
          </div>
          {display == "address" && (
            <>
              <Label htmlFor="address">Adresse</Label>
              <Input ref={pointAddressRef} id="address" type="text" />
              <DialogClose asChild>
                <Button onClick={addMarkerWithAddress} className="mt-4">
                  Enregistrer le point
                </Button>
              </DialogClose>
            </>
          )}
          {display == "gps" && (
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
          {display == "position" && (
            <DialogClose asChild>
              <Button onClick={addMarkerWithCurrentLocation} className="mt-4">
                Enregistrer le point à ma position
              </Button>
            </DialogClose>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCreateMarker;

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addMarkerGroup } from "@/services/firebase/markers";
import { useGroupStore } from "@/stores/groupStore";
import useMarkerStore from "@/stores/markerStore";
import useUserStore from "@/stores/userStore";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import { GroupLine } from "./friends/groups/groupList";
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

const ModalCreateMarker = () => {
  const { currentUser } = useUserStore();
  const { addMarker } = useMarkerStore();
  const { groups, getGroups } = useGroupStore();

  const pointNameRef = useRef<HTMLInputElement>(null);
  const pointDescriptionRef = useRef<HTMLInputElement>(null);
  const pointAddressRef = useRef<HTMLInputElement>(null);
  const pointGpsRef = useRef<HTMLInputElement>(null);

  const [display, setDisplay] = useState<"address" | "gps" | "position" | "">(
    ""
  );
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [addressCoordinates, setAddressCoordinates] = useState<number[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<any[]>([]);
  const [pointVisibility, setPointVisibility] = useState<string | null>(null);

  const mapTags: string[] = [
    "Points de vue",
    "Randonnée et sentiers",
    "Espace vert",
    "Site sportif",
    "Site touristique",
    "Site historique",
    "Site culturel",
    "Centre de loisirs",
    "Commerce",
    "Transport",
    "Restauration",
    "Hébergement",
    "Service public",
    "Espace de santé",
    "Autre",
  ];

  useEffect(() => {
    if (groups.length === 0) {
      getGroups();
    }
  }, [pointVisibility]);

  const toggleGroupSelection = (group: any) => {
    setSelectedGroups((prevSelected) => {
      if (prevSelected.includes(group)) {
        return prevSelected.filter((selected) => selected !== group);
      } else {
        return [...prevSelected, group];
      }
    });
  };

  const handleSelectTag = (value: string) => setSelectedTag(value);

  const handleVisibility = (value: string) => setPointVisibility(value);

  const handleAddressCoordinates = (coordinates: number[]) => {
    setAddressCoordinates(coordinates);
  };

  const addMarkerCommon = useCallback(
    (latitude: number, longitude: number, address = "") => {
      const idMarker = Math.random().toString(36).substring(2, 9);
      if (currentUser?.uid && currentUser?.displayName) {
        addMarker({
          id: idMarker,
          name: pointNameRef.current?.value || "Point",
          description: pointDescriptionRef.current?.value || "",
          tags: selectedTag,
          address,
          latitude,
          longitude,
          visibiltyStatus: pointVisibility,
          createdAt: Date.now(),
          user: {
            uid: currentUser.uid,
            username: currentUser.username,
          },
          likeCount: 0,
          likedBy: [],
          reportCount: 0,
          reportedBy: [],
        });
      }
      if (selectedGroups.length > 0 && currentUser?.uid) {
        addMarkerGroup(idMarker, selectedGroups, currentUser.uid);
      }
      setPointVisibility(null);
      setSelectedTag(null);
      setSelectedGroups([]);
      toast("Point ajouté avec succès");
    },

    [currentUser, selectedTag, pointVisibility, addMarker]
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
          <PlusIcon className="h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8 text-white" />
        </Link>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un point</DialogTitle>
          <DialogDescription>
            Ajouter un point pour indiquer un lieu sur la carte
          </DialogDescription>
        </DialogHeader>
        <Select onValueChange={handleVisibility}>
          <SelectTrigger>
            <SelectValue placeholder="Visibilité du point" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="friends">Amis</SelectItem>
            <SelectItem value="groups">Groupes</SelectItem>
          </SelectContent>
        </Select>
        <Label htmlFor="name">Nom du lieu</Label>
        <Input ref={pointNameRef} id="name" type="text" />
        <Label htmlFor="description">Description</Label>
        <Input ref={pointDescriptionRef} id="description" type="text" />
        <Select onValueChange={handleSelectTag}>
          <SelectTrigger>
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent>
            {mapTags.map((tag: string) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {pointVisibility == "groups" && (
          <>
            <span>Partager le point avec vos groupes</span>
            <div className="overflow-y-auto max-h-28">
              {groups.map((group) => (
                <GroupLine
                  key={group.id}
                  group={group}
                  groupUsers={[]}
                  selected={selectedGroups.includes(group)}
                  onSelect={() => toggleGroupSelection(group)}
                />
              ))}
            </div>
          </>
        )}

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
      <Toaster position="top-right" />
    </Dialog>
  );
};

export default ModalCreateMarker;

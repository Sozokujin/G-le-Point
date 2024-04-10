import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const ModalCreateMarker = () => {
  const [display, setDisplay] = useState<string>("");

  return (
    <Dialog>
      <DialogTrigger>
        <button className="absolute left-1/2 transform -translate-x-1/2 bottom-2 h-14 w-14 bg-blue-500 rounded-full flex items-center justify-center">
          <PlusIcon className="h-8 w-8 text-white" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un point</DialogTitle>
          <DialogDescription>
            Ajouter un point pour indiquer un lieu sur la carte
          </DialogDescription>
        </DialogHeader>
        <Label htmlFor="name">Nom du lieu</Label>
        <Input id="name" type="text" />
        <Label htmlFor="description">Description</Label>
        <Input id="description" type="text" />

        <div>
          <div className="w-full h-8 flex flex-row border mb-4 text-xs">
            <div
              className={`h-full w-full flex items-center justify-center cursor-pointer ${
                display == "address"
                  ? "outline outline-4 outline-offset-[-4px] outline-blue-500"
                  : ""
              }`}
              onClick={() => setDisplay("address")}
            >
              Adresse
            </div>
            <div
              className={`h-full w-full flex items-center justify-center cursor-pointer ${
                display == "gps"
                  ? "outline outline-4 outline-offset-[-4px] outline-blue-500"
                  : ""
              }`}
              onClick={() => setDisplay("gps")}
            >
              Point GPS
            </div>
            <div
              className={`h-full w-full flex items-center justify-center cursor-pointer ${
                display == "position"
                  ? "outline outline-4 outline-offset-[-4px] outline-blue-500"
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
              <Input id="address" type="text" />
              <DialogClose>
                <Button className="mt-4">Enregistrer le point</Button>
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
              />
              <DialogClose>
                <Button className="mt-4">Enregistrer le point</Button>
              </DialogClose>
            </>
          )}
          {display == "position" && (
            <DialogClose>
              <Button className="m-auto">
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

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import useMarkerStore from "@/stores/markerStore";

export const ModalListMarkers = () => {
  const markers = useMarkerStore((state) => state.markers);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="btn btn-primary absolute top-4 right-4 z-10">
          Vos points
        </Button>
      </DialogTrigger>
      <DialogContent>
        <h2 className="text-primary text-xl font-bold">Liste des marqueurs</h2>
        {markers.length > 0 ? (
          <ul>
            {markers.map((marker) => (
              <li key={marker.name}>
                <p>{marker.name}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun marqueur</p>
        )}
        <DialogClose asChild>
          <Button>Fermer</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

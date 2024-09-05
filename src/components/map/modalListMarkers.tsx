import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useMarkerStore from "@/stores/markerStore";

export const ModalListMarkers = () => {
  const UserMarkers = useMarkerStore((state) => state.userMarkers);

  const { addClickedMarker } = useMarkerStore();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="btn btn-primary absolute top-4 right-4 z-10">
          Vos points
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-primary text-xl font-bold">
          Liste des marqueurs
        </DialogTitle>
        {UserMarkers.length > 0 ? (
          <ul className="flex flex-col gap-4 max-h-96 overflow-y-auto">
            {UserMarkers.map((userMarker: any, i) => (
              <DialogClose asChild key={i}>
                <li
                  className="border p-4"
                  onClick={() => addClickedMarker(userMarker)}
                >
                  <p>{userMarker.name}</p>
                  <p>
                    {userMarker.latitude}
                    {userMarker.longitude}
                  </p>
                </li>
              </DialogClose>
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

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

  const { addClickedMarker, deleteMarker } = useMarkerStore();

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
              <li key={userMarker.id} className="border p-4">
                <p>{userMarker.name}</p>
                <p>
                  {userMarker.latitude}
                  {userMarker.longitude}
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant={"secondary"}>Supprimer</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle className="text-primary text-xl font-bold">
                      Êtes-vous sûr de vouloir supprimer ce marqueur ?
                    </DialogTitle>
                    <DialogClose asChild>
                      <Button
                        onClick={() => deleteMarker(userMarker.id)}
                        variant={"secondary"}
                      >
                        Oui
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button>Non</Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
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

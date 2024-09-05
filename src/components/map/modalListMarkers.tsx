import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import useMarkerStore from "@/stores/markerStore";

export const ModalListMarkers = () => {
  const UserMarkers = useMarkerStore((state) => state.userMarkers);

  const redirectToPoint = () => {
    console.log("Redirect to point");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="btn btn-primary absolute top-4 right-4 z-10">
          Vos points
        </Button>
      </DialogTrigger>
      <DialogContent>
        <h2 className="text-primary text-xl font-bold">Liste des marqueurs</h2>
        {UserMarkers.length > 0 ? (
          <ul>
            {UserMarkers.map((userMarker) => (
              <li onClick={() => redirectToPoint} key={userMarker.name}>
                <p>{userMarker.name}</p>
                <p>
                  {userMarker.latitude}
                  {userMarker.longitude}
                </p>
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

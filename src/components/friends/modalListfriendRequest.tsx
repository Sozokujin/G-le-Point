import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  acceptFriendRequest,
  declineFriendRequest,
} from "@/services/firebase/friends";
import { useFriendStore } from "@/stores/friendStore";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
export const ModalListFriendRequest = () => {
  const { friendRequests, getFriendRequests } = useFriendStore();

  useEffect(() => { //XXX: maybe fetch from store and refresh the page for new requests
    getFriendRequests();
  }, [getFriendRequests]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="relative w-fit">
          Demandes d&apos;amis
          {friendRequests.length > 0 && (
            <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2">
              {friendRequests.length}
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        {friendRequests.length !== 0 ? (
          <>
            <h2 className="text-primary text-xl font-bold">
              Vos demandes d&apos;amis
            </h2>
            <ul className="flex flex-col gap-3">
              {friendRequests.map((friendRequest, key) => (
                <FriendRequestLine key={key} friendRequest={friendRequest} />
              ))}
            </ul>
          </>
        ) : (
          <DialogHeader>
            <h2 className="text-primary text-xl font-bold">
              Vous n&apos;avez pas de demandes d&apos;amis
            </h2>
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  );
};

const FriendRequestLine = ({ friendRequest }: { friendRequest: any }) => {
  const { removeFriendRequest, getFriendRequests, addFriend } = useFriendStore();

  const handleAcceptFriendRequest = useCallback(async (uid: string) => {
    await acceptFriendRequest(uid);
    await getFriendRequests();
    removeFriendRequest(friendRequest.id);
    addFriend(friendRequest);
    toast("Demande d'ami acceptée");
  }, [friendRequest, getFriendRequests, removeFriendRequest, addFriend]);

  const handleDeclineFriendRequest = useCallback(async (uid: string) => {
    await declineFriendRequest(uid);
    await getFriendRequests();
    removeFriendRequest(friendRequest.id);
    toast("Demande d'ami refusée");
  }, [friendRequest, getFriendRequests, removeFriendRequest]);

  return (
    <li className="h-24 w-full border-primary border-y-2 p-2 rounded-sm">
      <div className="text-primary font-semibold">
        {friendRequest.displayName}
      </div>
      <div className="w-full">
        <Button
          onClick={() => handleAcceptFriendRequest(friendRequest.uid)}
          className="bg-glp-green text-white"
        >
          Accepter
        </Button>
        <Button
          onClick={() => handleDeclineFriendRequest(friendRequest.uid)}
          variant={"secondary"}
          className="bg-red-500 text-white"
        >
          Refuser
        </Button>
      </div>
    </li>
  );
};
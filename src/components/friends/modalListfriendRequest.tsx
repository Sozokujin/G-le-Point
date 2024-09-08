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
import { useFriendRequestStore } from "@/stores/friendStore";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Toaster } from "../ui/sonner";

export const ModalListFriendRequest = () => {
  const { friendRequests, getFriendRequests } = useFriendRequestStore();

  useEffect(() => {
    if (friendRequests.length === 0) {
      getFriendRequests();
    }
  }, [getFriendRequests]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      await getFriendRequests();
    };

    fetchFriendRequests();
  }, []);

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
        <ul className="flex gap-3"></ul>
        {friendRequests.length !== 0 ? (
          friendRequests.map((friendRequest, key) => {
            return (
              <>
                <h2 className="text-primary text-xl font-bold">
                  Vos demandes d&apos;amis
                </h2>
                <FriendRequestLine key={key} friendRequest={friendRequest} />
              </>
            );
          })
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
  const { removeFriendRequest, getFriendRequests } = useFriendRequestStore();

  const handleAcceptFriendRequest = async (uid: string) => {
    await acceptFriendRequest(uid);
    await getFriendRequests();
    removeFriendRequest(friendRequest);
    toast("Demande d'ami acceptée");
  };

  const handleDeclineFriendRequest = async (uid: string) => {
    await declineFriendRequest(uid);
    await getFriendRequests();
    removeFriendRequest(friendRequest);
    toast("Demande d'ami refusée");
  };

  return (
    <>
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
      <Toaster position="top-right" />
    </>
  );
};

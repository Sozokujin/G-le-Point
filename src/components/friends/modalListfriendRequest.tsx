import { Button } from "../ui/button";
import { acceptFriendRequest, declineFriendRequest } from "@/services/firebase/friends";
import { useEffect, useRef, useState } from "react";
import { useFriendRequestStore } from "@/stores/friendStore";
import  Popup  from "../popup";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export const ModalListFriendRequest = () => {

  const { friendRequests, getFriendRequests } = useFriendRequestStore();

  const [invitationCode, setInvitationCode] = useState<string | null>(null);
  const [showPopupCopy, setShowPopupCopy] = useState(false);
  const [showPopupSend, setShowPopupSend] = useState(false);

  const invitationCodeRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if(friendRequests.length === 0) {
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
          <Badge className="bg-glp-green text-white absolute right-8 top-4 cursor-pointer">Demandes d&apos;amis {friendRequests.length}</Badge>
        </DialogTrigger>
        <DialogContent>
        <ul className="flex gap-3"></ul>
          {friendRequests.length !== 0 ? (
            friendRequests.map((friendRequest, key) => {
              return (
                <>
                <h2 className="text-primary text-xl font-bold">Vos demandes d&apos;amis</h2>
                <FriendRequestLine key={key} friendRequest={friendRequest} />
                </>
              );
            })
          ) : (
            <DialogHeader>
              <h2 className="text-primary text-xl font-bold">Vous n&apos;avez pas de demandes d&apos;amis</h2>
            </DialogHeader>
          )}
            {showPopupCopy && <Popup message={"Code copié !"} duration={3000} />}
        </DialogContent>
      </Dialog>
    );
    }

const FriendRequestLine = ({ friendRequest }: { friendRequest: any }) => {

  const { removeFriendRequest, getFriendRequests } = useFriendRequestStore();

  const handleAcceptFriendRequest = async (uid: string) => {
    await acceptFriendRequest(uid);
    removeFriendRequest(friendRequest);
  }

  const handleDeclineFriendRequest = async (uid: string) => {
    await declineFriendRequest(uid);
    await getFriendRequests();
    removeFriendRequest(friendRequest);
  }

  return (
    <li className="h-24 w-full border-primary border-y-2 p-2 rounded-sm">
      <div className="text-primary font-semibold">{friendRequest.displayName}</div>
      <div className="w-full">
      <Button onClick={() => handleAcceptFriendRequest(friendRequest.uid)} className="bg-glp-green text-white">Accepter</Button>
      <Button onClick={() => handleDeclineFriendRequest(friendRequest.uid)} variant={"secondary"} className="bg-red-500 text-white">Refuser</Button>
      </div>
    </li>
  );
}
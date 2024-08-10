import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { sendFriendRequest, getInvitationCode, acceptFriendRequest } from "@/services/firebase/friends";
import { useEffect, useRef, useState } from "react";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { useFriendRequestStore } from "@/stores/friendStore";

export const FriendRequest = () => {

  const { friendRequests, getFriendRequests } = useFriendRequestStore();

  const [invitationCode, setInvitationCode] = useState<string | null>(null);

  const invitationCodeRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if(friendRequests.length === 0) {
        getFriendRequests();
    }
}, [getFriendRequests]);

  useEffect(() => {
    const fetchInvitationCode = async () => {
      const cachedCode = localStorage.getItem('invitationCode');
      
      if (cachedCode) {
        setInvitationCode(cachedCode);
      } else {
        const code = await getInvitationCode();
        setInvitationCode(code);
        localStorage.setItem('invitationCode', code);
      }
    };

    const fetchFriendRequests = async () => {
      const friendRequests = await getFriendRequests();
      console.log(friendRequests);
    };
    
    fetchFriendRequests();
    fetchInvitationCode();
  }, []);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(invitationCode || '');
  }

    return (
      <div>
        <Card className="p-4 flex flex-col gap-4">
        <Label htmlFor="invitationCode">Ajouter un ami</Label>
        <Input
          ref={invitationCodeRef}
          placeholder="Entrez le code d'invitation de votre ami"
          id="invitationCode"
          type="text"
        />
        <Button onClick={() => sendFriendRequest(invitationCodeRef.current?.value)}>Envoyer la demande</Button>

        <span>Mon code : <span className="text-glp-green font-bold">{invitationCode}</span><ClipboardDocumentIcon className="ml-2 inline-block h-4 text-glp-green" onClick={() => copyToClipboard()}/></span>
      </Card>
      <h2 className="text-primary text-xl font-bold px-2 py-4">Demandes d&apos;amis</h2>
      <ul className="flex gap-3"></ul>
        {friendRequests.length !== 0 ? (
          friendRequests.map((friendRequest, key) => {
            return (
              <FriendRequestLine key={key} friendRequest={friendRequest} />
            );
          })
        ) : (
          <div>
            <p>Vous n&apos;avez pas de demandes d&apos;amis</p>
          </div>
        )}
      </div>
    );
    }

const FriendRequestLine = ({ friendRequest }: { friendRequest: any }) => {
  return (
    <li className="h-24 w-full border-primary border-y-2 p-2 rounded-sm">
      <span className="text-primary font-semibold">{friendRequest.displayName}</span>
      <Button onClick={() => acceptFriendRequest(friendRequest.uid)} className="bg-glp-green text-white">Accepter</Button>
    </li>
  );
}
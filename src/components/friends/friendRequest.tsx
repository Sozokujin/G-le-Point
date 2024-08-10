import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { sendFriendRequest, getInvitationCode, getFriendRequests } from "@/services/firebase/friends";
import { useEffect, useRef, useState } from "react";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";

export const FriendRequest = () => {

  const [invitationCode, setInvitationCode] = useState<string | null>(null);

  const invitationCodeRef = useRef<HTMLInputElement>(null);


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
      </div>
    );
    }
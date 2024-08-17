import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { sendFriendRequest } from "@/services/firebase/friends";
import { useRef, useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";

export const ModalSendFriendRequest = () => {

  const [showPopupCopy, setShowPopupCopy] = useState(false);
  const [showPopupSend, setShowPopupSend] = useState(false);

  const invitationCodeRef = useRef<HTMLInputElement>(null);


  
  const handleSendFriendRequest = async (invitationCode: string | undefined) => {
    await sendFriendRequest(invitationCode);
    setShowPopupSend(true);
    setTimeout(() => {
      setShowPopupSend(false);
    }, 3000);
  }


    return (
      <Dialog>
        <DialogTrigger asChild>
            <Button className="btn btn-primary">Ajouter un ami</Button>
        </DialogTrigger>
        <DialogContent>
        <h2 className="text-primary text-xl font-bold">Ajouter un ami</h2>
        <Input
          ref={invitationCodeRef}
          placeholder="Entrez le code d'invitation de votre ami"
          id="invitationCode"
          type="text"
        />
        <DialogClose asChild>
        <Button onClick={() => handleSendFriendRequest(invitationCodeRef.current?.value)}>Envoyer la demande</Button>
        </DialogClose>
        </DialogContent>
      </Dialog>
      
    );
};

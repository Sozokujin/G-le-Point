import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { sendFriendRequest } from "@/services/firebase/friends";
import { useRef } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Toaster } from "../ui/sonner";

export const ModalSendFriendRequest = () => {
  const invitationCodeRef = useRef<HTMLInputElement>(null);

  const handleSendFriendRequest = async (
    invitationCode: string | undefined
  ) => {
    await sendFriendRequest(invitationCode);
    toast("Demande d'ami envoyée !");
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="px-0 w-10 h-10 rounded-full">
            <UserPlusIcon className="h-5 w-5" />
          </Button>
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
            <Button
              onClick={() =>
                handleSendFriendRequest(invitationCodeRef.current?.value)
              }
            >
              Envoyer la demande
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
      <Toaster position="top-right" />
    </>
  );
};

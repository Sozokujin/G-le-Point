import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import ConfirmationDialog from "../ui/confirmation-dialog";
import { useState } from "react";
import { unfriend } from "@/services/firebase/friends";
import { toast } from "sonner"

interface FriendProps {
  friendId: string;
  name: string | null | undefined;
  email?: string | null | undefined;
  photoUrl?: string | null | undefined;
  className?: string;
}

export default function FriendHeader({
  friendId,
  name = "No Name",
  email = "No Email",
  photoUrl,
  className,
}: FriendProps) {

  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = async () => {
    try {
      await unfriend(friendId);
      toast.success('Successfully unfriended!');
    } catch (error) {
      toast.error('Failed to unfriend.');
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 bg-background rounded-lg shadow min-h-24",
        className
      )}
    >
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={photoUrl ?? ""} alt={name ?? ""} />
          <AvatarFallback>{name?.slice(0, 1) ?? "?"}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">{name}</h2>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>
      <DropdownMenu  open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="default" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Signaler</DropdownMenuItem>
          <DropdownMenuSeparator />
          <ConfirmationDialog
            trigger={
              <DropdownMenuItem onSelect={(event) => event.preventDefault()}>Supprimer l&apos;amis</DropdownMenuItem>
            }
            title="Etes-vous sûr(e)?"
            description={`Voulez-vous vraiment supprimer ${name} de vos amis? Vous ne pourrez pas annuler cette action.`}
            destructive
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

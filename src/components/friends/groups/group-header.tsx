import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { FirebaseUser, Group } from "@/types";
import GroupAvatar, { AvatarUser } from "@/components/ui/group-avatar";
import { useEffect, useState } from "react";
import useUserStore from "@/stores/userStore";
import { Skeleton } from "@/components/ui/skeleton";
import { leaveGroup } from "@/services/firebase/groups";
import { toast } from "sonner";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";

interface GroupProps {
  group: Group;
  className?: string;
}

export default function GroupHeader({ group, className }: GroupProps) {
  const [groupUsers, setGroupUsers] = useState<AvatarUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { users } = useUserStore();

  const transformToAvatarUser = (user: FirebaseUser): AvatarUser => ({
    id: user.uid,
    name: user.displayName || user.email || "Unknown User",
    image: user.photoURL,
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = async () => {
    try {
      await leaveGroup(group.id);
      toast.success('Successfully unfriended!');
    } catch (error) {
      toast.error('Failed to unfriend.');
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    setIsLoading(true);
    const avatarUsers = group.members
      .map((memberId) => users.find((user) => user.uid === memberId))
      .filter((user): user is FirebaseUser => user !== undefined)
      .map(transformToAvatarUser);

    setGroupUsers(avatarUsers);
    setIsLoading(false);
  }, [group.members, users]);

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 bg-background rounded-lg shadow h-24",
        className
      )}
    >
      <div className="flex items-center space-x-4 min-h-24">
        {isLoading ? (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ) : (
          <>
            <GroupAvatar users={groupUsers} size="md" />
            <div>
              <p className="text-lg font-semibold">
                {group.name || "Groupe sans nom"}
              </p>
              <p className="text-sm text-muted-foreground">
                {group.members.length} Membres
              </p>
            </div>
          </>
        )}
      </div>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="default" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Voir les membres</DropdownMenuItem>
          <DropdownMenuSeparator />
          <ConfirmationDialog
            trigger={
              <DropdownMenuItem onSelect={(event) => event.preventDefault()}>Quitter</DropdownMenuItem>
            }
            title="Etes-vous sûr(e)?"
            description={`Voulez-vous vraiment quitter ${group.name}? Vous ne pourrez pas annuler cette action.`}
            destructive
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { FirebaseUser, Group } from "@/types"
import GroupAvatar, { AvatarUser } from "@/components/ui/group-avatar"
import { useEffect, useState } from "react"
import useUserStore from "@/stores/userStore"
import { Separator } from "@/components/ui/separator"

interface GroupProps {
  group: Group
  className?: string
}

export default function GroupHeader({ group, className }: GroupProps) {
  const [groupUsers, setGroupUsers] = useState<AvatarUser[]>([]);
  const { users } = useUserStore();
  const transformToAvatarUser = (user: FirebaseUser): AvatarUser => ({
    id: user.uid,
    name: user.displayName || user.email || "Unknown User",
    image: user.photoURL,
  });

  useEffect(() => {
    setGroupUsers(
      group.members
        .map((memberId) => users.find((user) => user.uid === memberId))
        .filter((user): user is FirebaseUser => user !== undefined)
        .map(transformToAvatarUser)
    )}, [group.members]);

  return (
    <div className={cn(
      "flex items-center justify-between p-4 bg-background rounded-lg shadow h-24",
      className
    )}>
      <div className="flex items-center space-x-4 min-h-24">
        {/* FIXME: avatar no load on first initialisation */}
      <GroupAvatar users={groupUsers} size="md" />
        <div>
          <h2 className="text-lg font-semibold">{group.name || "Groupe sans nom"}</h2>
          <p className="text-sm text-muted-foreground">{group.members.length} Membres</p>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Voir les membres</DropdownMenuItem>
          <Separator className="my-1" />
          <DropdownMenuItem>Quitter</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "../ui/separator"

interface FriendProps {
  name?: string | null | undefined
  email?: string | null | undefined
  photoUrl?: string | null | undefined
  className?: string
}

export default function FriendHeader({ name = 'No Name', email = 'No Email', photoUrl, className }: FriendProps) {
  return (
    <div className={cn(
      "flex items-center justify-between p-4 bg-background rounded-lg shadow min-h-24",
      className
    )}>
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={photoUrl?? ''} alt={name ?? ''} />
          <AvatarFallback>{name?.slice(0, 1) ?? '?'}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">{name}</h2>
          <p className="text-sm text-muted-foreground">{email}</p>
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
          <DropdownMenuItem>Signaler</DropdownMenuItem>
          <Separator className="my-1" />
          <DropdownMenuItem>Supprimer l&apos;aims</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
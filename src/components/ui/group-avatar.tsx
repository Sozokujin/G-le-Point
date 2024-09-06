import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface AvatarUser {
  id: string
  name: string
  image?: string
}

interface GroupAvatarProps {
  users: AvatarUser[]
  size?: 'sm' | 'md' | 'lg'
}

export default function GroupAvatar({ users, size = 'md' }: GroupAvatarProps) {
  const displayUsers = users.slice(0, 3)
  const remainingCount = Math.max(0, users.length - 2)

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  }

  const containerSizeClasses = {
    sm: 'min-h-12 min-w-12',
    md: 'min-h-18 min-w-18',
    lg: 'min-h-22 min-w-22'
  }

  const avatarSize = sizeClasses[size]
  const containerSize = containerSizeClasses[size]

  return (
<div className={`relative ${containerSize}`}>
      {displayUsers.map((user, index) => (
        <Avatar
          key={user.id}
          className={`${avatarSize} border-2 border-background absolute
            ${index === 0 ? 'left-0 top-0' : ''}
            ${index === 1 ? 'bottom-0 translate-x-[25%]' : ''}
            ${index === 2 ? 'right-0 top-0' : ''}

          `}
        >
          <AvatarImage src={user.image} alt={user.name} />
          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      ))}
      {remainingCount > 1 && (
        <Avatar className={`${avatarSize} absolute bottom-0 translate-x-[25%] border-2 border-background bg-muted`}>
          <AvatarFallback className="font-medium text-muted-foreground">
            +{remainingCount}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
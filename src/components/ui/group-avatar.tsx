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
  console.log("users:", users);
  const displayUsers = users.slice(0, 3)
  const remainingCount = Math.max(0, users.length - 3)

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  }

  const containerSizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-18 w-18',
    lg: 'h-22 w-22'
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
            ${index === 1 ? 'right-0 top-0' : ''}
            ${index === 2 ? 'bottom-0 right-0' : ''}
          `}
        >
          <AvatarImage src={user.image} alt={user.name} />
          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      ))}
      {remainingCount > 0 && (
        <div className={`${avatarSize} absolute bottom-0 left-0 flex items-center justify-center bg-muted rounded-full border-2 border-background`}>
          <span className="text-sm font-medium text-muted-foreground">+{remainingCount}</span>
        </div>
      )}
    </div>
  )
}
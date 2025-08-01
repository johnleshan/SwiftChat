import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user?: User;
  className?: string;
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Avatar className={cn("h-8 w-8", className)}>
      <AvatarImage src={user?.avatarUrl} alt={user?.name} data-ai-hint="person portrait" />
      <AvatarFallback>
        {user?.name ? getInitials(user.name) : "???"}
      </AvatarFallback>
    </Avatar>
  );
}

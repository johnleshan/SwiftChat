import Link from "next/link";
import { PlusCircle, Search, Settings, LogOut, MessageSquare, User as UserIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import type { Chat, User } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "./user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ChatSidebarProps {
  chats: Chat[];
  selectedChatId: string;
  onChatSelect: (chatId: string) => void;
  currentUser: User;
}

export function ChatSidebar({ chats, selectedChatId, onChatSelect, currentUser }: ChatSidebarProps) {
  const sortedChats = [...chats].sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
  
  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <MessageSquare className="text-primary h-6 w-6" />
          </Button>
          <h1 className="text-xl font-headline font-bold text-primary">SwiftChat</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search chats..." className="pl-8" />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-0">
        <ScrollArea className="h-full">
          <div className="p-2 space-y-1">
            {sortedChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg p-2 text-left transition-all",
                  selectedChatId === chat.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-accent/50"
                )}
              >
                <UserAvatar user={{ name: chat.name, avatarUrl: chat.avatarUrl }} className="h-10 w-10" />
                <div className="flex-1 truncate">
                  <div className="flex items-center justify-between">
                    <p className={cn("font-semibold", selectedChatId === chat.id ? "text-primary" : "text-foreground")}>
                      {chat.name}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(chat.lastMessageTimestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                    {chat.unreadCount && chat.unreadCount > 0 ? (
                       <Badge variant="default" className="bg-primary text-primary-foreground h-5 w-5 flex items-center justify-center p-0">{chat.unreadCount}</Badge>
                    ) : null}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between p-2 border-t">
          <UserAvatar user={currentUser} className="h-10 w-10"/>
          <span className="font-semibold text-foreground flex-1 ml-3 truncate">{currentUser.name}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </>
  );
}

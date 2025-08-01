export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  email?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface Chat {
  id:string;
  type: 'dm' | 'group';
  name: string;
  members: string[];
  lastMessage: string;
  lastMessageTimestamp: number;
  avatarUrl?: string;
  unreadCount?: number;
}

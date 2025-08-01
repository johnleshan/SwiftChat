
'use client';

import { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { chats as initialChats, messages as allMessages, users, type Chat as ChatType, type Message, type User } from '@/lib/data';
import { ChatSidebar } from './chat-sidebar';
import { ChatWindow } from './chat-window';

export function ChatLayout() {
  const [chats, setChats] = useState(initialChats);
  const [messages, setMessages] = useState(allMessages);
  const [selectedChatId, setSelectedChatId] = useState<string>(initialChats[0].id);

  // In a real app, this would come from an auth context
  const currentUser = users.find(u => u.id === 'user-1') as User;
  
  const selectedChat = chats.find((c) => c.id === selectedChatId) as ChatType;

  const handleSendMessage = (chatId: string, newMessage: Message) => {
    // Update messages for the specific chat
    setMessages(prevMessages => ({
      ...prevMessages,
      [chatId]: [...(prevMessages[chatId] || []), newMessage]
    }));

    // Update the chat list with the new last message
    setChats(prevChats => prevChats.map(chat => 
      chat.id === chatId 
        ? { ...chat, lastMessage: newMessage.text, lastMessageTimestamp: newMessage.timestamp, unreadCount: 0 } 
        : chat
    ));
  };
  
  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setChats(prevChats => prevChats.map(chat => 
      chat.id === chatId 
        ? { ...chat, unreadCount: 0 } 
        : chat
    ));
  };

  return (
    <SidebarProvider>
      <div className="h-screen w-full flex" data-theme="light">
        <Sidebar className="flex flex-col w-[--sidebar-width]">
          <ChatSidebar
            chats={chats}
            selectedChatId={selectedChat.id}
            onChatSelect={handleSelectChat}
            currentUser={currentUser}
          />
        </Sidebar>
        <SidebarInset className="flex-1">
          <ChatWindow
            key={selectedChat.id}
            chat={selectedChat}
            messages={messages[selectedChat.id] || []}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

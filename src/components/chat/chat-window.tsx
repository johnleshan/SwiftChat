
'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, Phone, Video } from 'lucide-react';
import { format } from 'date-fns';
import { suggestFocusMode, type SuggestFocusModeOutput } from '@/ai/flows/suggest-focus-mode';

import type { Chat, Message, User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { users } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserAvatar } from './user-avatar';
import { FocusModeDialog } from './focus-mode-dialog';

interface ChatWindowProps {
  chat: Chat;
  messages: Message[];
  currentUser: User;
  onSendMessage: (chatId: string, message: Message) => void;
}

export function ChatWindow({ chat, messages: initialMessages, currentUser, onSendMessage }: ChatWindowProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFocusDialog, setShowFocusDialog] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestFocusModeOutput | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text: newMessage,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, message]);
    onSendMessage(chat.id, message);
    setNewMessage('');

    if (chat.type === 'group') {
      const updatedMessages = [...messages, message];
      const aiInput = {
        messages: updatedMessages.slice(-10).map(m => ({
          sender: users.find(u => u.id === m.senderId)?.name || 'Unknown',
          content: m.text,
        })),
      };

      try {
        const result = await suggestFocusMode(aiInput);
        if (result.shouldSuggestFocusMode) {
          setSuggestion(result);
          setShowFocusDialog(true);
        }
      } catch (error) {
        console.error("AI suggestion failed:", error);
      }
    }
  };
  
  const getSender = (senderId: string) => users.find(u => u.id === senderId);

  return (
    <div className="flex flex-col h-screen bg-card">
      <header className="flex items-center gap-4 border-b bg-background p-3">
        <UserAvatar user={{ name: chat.name, avatarUrl: chat.avatarUrl }} className="h-10 w-10" />
        <div className="flex-1">
          <h2 className="font-bold text-lg font-headline">{chat.name}</h2>
          <p className="text-sm text-muted-foreground">
            {chat.type === 'group' ? `${chat.members.length} members` : 'Online'}
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><Phone /></Button>
            <Button variant="ghost" size="icon"><Video /></Button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-4 space-y-6">
            {messages.map((message, index) => {
              const sender = getSender(message.senderId);
              const isCurrentUser = message.senderId === currentUser.id;
              const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
              
              return (
                <div key={message.id} className={cn("flex items-end gap-3", isCurrentUser && "justify-end")}>
                  {!isCurrentUser && (
                    <div className="w-8 shrink-0">
                      {showAvatar && sender && <UserAvatar user={sender} className="h-8 w-8" />}
                    </div>
                  )}
                  <div className={cn(
                      "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl",
                      isCurrentUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
                    )}>
                    {!isCurrentUser && showAvatar && (
                      <p className="font-semibold text-sm mb-1 text-primary">{sender?.name}</p>
                    )}
                    <p className="text-base">{message.text}</p>
                    {isMounted && (
                      <p className={cn("text-xs mt-1", isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
                        {format(new Date(message.timestamp), 'p')}
                      </p>
                    )}
                  </div>
                  {isCurrentUser && (
                    <div className="w-8 shrink-0">
                      {showAvatar && <UserAvatar user={currentUser} className="h-8 w-8" />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </main>

      <footer className="border-t bg-background p-3">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <Button variant="ghost" size="icon"><Smile /></Button>
          <Button variant="ghost" size="icon"><Paperclip /></Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim() || isLoading}>
            <Send />
          </Button>
        </form>
      </footer>
      {suggestion && (
        <FocusModeDialog
          open={showFocusDialog}
          onOpenChange={setShowFocusDialog}
          suggestion={suggestion}
        />
      )}
    </div>
  );
}

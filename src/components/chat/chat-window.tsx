
'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, Phone, Video, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { suggestFocusMode, type SuggestFocusModeOutput } from '@/ai/flows/suggest-focus-mode';
import { generateReply } from '@/ai/flows/generate-reply';
import type { GenerateReplyInput } from '@/ai/types/generate-reply-types';

import type { Chat, Message, User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { users } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserAvatar } from './user-avatar';
import { FocusModeDialog } from './focus-mode-dialog';
import { VideoCallDialog } from './video-call-dialog';
import { useToast } from '@/hooks/use-toast';

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
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestFocusModeOutput | null>(null);
  const [lastSuggestedTopic, setLastSuggestedTopic] = useState<string | null>(null);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [focusedTopic, setFocusedTopic] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  }, [messages, isFocusMode]);

    // Reset focus mode when chat changes
  useEffect(() => {
    setIsFocusMode(false);
    setFocusedTopic(null);
    setLastSuggestedTopic(null);
  }, [chat.id]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setIsLoading(true);

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text: newMessage,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    onSendMessage(chat.id, message);
    setNewMessage('');
    
    try {
        const chatMembers = users.filter(u => chat.members.includes(u.id));
        const otherChatMembers = chatMembers.filter(u => u.id !== currentUser.id);

        if(otherChatMembers.length > 0) {
            const aiReply = await generateReply({
                messages: updatedMessages.slice(-10).map(m => ({
                    sender: users.find(u => u.id === m.senderId)?.name || 'Unknown',
                    content: m.text,
                })),
                chatMembers,
                currentUser,
            });

            if (aiReply.replyText && aiReply.replySenderId) {
                const replyMessage: Message = {
                    id: `msg-${Date.now() + 1}`,
                    senderId: aiReply.replySenderId,
                    text: aiReply.replyText,
                    timestamp: Date.now() + 1,
                };

                setTimeout(() => {
                  setMessages(prev => [...prev, replyMessage]);
                  onSendMessage(chat.id, replyMessage);
                }, 1000 + Math.random() * 1000);
            }
        }

        if (chat.type === 'group' && !isFocusMode) {
            const aiInput = {
                messages: updatedMessages.slice(-10).map(m => ({
                    sender: users.find(u => u.id === m.senderId)?.name || 'Unknown',
                    content: m.text,
                })),
            };

            const result = await suggestFocusMode(aiInput);
            if (result.shouldSuggestFocusMode && result.suggestedTopic !== lastSuggestedTopic) {
                setSuggestion(result);
                setShowFocusDialog(true);
                setLastSuggestedTopic(result.suggestedTopic);
            }
        }
    } catch (error) {
        console.error("AI processing failed:", error);
    } finally {
        setIsLoading(false);
    }
  };
  
  const getSender = (senderId: string) => users.find(u => u.id === senderId);

  const handleStartCall = () => {
    toast({
      title: 'Starting Call',
      description: `Calling ${chat.name}...`,
    });
  };

  const handleStartVideoCall = () => {
    setShowVideoCall(true);
  };

  const handleEnterFocusMode = () => {
    if (suggestion) {
      setIsFocusMode(true);
      setFocusedTopic(suggestion.suggestedTopic);
      setShowFocusDialog(false);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server and then
      // send a message with the file URL.
      const message: Message = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        text: `Attached file: ${file.name}`,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, message]);
      onSendMessage(chat.id, message);
      toast({
        title: 'File Attached',
        description: `${file.name} has been sent.`,
      });
    }
  };
  
  const filteredMessages = isFocusMode && focusedTopic
    ? messages.filter(message => message.text.toLowerCase().includes(focusedTopic.toLowerCase()))
    : messages;


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
            <Button variant="ghost" size="icon" onClick={handleStartCall}><Phone /></Button>
            <Button variant="ghost" size="icon" onClick={handleStartVideoCall}><Video /></Button>
        </div>
      </header>

      {isFocusMode && (
        <div className="bg-accent text-accent-foreground p-2 flex items-center justify-center text-sm">
          <span>Focusing on: <strong className="font-bold">{focusedTopic}</strong></span>
          <Button variant="ghost" size="icon" className="h-6 w-6 ml-2" onClick={() => setIsFocusMode(false)}>
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      )}

      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-4 space-y-6">
            {filteredMessages.map((message, index) => {
              const sender = getSender(message.senderId);
              const isCurrentUser = message.senderId === currentUser.id;
              const showAvatar = index === 0 || filteredMessages[index - 1].senderId !== message.senderId;
              
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
             {isFocusMode && filteredMessages.length === 0 && (
              <div className="text-center text-muted-foreground mt-8">
                No messages found for the topic "{focusedTopic}".
              </div>
            )}
          </div>
        </ScrollArea>
      </main>

      <footer className="border-t bg-background p-3">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <Button variant="ghost" size="icon"><Smile /></Button>
          <Button variant="ghost" size="icon" type="button" onClick={handleAttachmentClick}><Paperclip /></Button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
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
          onConfirm={handleEnterFocusMode}
        />
      )}
      <VideoCallDialog
        open={showVideoCall}
        onOpenChange={setShowVideoCall}
        chat={chat}
      />
    </div>
  );
}

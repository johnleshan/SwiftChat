import type { User, Chat, Message } from '@/lib/types';

export const users: User[] = [
  { id: 'user-1', name: 'You', email: 'you@example.com', avatarUrl: 'https://placehold.co/40x40/FFD700/000000.png?text=You' },
  { id: 'user-2', name: 'Alice', email: 'alice@example.com', avatarUrl: 'https://placehold.co/40x40.png' , 'data-ai-hint': 'woman portrait' },
  { id: 'user-3', name: 'Bob', email: 'bob@example.com', avatarUrl: 'https://placehold.co/40x40.png', 'data-ai-hint': 'man portrait'  },
  { id: 'user-4', name: 'Charlie', email: 'charlie@example.com', avatarUrl: 'https://placehold.co/40x40.png', 'data-ai-hint': 'person smiling'  },
  { id: 'user-5', name: 'Diana', email: 'diana@example.com', avatarUrl: 'https://placehold.co/40x40.png', 'data-ai-hint': 'woman profile'  },
];

export const chats: Chat[] = [
  {
    id: 'chat-1',
    type: 'dm',
    name: 'Alice',
    members: ['user-1', 'user-2'],
    lastMessage: 'Sounds good!',
    lastMessageTimestamp: Date.now() - 1000 * 60 * 2,
    avatarUrl: users.find(u => u.id === 'user-2')?.avatarUrl,
    unreadCount: 2,
  },
  {
    id: 'chat-2',
    type: 'dm',
    name: 'Bob',
    members: ['user-1', 'user-3'],
    lastMessage: 'See you then.',
    lastMessageTimestamp: Date.now() - 1000 * 60 * 60 * 2,
    avatarUrl: users.find(u => u.id === 'user-3')?.avatarUrl,
  },
  {
    id: 'chat-3',
    type: 'group',
    name: 'Project Team',
    members: ['user-1', 'user-2', 'user-4', 'user-5'],
    lastMessage: 'Let\'s sync up tomorrow morning about the Q3 report.',
    lastMessageTimestamp: Date.now() - 1000 * 60 * 5,
    avatarUrl: 'https://placehold.co/40x40/008080/FFFFFF.png?text=PT',
    unreadCount: 5,
  },
  {
    id: 'chat-4',
    type: 'group',
    name: 'Weekend Plans',
    members: ['user-1', 'user-3', 'user-5'],
    lastMessage: 'Anyone up for hiking?',
    lastMessageTimestamp: Date.now() - 1000 * 60 * 60 * 24,
    avatarUrl: 'https://placehold.co/40x40/FFD700/000000.png?text=WP',
  },
];

export const messages: Record<string, Message[]> = {
  'chat-1': [
    { id: 'msg-1-1', senderId: 'user-2', text: 'Hey, are we still on for lunch tomorrow?', timestamp: Date.now() - 1000 * 60 * 5 },
    { id: 'msg-1-2', senderId: 'user-1', text: 'Yes, absolutely! 12:30 PM at The Daily Grind?', timestamp: Date.now() - 1000 * 60 * 4 },
    { id: 'msg-1-3', senderId: 'user-2', text: 'Perfect. I have a meeting at 2, so that works well.', timestamp: Date.now() - 1000 * 60 * 3 },
    { id: 'msg-1-4', senderId: 'user-2', text: 'Sounds good!', timestamp: Date.now() - 1000 * 60 * 2 },
  ],
  'chat-2': [
    { id: 'msg-2-1', senderId: 'user-3', text: 'Can you send over the latest designs?', timestamp: Date.now() - 1000 * 60 * 60 * 3 },
    { id: 'msg-2-2', senderId: 'user-1', text: 'Just sent them to your email.', timestamp: Date.now() - 1000 * 60 * 60 * 2.5 },
    { id: 'msg-2-3', senderId: 'user-3', text: 'Got it, thanks!', timestamp: Date.now() - 1000 * 60 * 60 * 2.1 },
    { id: 'msg-2-4', senderId: 'user-1', text: 'See you then.', timestamp: Date.now() - 1000 * 60 * 60 * 2 },
  ],
  'chat-3': [
    { id: 'msg-3-1', senderId: 'user-4', text: 'Team, quick update on the project. We are on track for the deadline.', timestamp: Date.now() - 1000 * 60 * 15 },
    { id: 'msg-3-2', senderId: 'user-2', text: 'Great news! Has the client given feedback on the latest mockups?', timestamp: Date.now() - 1000 * 60 * 12 },
    { id: 'msg-3-3', senderId: 'user-5', text: 'Yes, they loved them. Only minor changes requested. It is mostly related to the Q3 report.', timestamp: Date.now() - 1000 * 60 * 10 },
    { id: 'msg-3-4', senderId: 'user-1', text: 'Excellent. I\'ll incorporate the feedback today.', timestamp: Date.now() - 1000 * 60 * 8 },
    { id: 'msg-3-5', senderId: 'user-4', text: 'Let\'s sync up tomorrow morning about the Q3 report.', timestamp: Date.now() - 1000 * 60 * 5 },
  ],
  'chat-4': [
    { id: 'msg-4-1', senderId: 'user-5', text: 'Long week! Any fun plans for the weekend?', timestamp: Date.now() - 1000 * 60 * 60 * 25 },
    { id: 'msg-4-2', senderId: 'user-3', text: 'I was thinking of going to the beach if the weather holds up.', timestamp: Date.now() - 1000 * 60 * 60 * 24.5 },
    { id: 'msg-4-3', senderId: 'user-1', text: 'Anyone up for hiking?', timestamp: Date.now() - 1000 * 60 * 60 * 24 },
  ]
};

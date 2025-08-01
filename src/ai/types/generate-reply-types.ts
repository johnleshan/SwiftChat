import { z } from 'genkit';

const MessageSchema = z.object({
    sender: z.string().describe('The sender of the message.'),
    content: z.string().describe('The content of the message.'),
});

const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
});

export const GenerateReplyInputSchema = z.object({
    messages: z.array(MessageSchema).describe('The list of messages in the group chat.'),
    chatMembers: z.array(UserSchema).describe('The list of users in the chat.'),
    currentUser: UserSchema.describe('The user who is waiting for a reply.'),
});
export type GenerateReplyInput = z.infer<typeof GenerateReplyInputSchema>;

export const GenerateReplyOutputSchema = z.object({
    replyText: z.string().describe('The generated reply message.'),
    replySenderId: z.string().describe('The ID of the user who is sending the reply.'),
});
export type GenerateReplyOutput = z.infer<typeof GenerateReplyOutputSchema>;

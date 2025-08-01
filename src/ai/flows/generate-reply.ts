'use server';

/**
 * @fileOverview An AI agent that generates replies in a group chat.
 *
 * - generateReply - A function that generates a reply from one of the other chat participants.
 */

import { ai } from '@/ai/genkit';
import { GenerateReplyInputSchema, GenerateReplyOutputSchema, type GenerateReplyInput, type GenerateReplyOutput } from '@/ai/types/generate-reply-types';

export async function generateReply(input: GenerateReplyInput): Promise<GenerateReplyOutput> {
  return generateReplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReplyPrompt',
  input: { schema: GenerateReplyInputSchema },
  output: { schema: GenerateReplyOutputSchema },
  prompt: `You are an AI assistant that generates a reply from one of the other users in a chat.

  Here is the context for your response:
  - The user who is expecting a reply is: {{{currentUser.name}}}
  - The other users in the chat are: {{#each chatMembers}}{{#unless (eq this.id currentUser.id)}}{{this.name}} (id: {{this.id}}), {{/unless}}{{/each}}.
  - The recent chat history is:
  {{#each messages}}
  {{this.sender}}: {{this.content}}
  {{/each}}

  Your task is to:
  1.  Analyze the recent messages to understand the conversation's context.
  2.  Choose one of the *other* users (not {{{currentUser.name}}}) to send the next reply.
  3.  Generate a short, realistic, and relevant reply from the perspective of the chosen user. The reply should be in a conversational style.
  4.  Set the 'replySenderId' to the ID of the user you chose to reply as.
  5.  Set the 'replyText' to the message content.

  Generate a reply now.
  `,
});

const generateReplyFlow = ai.defineFlow(
  {
    name: 'generateReplyFlow',
    inputSchema: GenerateReplyInputSchema,
    outputSchema: GenerateReplyOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

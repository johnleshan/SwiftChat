'use server';

/**
 * @fileOverview A focus mode suggestion AI agent for group chats.
 *
 * - suggestFocusMode - A function that analyzes group chat messages and suggests a focus mode based on commonly discussed topics.
 * - SuggestFocusModeInput - The input type for the suggestFocusMode function.
 * - SuggestFocusModeOutput - The return type for the suggestFocusMode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFocusModeInputSchema = z.object({
  messages: z.array(
    z.object({
      sender: z.string().describe('The sender of the message.'),
      content: z.string().describe('The content of the message.'),
    })
  ).describe('The list of messages in the group chat.'),
});
export type SuggestFocusModeInput = z.infer<typeof SuggestFocusModeInputSchema>;

const SuggestFocusModeOutputSchema = z.object({
  shouldSuggestFocusMode: z.boolean().describe('Whether or not a focus mode should be suggested.'),
  suggestedTopic: z.string().describe('The suggested topic for the focus mode.'),
});
export type SuggestFocusModeOutput = z.infer<typeof SuggestFocusModeOutputSchema>;

export async function suggestFocusMode(input: SuggestFocusModeInput): Promise<SuggestFocusModeOutput> {
  return suggestFocusModeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFocusModePrompt',
  input: {schema: SuggestFocusModeInputSchema},
  output: {schema: SuggestFocusModeOutputSchema},
  prompt: `You are an AI assistant that analyzes group chat messages to suggest a focus mode based on commonly discussed topics.

  You will determine if a focus mode should be suggested based on the content of the messages. If there is a clear, dominant topic emerging from the conversation, you should suggest a focus mode. If the conversation is varied and covers multiple topics, you should not suggest a focus mode.

  If you determine that a focus mode should be suggested, you will also identify the suggested topic for the focus mode.

  Here are the messages from the group chat:
  {{#each messages}}
  Sender: {{{sender}}}
  Content: {{{content}}}
  {{/each}}

  Based on the messages above, determine whether a focus mode should be suggested and, if so, what the suggested topic should be.
  Ensure that shouldSuggestFocusMode is true if you are suggesting a topic, and false if not.
  `,
});

const suggestFocusModeFlow = ai.defineFlow(
  {
    name: 'suggestFocusModeFlow',
    inputSchema: SuggestFocusModeInputSchema,
    outputSchema: SuggestFocusModeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

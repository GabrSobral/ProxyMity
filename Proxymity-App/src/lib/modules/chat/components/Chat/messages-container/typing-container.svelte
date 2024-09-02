<script lang="ts">
   import { fly } from 'svelte/transition';

   import colors from 'tailwindcss/colors';

   import * as Avatar from '$lib/design-system/avatar';
   import LoadingDots from '$lib/design-system/loading-dots.svelte';
   import type { ConversationState } from '$lib/modules/chat/contexts/chat-context/stores/chat-store-types';
   import { cn } from '$lib/utils';
   import { chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';

   interface Props {
      participantsTyping: {
         isTyping: boolean;
         author: ConversationState['participants'][0] | null;
      }[];
   }

   type $$Props = Props;

   let { participantsTyping } = $props() as Props;
</script>

{#if participantsTyping.length}
   <div
      class={cn('absolute z-[20] bottom-[3.5rem] py-1 mx-1 mb-1 px-4 items-center flex gap-2 bg-gray-900 rounded-lg w-fit', {
         'bottom-[8.5rem]': $chatState.selectedConversation?.replyMessage,
      })}
      transition:fly={{ y: 40, opacity: 0 }}
   >
      <div class="flex">
         {#each participantsTyping as participantTyping (participantTyping.author?.id)}
            <div class="-ml-2 shadow-lg rounded-full" title={participantTyping.author?.firstName}>
               <Avatar.Image src="https://github.com/shadcn.png" username={'conversationName'} size={24} />
               <span class="sr-only">{participantTyping.author?.firstName} is typing...</span>
            </div>
         {/each}
      </div>

      <span class="flex items-end gap-0 text-white text-xs">
         {#if participantsTyping.length > 1}
            are typing
         {:else}
            is typing
         {/if}
         <span class="mt-[8px]">
            <LoadingDots size={6} color={colors.purple[500]} />
         </span>
      </span>
   </div>
{/if}

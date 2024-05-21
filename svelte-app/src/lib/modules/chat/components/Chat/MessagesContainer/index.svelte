<script lang="ts">
   import { page } from '$app/stores';

   import Text from '$lib/design-system/Text.svelte';
   import Heading from '$lib/design-system/Heading.svelte';

   import Message from './Message.svelte';
   import Typebar from './Typebar.svelte';
   import ScrollToBottomButton from './ScrollToBottomButton.svelte';

   import { chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';

   import type { ILocalMessage } from '../../../../../../types/message';

   let messagesContainer: HTMLUListElement | null = $state(null);
   let firstUnreadMessage: ILocalMessage | null = $state(null);

   let userId = $derived($page.data.session?.user.id);
   let isFirstAccess = $state(true);
   let conversationMessages = $derived($chatState.selectedConversation?.messages || []);

   $effect(() => {
      if (!firstUnreadMessage) {
         firstUnreadMessage =
            $chatState.selectedConversation?.messages.find(message => message.read.users.some(user => !user.at)) || null;
      }
   });

   $effect(() => {
      $chatState.selectedConversation?.id;
      // The code above is only to track the selected conversation to the $effect, to
      // run this function when the user change the selected chat

      messagesContainer?.scroll({
         top: messagesContainer.scrollHeight,
         behavior: isFirstAccess ? 'auto' : 'smooth',
      });
   });

   $effect(() => {
      isFirstAccess = true;

      return () => {
         isFirstAccess = false;
      };
   });
</script>

<!-- svelte-ignore non_reactive_update -->
<!-- svelte-ignore non_reactive_update -->
<div class="overflow-hidden w-full flex-1 h-full flex flex-col p-1 relative max-w-5xl mx-auto">
   <ul class="flex flex-col gap-2 overflow-auto p-4" bind:this={messagesContainer}>
      {#if !$chatState.selectedConversation?.hasMessagesFetched}
         <Text size="md">Loading messages...</Text>
      {/if}

      {#if $chatState.selectedConversation?.messages.length === 0}
         <div class="flex-1 flex items-center justify-center flex-col gap-3 pointer-events-none">
            <img src="/no-messages.svg" alt="No message" class="w-[15rem]" />
            <Heading size="md" class="opacity-80">No messages have been sent yet...</Heading>
         </div>
      {:else if $chatState.selectedConversation?.messages}
         {#each $chatState.selectedConversation?.messages as message, i (message.id)}
            {#if firstUnreadMessage?.id === message.id}
               <div class="w-full h-[1px] bg-red-500 flex justify-center text-white">Unread messages</div>
            {/if}

            <Message {message} previousMessage={$chatState.selectedConversation?.messages?.[i - 1]} messageIndex={i} />
         {/each}
      {/if}
   </ul>

   <Typebar />
</div>

<ScrollToBottomButton container={messagesContainer} />

<script lang="ts">
   import { page } from '$app/stores';

   import Text from '$lib/design-system/Text.svelte';
   import Heading from '$lib/design-system/Heading.svelte';

   import Message from './Message.svelte';
   import Typebar from './Typebar.svelte';
   import ScrollToBottomButton from './ScrollToBottomButton.svelte';

   import { chatState, messagesContainer } from '$lib/modules/chat/contexts/chat-context/stores/chat';
   import { notificationsState } from '$lib/modules/chat/contexts/chat-context/stores/notification';

   let userId = $derived($page.data.session?.user.id);

   let firstUnreadMessageId = $derived(
      $notificationsState.lastMessagesHistory.find(
         item => item.conversationId === $chatState.selectedConversation?.id && item.authorId !== userId
      )?.messageId || null
   );

   $effect(() => {
      $chatState.selectedConversation?.messages;

      // Scroll the messages container to bottom using the "auto" behavior
      $messagesContainer?.scroll({ top: $messagesContainer.scrollHeight, behavior: 'auto' });
   });
</script>

<div class="overflow-hidden w-full flex-1 h-full flex flex-col p-1 relative max-w-5xl mx-auto">
   <ul class="flex flex-col gap-2 overflow-auto p-4" bind:this={$messagesContainer}>
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
            {#if firstUnreadMessageId === message.id}
               <div class="flex items-center gap-4 w-full">
                  <div class="w-full h-[2px] rounded-sm bg-purple-300"></div>
                  <span class="text-purple-300 whitespace-nowrap">Unread messages</span>
                  <div class="w-full h-[2px] rounded-sm bg-purple-300"></div>
               </div>
            {/if}

            <Message {message} previousMessage={$chatState.selectedConversation?.messages?.[i - 1]} messageIndex={i} />
         {/each}
      {/if}
   </ul>

   <Typebar />
</div>

<ScrollToBottomButton />

<script lang="ts">
   import clsx from 'clsx';
   import { page } from '$app/stores';
   import { Pin, User, X } from 'lucide-svelte';

   import { chatDispatch, chatState } from '../../contexts/chat-context/stores/chat';
   import * as Avatar from '$lib/components/ui/avatar';
   import { twMerge } from 'tailwind-merge';
   import { pinConversationAsync } from '../../services/pinConversationAsync';
   import { unpinConversationAsync } from '../../services/unpinConversationAsync';

   $: userId = $page.data.session?.user?.id || '';
   $: accessToken = $page.data.session?.accessToken;

   $: conversationName =
      $chatState.selectedConversation?.groupName ||
      $chatState.selectedConversation?.participants.find(item => item.id !== userId)?.name ||
      '';

   $: showConversationDetail = $chatState.showConversationDetail;

   $: isChatPinned = !!$chatState.selectedConversation?.conversationPinnedAt;

   async function handlePin() {
      if (!$chatState.selectedConversation) {
         console.warn('No conversation was selected.');
         return;
      }

      if (!accessToken) {
         console.warn('No access token was detected.');
         return;
      }

      chatDispatch.handleConversationPin({ conversationId: $chatState.selectedConversation?.id });

      const conversationId = $chatState.selectedConversation.id;

      try {
         if (isChatPinned) {
            unpinConversationAsync({ conversationId }, { accessToken });
         } else {
            pinConversationAsync({ conversationId }, { accessToken });
         }
      } catch (error: any) {
         console.error('Error on trying to handle with pin and unpin chat.', error);
      }
   }
</script>

<header class="px-3 py-2 dark:bg-black bg-white flex items-center gap-4 transition-all overflow-hidden">
   <Avatar.Root>
      <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
      <Avatar.Fallback>CN</Avatar.Fallback>
   </Avatar.Root>

   <h2 class="dark:text-gray-300 text-gray-500 font-light tracking-wide transition-all overflow-ellipsis">
      Conversation with <strong class="dark:text-white text-gray-700">{conversationName}</strong>
   </h2>

   <div class="flex gap-1 ml-auto">
      <button
         title="Pin chat"
         class={twMerge(
            clsx(
               'rounded-full p-2 dark:bg-black bg-white hover:bg-purple-500 dark:hover:bg-purple-500 transition-all group hover:text-white dark:dark:text-whit text-gray-700',
               {
                  'bg-purple-500 dark:bg-purple-500': isChatPinned,
               }
            )
         )}
         type="button"
         on:click={handlePin}
      >
         <Pin size={24} class="dark:text-white text-gray-700 group-hover:text-white" />
      </button>

      <button
         title="Conversation info"
         class={clsx('rounded-full p-2 hover:bg-purple-500 transition-all hover:text-white group ', {
            'bg-purple-500': showConversationDetail,
            'dark:bg-black bg-white': !showConversationDetail,
         })}
         type="button"
         on:click={chatDispatch.handleShowConversationDetail}
      >
         <User
            size={24}
            class={clsx(' group-hover:text-white', {
               'text-white': showConversationDetail,
               'dark:text-white text-gray-700': !showConversationDetail,
            })}
         />
      </button>

      {#if userId}
         <button
            type="button"
            on:click={() => chatDispatch.selectConversation({ conversation: null, typeMessage: '', currentUserId: userId })}
            title="Close chat"
            class="rounded-full p-2 dark:bg-black bg-white hover:bg-purple-500 hover:text-white group transition-all dark:text-white text-gray-700"
         >
            <X size={24} class="dark:text-white text-gray-700 group-hover:text-white" />
         </button>
      {/if}
   </div>
</header>

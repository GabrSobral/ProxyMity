<script lang="ts">
   import clsx from 'clsx';
   import { page } from '$app/stores';
   import { Pin, User, X } from 'lucide-svelte';

   import { chatDispatch, chatState } from '../../contexts/chat-context/stores/chat';
   import * as Avatar from '$lib/components/ui/avatar';

   $: user = $page.data.session?.user;

   $: conversationName =
      $chatState.selectedConversation?.groupName ||
      $chatState.selectedConversation?.participants.find(item => item.id !== user?.id)?.name ||
      '';

   $: showConversationDetail = $chatState.showConversationDetail;
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
         class="rounded-full p-2 dark:bg-black bg-white hover:bg-purple-500 transition-all group hover:text-white dark:dark:text-whit text-gray-700"
         type="button"
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

      <button
         type="button"
         on:click={() => chatDispatch.selectConversation({ conversation: null, typeMessage: '', currentUserId: user.id })}
         title="Close chat"
         class="rounded-full p-2 dark:bg-black bg-white hover:bg-purple-500 hover:text-white group transition-all dark:text-white text-gray-700"
      >
         <X size={24} class="dark:text-white text-gray-700 group-hover:text-white" />
      </button>
   </div>
</header>

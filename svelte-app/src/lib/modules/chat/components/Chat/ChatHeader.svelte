<script lang="ts">
   import clsx from 'clsx';
   import { page } from '$app/stores';
   import { User, X } from 'lucide-svelte';

   import * as Avatar from '$lib/design-system/avatar';

   import { chatDispatch, chatState } from '../../contexts/chat-context/stores/chat';

   $: userId = $page.data.session?.user?.id || '';

   $: conversationName =
      $chatState.selectedConversation?.groupName ||
      $chatState.selectedConversation?.participants.find(item => item.id !== userId)?.name ||
      '';

   $: showConversationDetail = $chatState.showConversationDetail;
</script>

<header class="px-3 py-2 bg-black flex items-center gap-4 transition-all overflow-hidden">
   <Avatar.Image src="https://github.com/shadcn.png" username={conversationName} />

   <h2 class="text-gray-300 font-dark tracking-wide transition-all overflow-ellipsis">
      Conversation with <strong class="text-white">{conversationName}</strong>
   </h2>

   <div class="flex gap-1 ml-auto">
      <button
         title="Conversation info"
         class={clsx('rounded-full p-2 hover:bg-purple-500 transition-all hover:text-white group ', {
            'bg-purple-500': showConversationDetail,
            'bg-black': !showConversationDetail,
         })}
         type="button"
         on:click={chatDispatch.handleShowConversationDetail}
      >
         <User size={24} class="text-white group-hover:text-white" />
      </button>

      {#if userId}
         <button
            type="button"
            on:click={() => chatDispatch.selectConversation({ conversation: null, typeMessage: '', currentUserId: userId })}
            title="Close chat"
            class="rounded-full p-2 bg-black hover:bg-purple-500 hover:text-white group transition-all text-white"
         >
            <X size={24} class="text-white group-hover:text-white" />
         </button>
      {/if}
   </div>
</header>

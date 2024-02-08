<script lang="ts">
   import { fade } from 'svelte/transition';

   import Chat from '../components/Chat/index.svelte';
   import ChatsSidebar from '../components/ChatsSidebar/index.svelte';
   import ChatDetail from '../components/ChatDetails/index.svelte';

   import { chatState } from '../contexts/chat-context/stores/chat';
</script>

<svelte:head>
   <title>ProxyMity - Chat</title>
</svelte:head>

<main class="flex flex-1 p-4 h-full gap-4 overflow-hidden m-auto max-w-[1980px] w-full">
   <ChatsSidebar />

   {#if $chatState.selectedConversation}
      <Chat />
   {:else}
      <div class="flex items-center justify-center flex-1">
         <img src="no-messages.svg" alt="No chat was selected." />
      </div>
   {/if}

   {#if $chatState.showConversationDetail}
      <ChatDetail />
   {/if}
</main>

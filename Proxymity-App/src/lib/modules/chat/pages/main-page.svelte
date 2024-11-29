<script lang="ts">
   import Chat from '../components/chat/index.svelte';
   import ChatDetail from '../components/chat-details/index.svelte';
   import ChatsSidebar from '../components/chats-sidebar/index.svelte';

   import { chatState } from '../contexts/chat-context/stores/chat';
</script>

<main class="flex flex-1 h-full overflow-hidden w-full bg-[url('/chat-background.svg')] bg-cover bg-no-repeat">
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

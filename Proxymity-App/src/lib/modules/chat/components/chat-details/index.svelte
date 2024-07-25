<script lang="ts">
   import { chatState } from '../../contexts/chat-context/stores/chat';
   import ChatDetailHeader from './chat-detail-header.svelte';
   import ParticipantsContainer from './participants-container/index.svelte';
</script>

{#if $chatState.selectedConversation && $chatState.showConversationDetail}
   <aside class="h-full w-[280px] rounded-[10px] flex flex-col gap-4">
      <ChatDetailHeader />

      {#if $chatState.selectedConversation.isGroup}
         <ParticipantsContainer />
      {/if}
   </aside>
{/if}

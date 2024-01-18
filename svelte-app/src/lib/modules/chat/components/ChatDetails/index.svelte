<script lang="ts">
   import ChatDetailHeader from './ChatDetailHeader.svelte';
   import ParticipantsContainer from './ParticipantsContainer/index.svelte';

   import { chatState } from '../../contexts/chat-context/stores/chat';
</script>

{#if $chatState.selectedConversation && $chatState.showConversationDetail}
   <aside class="h-full w-[280px] rounded-[10px] flex flex-col gap-4 overflow-hidden">
      <ChatDetailHeader />

      {#if $chatState.selectedConversation.isGroup}
         <ParticipantsContainer />
      {/if}
   </aside>
{/if}

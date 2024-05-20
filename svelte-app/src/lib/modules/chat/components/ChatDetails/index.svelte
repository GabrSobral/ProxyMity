<script lang="ts">
   import { chatState } from '../../contexts/chat-context/stores/chat';
   import ChatDetailHeader from './ChatDetailHeader.svelte';
   import ParticipantsContainer from './ParticipantsContainer/index.svelte';

   let { selectedConversation, showConversationDetail } = $chatState;
</script>

{#if selectedConversation && showConversationDetail}
   <aside class="h-full w-[280px] rounded-[10px] flex flex-col gap-4">
      <ChatDetailHeader />

      {#if selectedConversation.isGroup}
         <ParticipantsContainer />
      {/if}
   </aside>
{/if}

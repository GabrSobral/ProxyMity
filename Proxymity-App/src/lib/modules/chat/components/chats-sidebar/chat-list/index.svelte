<script lang="ts">
   import autoAnimate from '@formkit/auto-animate';

   import ChatItem from './chat-item.svelte';
   import ChatItemSkeleton from './chat-item-skeleton.svelte';

   import { chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';

   let pinnedConversations = $derived($chatState.conversations.filter(item => item.conversationPinnedAt).sort());
   let unpinnedConversations = $derived($chatState.conversations.filter(item => !item.conversationPinnedAt));
</script>

<section class="flex flex-col gap-3 transition-all relative overflow-hidden flex-1">
   {#if pinnedConversations.length}
      <div class="flex flex-col gap-[2px] rounded-md bg-gray-950 px-1 py-2" role="list" use:autoAnimate>
         {#if $chatState.isFetchingConversations}
            {#each [0, 1, 2, 3] as _}
               <ChatItemSkeleton />
            {/each}
         {:else}
            {#each pinnedConversations as conversation (conversation.id)}
               <ChatItem {conversation} />
            {/each}
         {/if}
      </div>
   {/if}

   <div class="flex flex-col gap-[2px] overflow-auto rounded-md h-full p-1" role="list" use:autoAnimate>
      {#if $chatState.isFetchingConversations}
         {#each [0, 1, 2, 3] as _}
            <ChatItemSkeleton />
         {/each}
      {:else}
         {#each unpinnedConversations as conversation (conversation.id)}
            <ChatItem {conversation} />
         {/each}
      {/if}
   </div>
</section>

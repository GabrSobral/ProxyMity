<script lang="ts">
   import { UserPlus } from 'lucide-svelte';
   import autoAnimate from '@formkit/auto-animate';

   import Heading from '$lib/design-system/Heading.svelte';

   import { Button } from '$lib/components/ui/button';
   import CreateConversationModal from '$lib/modules/chat/components/CreateConversationModal/index.svelte';

   import ChatItem from './ChatItem.svelte';

   import { chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';
   import ChatItemSkeleton from './ChatItemSkeleton.svelte';
   import { appColor } from '../../../../../../contexts/theme/store';
   import Text from '$lib/design-system/Text.svelte';

   $: allNotificationsCount = $chatState.conversations.reduce((accumulator, curr) => accumulator + curr.notifications, 0);

   let isNewContactModalOpened = false;
   let closeSettingsModal = () => {
      isNewContactModalOpened = false;
   };

   $: pinnedConversations = $chatState.conversations.filter(item => item.conversationPinnedAt).sort();
   $: unpinnedConversations = $chatState.conversations.filter(item => !item.conversationPinnedAt);
</script>

<section class="flex flex-col gap-3 transition-all relative overflow-hidden flex-1">
   <div class="flex gap-4 justify-between px-3">
      <Heading size="md" className="flex gap-3 items-center">
         Chats

         {#if allNotificationsCount > 0}
            <span
               class="bg-purple-500 text-white rounded-full p-1 text-[0.6rem] flex items-center justify-center max-w-[1.25rem] max-h-[1.25rem] min-w-[1.25rem] min-h-[1.25rem]"
            >
               {allNotificationsCount}
            </span>
         {/if}
      </Heading>

      <Button
         class=""
         variant={$appColor}
         on:click={() => {
            isNewContactModalOpened = true;
         }}
         aria-label="add a new contact to your contact list"
      >
         <UserPlus size={24} /> Create chat
      </Button>
   </div>

   {#if pinnedConversations.length}
      <div class="flex flex-col gap-[2px] rounded-md bg-gray-100 dark:bg-gray-950 px-1 py-2" role="list" use:autoAnimate>
         <Text size="md">Pinned</Text>

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

   <div
      class="flex flex-col gap-[2px] overflow-auto rounded-md h-full dark:bg-black border dark:border-gray-900 border-gray-200 bg-white p-1 rounded-[10px]"
      role="list"
      use:autoAnimate
   >
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

   <CreateConversationModal closeModal={closeSettingsModal} isOpened={isNewContactModalOpened} />
</section>

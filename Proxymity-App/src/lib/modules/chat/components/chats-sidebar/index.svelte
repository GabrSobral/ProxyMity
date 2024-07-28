<script lang="ts">
   import { MessageSquarePlus, Search } from 'lucide-svelte';

   import ChatList from './chat-list/index.svelte';

   import Heading from '$lib/design-system/heading.svelte';
   import InputGroup from '$lib/design-system/Input/InputGroup.svelte';

   import CreateConversationModal from '$lib/modules/chat/components/create-conversation-modal/index.svelte';
   import { chatState } from '../../contexts/chat-context/stores/chat';

   let isNewContactModalOpened = $state(false);
   let allNotificationsCount = $derived(
      $chatState.conversations.reduce((accumulator, curr) => accumulator + curr.notifications, 0)
   );

   let closeSettingsModal = () => {
      isNewContactModalOpened = false;
   };
</script>

<aside
   class="h-full min-w-[17rem] border-r border-gray-900 p-2 flex flex-col gap-3 bg-gradient-to-br from-[#136DCE]/50 via-[22%] via-black/20 backdrop-blur"
>
   <div class="flex gap-4 justify-between px-3">
      <Heading size="lg" class="flex gap-3 items-center">
         Messages

         {#if allNotificationsCount > 0}
            <span
               class="bg-purple-500 text-white rounded-full p-1 text-[0.6rem] flex items-center justify-center max-w-[1.25rem] max-h-[1.25rem] min-w-[1.25rem] min-h-[1.25rem]"
            >
               {allNotificationsCount}
            </span>
         {/if}
      </Heading>

      <button
         class="p-2 flex items-center rounded-md text-white justify-center bg-purple-500 shadow-purple-500 shadow-[0_0_30px]"
         onclick={() => {
            isNewContactModalOpened = true;
         }}
         title="Create a new conversation"
         aria-label="add a new contact to your contact list"
      >
         <MessageSquarePlus size={24} />
      </button>
   </div>

   <InputGroup let:Label let:Input let:Wrapper>
      <Label className="sr-only">Search</Label>

      <Wrapper className="w-full justify-between px-3">
         <Input type="search" placeholder="Search..." className="pr-12 bg-gray-950" />

         <Search
            class="text-white transition-colors opacity-60 absolute right-6 top-2/4 -translate-y-2/4 pointer-events-none"
            size={24}
         />
      </Wrapper>
   </InputGroup>

   <CreateConversationModal closeModal={closeSettingsModal} isOpened={isNewContactModalOpened} />

   <ChatList />
</aside>

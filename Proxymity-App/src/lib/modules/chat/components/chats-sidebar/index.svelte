<script lang="ts">
   import { MessageSquarePlus, PanelLeft, Search } from 'lucide-svelte';

   import ChatList from './chat-list/index.svelte';

   import Heading from '$lib/design-system/heading.svelte';
   import InputGroup from '$lib/design-system/Input/InputGroup.svelte';

   import CreateConversationModal from '$lib/modules/chat/components/create-conversation-modal/index.svelte';

   import { chatState } from '../../contexts/chat-context/stores/chat';
   import { twMerge } from 'tailwind-merge';
   import clsx from 'clsx';

   let isNewContactModalOpened = $state(false);
   let allNotificationsCount = $derived(
      $chatState.conversations.reduce((accumulator, curr) => accumulator + curr.notifications, 0)
   );

   let closeSettingsModal = () => {
      isNewContactModalOpened = false;
   };

   let isCollapsed = $state(false);
</script>

<aside
   class={twMerge(
      clsx(
         'lg:min-w-[17rem]overflow-hidden border-r max-w-max border-gray-900 p-2 flex flex-col gap-2 bg-gradient-to-br from-[#136DCE]/50 via-[22%] via-black/20 backdrop-blur transition-all duration-300',
         {
            'max-w-[4rem] w-[4rem] px-0 min-w-0': isCollapsed,
         }
      )
   )}
>
   <div class="flex gap-4 justify-between px-1 transition-all">
      {#if !isCollapsed}
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
      {/if}

      <div class="flex gap-4 flex-wrap">
         <button
            class={twMerge(
               clsx(
                  'p-2 flex items-center rounded-md text-white justify-center bg-purple-500 shadow-purple-500 shadow-[0_0_30px] transition-all',
                  {
                     'min-w-[3.45rem] min-h-[3.45rem]': isCollapsed,
                  }
               )
            )}
            onclick={() => {
               isNewContactModalOpened = true;
            }}
            title="Create a new conversation"
            aria-label="add a new contact to your contact list"
         >
            <MessageSquarePlus size={24} />
         </button>

         <button
            type="button"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            class="flex items-center justify-center flex-1"
            onclick={() => {
               isCollapsed = !isCollapsed;
            }}
         >
            <PanelLeft size={24} class="text-white" />
         </button>
      </div>
   </div>

   {#if !isCollapsed}
      <InputGroup let:Label let:Input let:Wrapper class="px-0 p-0 w-full">
         <Label className="sr-only">Search</Label>

         <Wrapper className="w-full justify-between px-1">
            <Input type="search" placeholder="Search..." className="w-full pr-12 bg-gray-950" />
            <Search class="absolute right-0 top-0 bottom-0 m-auto mr-3 text-gray-400" size={24} />
         </Wrapper>
      </InputGroup>
   {/if}

   <CreateConversationModal closeModal={closeSettingsModal} isOpened={isNewContactModalOpened} />

   <ChatList />
</aside>

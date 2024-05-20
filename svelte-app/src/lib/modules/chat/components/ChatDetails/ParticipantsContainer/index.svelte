<script lang="ts">
   import clsx from 'clsx';
   import { ChevronDown, UsersRound } from 'lucide-svelte';

   import Heading from '$lib/design-system/Heading.svelte';
   import ParticipantsList from './ParticipantsList.svelte';

   import { chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';

   let isCollapsed = $state(false);

   let { selectedConversation } = $chatState;
</script>

<section class="flex flex-col dark:bg-gray-900 bg-white transition-all h-fit rounded-[10px] overflow-hidden relative shadow-md">
   <!-- svelte-ignore a11y_click_events_have_key_events -->
   <div
      role="button"
      tabindex="-1"
      onclick={() => {
         isCollapsed = !isCollapsed;
      }}
   >
      <Heading
         size="sm"
         class="text-white w-full dark:bg-black bg-gray-100 px-4 py-2 flex gap-2 items-center justify-between cursor-pointer hover:brightness-90 transition-all"
      >
         <span class="flex gap-2 text-gray-700 dark:text-white transition-colors">
            <UsersRound size={24} className="text-gray-700 dark:text-white transition-colors" /> Participants -{' '}
            {selectedConversation?.participants.length}
         </span>

         <ChevronDown
            size={24}
            class={clsx('text-gray-700 dark:text-white transition-all', {
               'rotate-180': !isCollapsed,
            })}
         />
      </Heading>
   </div>

   <div
      data-is-collapsed={isCollapsed}
      class={'max-h-80 h-80  data-[is-collapsed=true]:max-h-0 data-[is-collapsed=true]:h-0 transition-all overflow-hidden duration-300'}
   >
      <ParticipantsList />
   </div>

   <div
      data-is-collapsed={isCollapsed}
      class="absolute bottom-0 h-10 w-full z-10 bg-gradient-to-t data-[is-collapsed=true]:max-h-0 max-h-10 dark:from-gray-950 from-gray-200 transition-all pointer-events-none"
   ></div>
</section>

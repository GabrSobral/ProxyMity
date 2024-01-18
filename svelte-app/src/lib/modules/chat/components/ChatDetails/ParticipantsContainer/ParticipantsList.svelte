<script lang="ts">
   import { page } from '$app/stores';
   import { User } from 'lucide-svelte';

   import Text from '$lib/design-system/Text.svelte';

   import { chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';

   $: user = $page.data.session?.user;
</script>

<ul class="p-1 flex flex-col gap-1 transition-all overflow-y-scroll">
   {#each $chatState.selectedConversation?.participants || [] as participant (participant.id)}
      <li
         class="w-full relative py-2 px-3 rounded-[6px] flex gap-4 hover:opacity-90 transition-colors group dark:bg-gray-800 bg-white shadow"
      >
         <div class="relative min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px]">
            <div
               class="min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] rounded-full z-0 shadow-xl flex items-center justify-center bg-gray-700"
            >
               <User size={20} class="text-white" />
            </div>
         </div>

         <div class={'flex flex-col gap-1 overflow-hidden w-full z-10'}>
            <Text size="md" className={`truncate font-medium flex items-center justify-between gap-3`}>
               {participant.name}
               {participant.id === user?.id && '(You)'}
               <span class="text-[12px] text-green-400 ml-auto">Online</span>
            </Text>

            <div class={'truncate flex justify-between gap-4 text-gray-200 text-sm'}>
               <Text size="sm" className="text-gray-400">
                  {participant.email}
               </Text>
            </div>
         </div>
      </li>
   {/each}
</ul>

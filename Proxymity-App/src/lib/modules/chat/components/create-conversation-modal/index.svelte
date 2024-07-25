<script lang="ts">
   import clsx from 'clsx';
   import { cubicInOut } from 'svelte/easing';
   import { crossfade } from 'svelte/transition';

   import { cn } from '$lib/utils';

   import * as Dialog from '$lib/design-system/dialog';

   import GroupConversation from './group-conversation.svelte';
   import PrivateConversation from './private-conversation.svelte';

   import { appColor } from '../../../../../contexts/theme/store';
   import { twMerge } from 'tailwind-merge';

   export let isOpened: boolean = false;
   export let closeModal: () => void;

   let selectedPanel: 'Private' | 'Group' = 'Private';
   const items: ['Private', 'Group'] = ['Private', 'Group'];

   function selectPanel(panel: 'Private' | 'Group') {
      selectedPanel = panel;
   }

   const [send, receive] = crossfade({
      duration: 250,
      easing: cubicInOut,
   });
</script>

<Dialog.Root {isOpened} closeDialog={closeModal}>
   <Dialog.Panel
      class={twMerge(
         clsx('min-w-[40rem] overflow-auto flex flex-col h-[90%] w-fit transition-all duration-500', {
            'max-w-[70rem]': selectedPanel === 'Group',
         })
      )}
   >
      <div class="space-y-5">
         <Dialog.Title>Create chat</Dialog.Title>

         <Dialog.Description>
            Seamlessly establish private or group conversations with ease. Whether you're fostering one-on-one connections or
            collaborating with teams, this intuitive modal lets you initiate real-time communication effortlessly.
         </Dialog.Description>
      </div>

      <div class="flex">
         <nav class={cn('flex space-x-2')}>
            {#each items as item (item)}
               {@const isActive = item === selectedPanel}

               <button
                  on:click={() => selectPanel(item)}
                  class={cn(!isActive && 'hover:underline', 'text-white px-2 py-2 relative justify-start hover:bg-transparent')}
                  data-sveltekit-noscroll
               >
                  {#if isActive}
                     <div
                        class={clsx('absolute inset-0 rounded-md transition-all', {
                           'bg-purple-500 text-white': $appColor === 'purple',
                           'bg-green-500': $appColor === 'green',
                           'bg-blue-500 text-white': $appColor === 'blue',
                           'bg-red-500 text-white': $appColor === 'red',
                           'bg-gray-700 text-white': $appColor === 'gray',
                        })}
                        in:send={{ key: 'active-sidebar-tab' }}
                        out:receive={{ key: 'active-sidebar-tab' }}
                     ></div>
                  {/if}

                  <div class={clsx('relative transition-colors', { 'text-white ': isActive })}>
                     {item}
                  </div>
               </button>
            {/each}
         </nav>
      </div>

      {#if selectedPanel === 'Private'}
         <PrivateConversation {closeModal} />
      {:else}
         <GroupConversation {closeModal} />
      {/if}
   </Dialog.Panel>
</Dialog.Root>

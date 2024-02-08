<script lang="ts">
   import { cubicInOut } from 'svelte/easing';
   import Button from '$lib/components/ui/button/button.svelte';
   import * as Dialog from '$lib/components/ui/dialog';
   import Separator from '$lib/components/ui/separator/separator.svelte';
   import { cn } from '$lib/utils';
   import { writable } from 'svelte/store';
   import { appColor } from '../../../../../contexts/theme/store';
   import { crossfade } from 'svelte/transition';
   import clsx from 'clsx';

   export let isOpened: boolean = false;
   export let closeModal: () => void;

   let selectedPanel: 'Private' | 'Group' = 'Private';

   function selectPanel(panel: 'Private' | 'Group') {
      selectedPanel = panel;
   }

   const onChangeFn = writable((change: boolean) => {
      if (!change) {
         closeModal();
      }
   });

   const items: ['Private', 'Group'] = ['Private', 'Group'];

   const [send, receive] = crossfade({
      duration: 250,
      easing: cubicInOut,
   });
</script>

<Dialog.Root bind:open={isOpened} bind:onOpenChange={$onChangeFn}>
   <Dialog.Trigger />

   <Dialog.Content class="min-w-[40rem] h-[90%] overflow-auto flex flex-col">
      <div class="space-y-5">
         <Dialog.Title>Create chat</Dialog.Title>

         <Dialog.Description>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusamus illo dolorum est in neque non, omnis provident?
            Ratione, corrupti eveniet? Quaerat veniam doloremque alias autem dolorum temporibus qui quas tenetur!
         </Dialog.Description>
      </div>

      <Separator class="my-2" />

      <div class="flex">
         <nav class={cn('flex space-x-2')}>
            {#each items as item (item)}
               {@const isActive = item === selectedPanel}

               <Button
                  on:click={() => selectPanel(item)}
                  variant="ghost"
                  class={cn(!isActive && 'hover:underline', 'relative justify-start hover:bg-transparent')}
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
                     />
                  {/if}

                  <div class={clsx('relative transition-colors', { 'text-white ': isActive })}>
                     {item}
                  </div>
               </Button>
            {/each}
         </nav>
      </div>
   </Dialog.Content>
</Dialog.Root>

<script lang="ts">
   import clsx from 'clsx';
   import { cubicInOut } from 'svelte/easing';
   import { crossfade } from 'svelte/transition';

   import { cn } from '$lib/utils';
   import Button from '$lib/components/ui/button/button.svelte';
   import { appColor } from '../../../contexts/theme/store';

   let className: string | undefined | null = undefined;

   export { className as class };

   export let items: ['Profile', 'Appearance'];
   export let selectedPanel: 'Profile' | 'Appearance';
   export let selectPanel: (panel: 'Profile' | 'Appearance') => void;

   const [send, receive] = crossfade({
      duration: 250,
      easing: cubicInOut,
   });
</script>

<nav class={cn('flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1', className)}>
   {#each items as item}
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

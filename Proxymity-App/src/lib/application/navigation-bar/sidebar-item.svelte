<script lang="ts">
   import clsx from 'clsx';
   import { page } from '$app/stores';
   import { twMerge } from 'tailwind-merge';
   import { Briefcase, ChevronDown, MessageSquareText, Settings } from 'lucide-svelte';

   let isOpened = $state(false);

   type Props = {
      isCollapsed: boolean;
      title: { icon: string; label: string };
      items: { icon: 'message' | 'settings'; label: string; path?: string; onclick?: (() => void) | (() => Promise<void>) }[];
   };

   let { isCollapsed, title, items }: Props = $props();
</script>

<div class={twMerge(clsx('bg-gray-950/90 rounded-lg py-4 px-3 flex flex-col gap-0 transition-all ', { 'gap-3': !isOpened }))}>
   <button
      type="button"
      data-is-collapsed={isCollapsed}
      class={twMerge('gap-4 text-white w-full justify-between flex data-[is-collapsed=true]:justify-center transition-all')}
      onclick={() => {
         isOpened = !isOpened;
      }}
   >
      <span class="flex gap-4 font-bold text-md">
         <Briefcase size={22} class="text-white" />
         {#if !isCollapsed}
            {title.label}
         {/if}
      </span>

      {#if !isCollapsed}
         <ChevronDown size={22} class="text-white" />
      {/if}
   </button>

   <ul class={twMerge(clsx('flex flex-col overflow-hidden py-1', { 'max-h-0 py-0': isOpened || isCollapsed }))}>
      {#each items as item}
         <li class="text-white text-sm flex gap-4 cursor-pointer group">
            <div class="w-[2px] bg-gray-800 ml-2"></div>

            {#if item.onclick !== undefined && item.path === undefined}
               <button
                  type="button"
                  onclick={item.onclick}
                  class={twMerge(
                     clsx('flex gap-2 rounded-lg group-hover:underline w-full p-2 px-4 items-center', {
                        'bg-purple-500/50 text-purple-200 ': item.path === $page.route.id,
                     })
                  )}
               >
                  {#if item.icon === 'message'}<MessageSquareText size={22} class="text-purple-200" />{/if}
                  {#if item.icon === 'settings'}<Settings size={22} class="text-purple-200" />{/if}
                  {item.label}
               </button>
            {:else}
               <a
                  href={item.path}
                  data-sveltekit-preload-data
                  class={twMerge(
                     clsx('flex gap-2 rounded-lg group-hover:underline w-full p-2 px-4 items-center', {
                        'bg-purple-500/50 text-purple-200 ': item.path === $page.route.id,
                     })
                  )}
               >
                  {#if item.icon === 'message'}<MessageSquareText size={22} class="text-purple-200" />{/if}
                  {#if item.icon === 'settings'}<Settings size={22} class="text-purple-200" />{/if}
                  {item.label}
               </a>
            {/if}
         </li>
      {/each}
   </ul>
</div>

<script lang="ts">
   import { fade, scale } from 'svelte/transition';
   import { melt, type DialogElements } from '@melt-ui/svelte';

   import Sidebar from './Sidebar.svelte';

   export let show: boolean;
   export let settingsDialogConfig: { elements: DialogElements };

   let {
      elements: { content, overlay, portalled },
   } = settingsDialogConfig;

   $: internalShow = show;
</script>

<div use:melt={$portalled}>
   {#if internalShow}
      <div use:melt={$overlay} class="fixed inset-0 z-50 bg-black/50" transition:fade={{ duration: 150 }}>
         <div
            class="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg"
            transition:scale={{ start: 0.9, opacity: 0 }}
            use:melt={$content}
         >
            <Sidebar />

            <main class=""></main>
         </div>
      </div>
   {/if}
</div>
